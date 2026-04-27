<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CapturePayPalOrderRequest;
use App\Http\Requests\Checkout\CreatePayPalOrderRequest;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Services\PayPalService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class PayPalCheckoutController extends Controller
{
    public function createOrder(CreatePayPalOrderRequest $request, PayPalService $payPal): JsonResponse
    {
        if (! config('paypal.enabled')) {
            return response()->json([
                'message' => 'PayPal no está configurado. Añade PAYPAL_CLIENT_ID y PAYPAL_CLIENT_SECRET en .env',
            ], 503);
        }

        $items = $request->validated('items');
        $resolved = [];
        $total = 0.0;

        foreach ($items as $line) {
            $producto = Producto::query()
                ->where('slug', $line['slug'])
                ->where('estado', 'activo')
                ->first();

            if ($producto === null) {
                return response()->json(['message' => 'Producto no encontrado.'], 422);
            }

            $qty = $line['quantity'];

            if ($producto->stock < $qty) {
                return response()->json([
                    'message' => 'Stock insuficiente para «'.$producto->nombre.'».',
                ], 422);
            }

            $unitPrice = (float) $producto->precio;
            $lineTotal = round($unitPrice * $qty, 2);
            $total += $lineTotal;
            $resolved[] = [
                'product' => [
                    'slug' => $producto->slug,
                    'name' => $producto->nombre,
                    'unit_price' => $unitPrice,
                ],
                'quantity' => $qty,
                'line_total' => $lineTotal,
            ];
        }

        $total = round($total, 2);
        $amount = number_format($total, 2, '.', '');

        try {
            $orderId = $payPal->createOrder($amount, (string) config('paypal.currency'));
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'No se pudo crear la orden en PayPal. Revisa credenciales sandbox y vuelve a intentarlo.',
                'detail' => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
            ], 502);
        }

        try {
            DB::transaction(function () use ($request, $orderId, $total, $resolved): void {
                $order = StoreOrder::query()->create([
                    'user_id' => $request->user()?->id,
                    'paypal_order_id' => $orderId,
                    'status' => StoreOrder::STATUS_PENDING_PAYMENT,
                    'currency' => strtoupper((string) config('paypal.currency')),
                    'total' => $total,
                ]);

                foreach ($resolved as $row) {
                    $product = $row['product'];
                    $order->items()->create([
                        'product_slug' => $product['slug'],
                        'product_name' => $product['name'],
                        'quantity' => $row['quantity'],
                        'unit_price' => $product['unit_price'],
                        'line_total' => $row['line_total'],
                    ]);
                }
            });
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'La orden se creó en PayPal pero no se pudo guardar en el sistema. Contacta soporte con el id de PayPal.',
                'orderId' => $orderId,
            ], 500);
        }

        return response()->json([
            'orderId' => $orderId,
            'localOrderId' => StoreOrder::query()->where('paypal_order_id', $orderId)->value('id'),
        ]);
    }

    public function capture(CapturePayPalOrderRequest $request, PayPalService $payPal): JsonResponse
    {
        if (! config('paypal.enabled')) {
            return response()->json([
                'message' => 'PayPal no está configurado.',
            ], 503);
        }

        $orderId = $request->validated('order_id');

        try {
            return DB::transaction(function () use ($orderId, $payPal): JsonResponse {
                $storeOrder = StoreOrder::query()
                    ->where('paypal_order_id', $orderId)
                    ->lockForUpdate()
                    ->first();

                if ($storeOrder === null) {
                    return response()->json([
                        'message' => 'Orden no encontrada. Vuelve a iniciar el pago desde el carrito.',
                    ], 404);
                }

                if ($storeOrder->status === StoreOrder::STATUS_PAID) {
                    return response()->json([
                        'status' => 'completed',
                        'localOrderId' => $storeOrder->id,
                        'paypal' => $storeOrder->paypal_capture_payload,
                    ]);
                }

                if ($storeOrder->status !== StoreOrder::STATUS_PENDING_PAYMENT) {
                    return response()->json([
                        'message' => 'Esta orden ya no puede completarse.',
                    ], 409);
                }

                try {
                    $payload = $payPal->captureOrder($orderId);
                } catch (RequestException $e) {
                    $parsed = PayPalService::parseErrorFromThrowable($e) ?? [
                        'name' => null,
                        'message' => null,
                    ];
                    $storeOrder->update([
                        'status' => StoreOrder::STATUS_CAPTURE_FAILED,
                        'failure_message' => $parsed['message'] ?? $e->getMessage(),
                        'failure_payload' => $e->response?->json() ?? ['raw' => $e->getMessage()],
                    ]);
                    report($e);

                    $hint = $parsed['message'] ?? 'Intenta de nuevo o usa otro método.';

                    return response()->json([
                        'message' => 'PayPal rechazó la captura. '.$hint,
                        'paypal_error' => $parsed['name'],
                    ], 422);
                } catch (Throwable $e) {
                    $storeOrder->update([
                        'status' => StoreOrder::STATUS_CAPTURE_FAILED,
                        'failure_message' => $e->getMessage(),
                        'failure_payload' => ['exception' => $e::class],
                    ]);
                    report($e);

                    return response()->json([
                        'message' => 'No se pudo capturar el pago en PayPal.',
                        'detail' => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
                    ], 502);
                }

                $meta = PayPalService::extractCaptureMeta($payload);

                $storeOrder->update([
                    'status' => StoreOrder::STATUS_PAID,
                    'paypal_capture_id' => $meta['capture_id'],
                    'paypal_capture_status' => $meta['capture_status'],
                    'paypal_capture_payload' => $payload,
                    'failure_message' => null,
                    'failure_payload' => null,
                ]);

                return response()->json([
                    'status' => 'completed',
                    'localOrderId' => $storeOrder->id,
                    'paypal' => $payload,
                ]);
            });
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Error interno al confirmar el pago.',
                'detail' => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
            ], 500);
        }
    }
}
