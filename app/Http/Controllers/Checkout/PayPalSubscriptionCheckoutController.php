<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\CreatePayPalSubscriptionRequest;
use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\StoreOrder;
use App\Models\Suscripcion;
use App\Services\HistoriaPayPalPlanService;
use App\Services\PasarelaEventoRecorder;
use App\Services\PayPalService;
use App\Support\HistoriaSuscripcionPrecio;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Throwable;

class PayPalSubscriptionCheckoutController extends Controller
{
    public function draft(
        CreatePayPalSubscriptionRequest $request,
        HistoriaPayPalPlanService $plans,
        PayPalService $payPal,
    ): JsonResponse {
        if (! config('paypal.enabled')) {
            return response()->json([
                'message' => 'PayPal no está configurado.',
            ], 503);
        }

        $user = $request->user();
        if ($user === null) {
            return response()->json(['message' => 'Debes iniciar sesión.'], 401);
        }

        $historia = Historia::query()
            ->where('slug', $request->validated('historia_slug'))
            ->where('estado', 'activo')
            ->firstOrFail();

        if (Suscripcion::query()
            ->where('user_id', $user->id)
            ->where('historia_id', $historia->id)
            ->where('estado', 'activa')
            ->exists()) {
            return response()->json([
                'message' => 'Ya tienes una suscripción activa a esta historia.',
            ], 422);
        }

        $storeOrderId = $request->validated('store_order_id');
        $storeOrder = null;
        if ($storeOrderId !== null) {
            $storeOrder = StoreOrder::query()
                ->whereKey($storeOrderId)
                ->where('user_id', $user->id)
                ->first();
            if ($storeOrder === null) {
                return response()->json([
                    'message' => 'La orden indicada no pertenece a tu cuenta.',
                ], 422);
            }
        }

        $planId = $plans->ensureBillingPlanForHistoria($historia);
        $historia->refresh();

        $mesesEntregaTotal = HistoriaSuscripcionPrecio::mesesEntregaTotal($historia);
        $intervaloFacturacion = HistoriaSuscripcionPrecio::intervaloMeses($historia);

        $fechaAdquisicion = now()->toDateString();
        $fechaFinalizacion = $mesesEntregaTotal !== null
            ? Carbon::parse($fechaAdquisicion)
                ->addMonths($mesesEntregaTotal)
                ->toDateString()
            : null;
        $proximoCobro = Carbon::parse($fechaAdquisicion)
            ->addMonths($intervaloFacturacion)
            ->toDateString();

        $suscripcion = Suscripcion::query()->create([
            'user_id' => $user->id,
            'historia_id' => $historia->id,
            'store_order_id' => $storeOrder?->id,
            'tipo' => 'PayPal',
            'cantidad' => 1,
            'meses_entrega_total' => $mesesEntregaTotal,
            'fecha_adquisicion' => $fechaAdquisicion,
            'fecha_finalizacion' => $fechaFinalizacion,
            'proximo_cobro' => $proximoCobro,
            'estado' => 'pendiente',
            'paypal_product_id' => $historia->paypal_product_id,
            'paypal_plan_id' => $planId,
        ]);

        $brandName = trim((string) config('app.name'));
        if ($brandName === '') {
            $brandName = 'Historias por Correo';
        }

        [$returnUrl, $cancelUrl] = $payPal->subscriptionApplicationRedirectUrls();

        try {
            $sub = $payPal->createSubscriptionDraft(
                $planId,
                (string) $suscripcion->id,
                $brandName,
                $returnUrl,
                $cancelUrl,
            );
        } catch (Throwable $e) {
            report($e);
            $suscripcion->delete();

            return response()->json([
                'message' => 'No se pudo crear la suscripción en PayPal.',
                'detail' => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
            ], 502);
        }

        $suscripcion->update([
            'paypal_subscription_id' => $sub['id'],
            'paypal_last_payload' => $sub['raw'],
        ]);

        PasarelaEventoRecorder::recordOrFetchByPayPalEventId(
            null,
            'SUBSCRIPTION_DRAFT_CREATED',
            PasarelaEvento::ESTADO_PENDIENTE,
            $sub['raw'],
            null,
            null,
            $suscripcion->id,
        );

        return response()->json([
            'subscriptionID' => $sub['id'],
            'localSuscripcionId' => $suscripcion->id,
        ]);
    }
}
