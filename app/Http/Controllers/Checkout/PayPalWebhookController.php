<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Mail\Checkout\PaymentFailedMail;
use App\Mail\Checkout\SubscriptionActivatedMail;
use App\Mail\Checkout\SubscriptionRenewedMail;
use App\Models\PasarelaEvento;
use App\Models\Suscripcion;
use App\Services\PayPalService;
use App\Support\PayPalErrorMessage;
use App\Support\SuscripcionPayPalActivationSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PayPalWebhookController extends Controller
{
    public function __invoke(Request $request, PayPalService $payPal): JsonResponse
    {
        /** @var array<string, mixed> $payload */
        $payload = $request->json()->all();
        $eventId = isset($payload['id']) && is_string($payload['id']) ? $payload['id'] : null;
        $eventType = isset($payload['event_type']) && is_string($payload['event_type'])
            ? $payload['event_type']
            : 'UNKNOWN';

        if ($eventId !== null && PasarelaEvento::query()->where('paypal_event_id', $eventId)->exists()) {
            return response()->json(['status' => 'duplicate']);
        }

        $webhookId = (string) config('paypal.webhook_id');
        $verify = (bool) config('paypal.webhook_verify', true);

        if ($verify && $webhookId !== '') {
            $ok = $payPal->verifyWebhookSignature(
                $webhookId,
                $payload,
                $request->header('PAYPAL-TRANSMISSION-ID'),
                $request->header('PAYPAL-TRANSMISSION-TIME'),
                $request->header('PAYPAL-CERT-URL'),
                $request->header('PAYPAL-AUTH-ALGO'),
                $request->header('PAYPAL-TRANSMISSION-SIG'),
            );
            if (! $ok) {
                return response()->json(['message' => 'Firma de webhook no válida'], 400);
            }
        } elseif ($verify && $webhookId === '' && ! app()->environment('testing')) {
            Log::warning('Webhook PayPal sin PAYPAL_WEBHOOK_ID: la firma no se verifica');
        }

        try {
            match ($eventType) {
                'BILLING.SUBSCRIPTION.ACTIVATED' => $this->handleSubscriptionActivated($payload, $eventId),
                'BILLING.SUBSCRIPTION.CANCELLED' => $this->handleSubscriptionCancelled($payload, $eventId),
                'BILLING.SUBSCRIPTION.SUSPENDED' => $this->handleSubscriptionSuspended($payload, $eventId),
                'BILLING.SUBSCRIPTION.PAYMENT.FAILED' => $this->handleSubscriptionPaymentFailed($payload, $eventId),
                'PAYMENT.SALE.COMPLETED' => $this->handlePaymentSaleCompleted($payload, $eventId),
                default => $this->recordUnhandledEvent($payload, $eventId, $eventType),
            };
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['message' => 'Error al procesar el evento'], 500);
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionActivated(array $payload, ?string $eventId): void
    {
        $resource = $payload['resource'] ?? [];
        if (! is_array($resource)) {
            return;
        }

        $paypalSubId = isset($resource['id']) && is_string($resource['id']) ? $resource['id'] : null;
        if ($paypalSubId === null) {
            return;
        }

        $suscripcion = Suscripcion::query()->where('paypal_subscription_id', $paypalSubId)->first();
        if ($suscripcion === null && isset($resource['custom_id']) && is_numeric($resource['custom_id'])) {
            $suscripcion = Suscripcion::query()->find((int) $resource['custom_id']);
        }

        if ($suscripcion === null) {
            $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.ACTIVATED', PasarelaEvento::ESTADO_RECHAZADO, $payload, 'Suscripción local no encontrada');

            return;
        }

        $sendMail = SuscripcionPayPalActivationSync::applyFromActivatedResource($suscripcion, $resource);

        $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.ACTIVATED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, $suscripcion->id);

        $suscripcion = $suscripcion->fresh();
        $user = $suscripcion?->user;
        if ($sendMail && $user !== null && $user->email !== null && $user->email !== '') {
            $suscripcion->loadMissing('historia');
            Mail::to($user->email)->send(new SubscriptionActivatedMail($suscripcion));
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionCancelled(array $payload, ?string $eventId): void
    {
        $suscripcion = $this->resolveSuscripcionFromResource($payload['resource'] ?? []);
        if ($suscripcion === null) {
            $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.CANCELLED', PasarelaEvento::ESTADO_RECHAZADO, $payload, 'Suscripción no encontrada');

            return;
        }

        $suscripcion->update([
            'estado' => 'inactiva',
            'paypal_last_payload' => is_array($payload['resource'] ?? null) ? $payload['resource'] : [],
        ]);

        $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.CANCELLED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, $suscripcion->id);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionSuspended(array $payload, ?string $eventId): void
    {
        $suscripcion = $this->resolveSuscripcionFromResource($payload['resource'] ?? []);
        if ($suscripcion === null) {
            $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.SUSPENDED', PasarelaEvento::ESTADO_RECHAZADO, $payload, 'Suscripción no encontrada');

            return;
        }

        $suscripcion->update([
            'estado' => 'inactiva',
            'paypal_last_payload' => is_array($payload['resource'] ?? null) ? $payload['resource'] : [],
        ]);

        $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.SUSPENDED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, $suscripcion->id);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handleSubscriptionPaymentFailed(array $payload, ?string $eventId): void
    {
        $resource = is_array($payload['resource'] ?? null) ? $payload['resource'] : [];
        $suscripcion = $this->resolveSuscripcionFromResource($resource);
        if ($suscripcion === null) {
            $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.PAYMENT.FAILED', PasarelaEvento::ESTADO_RECHAZADO, $payload, 'Suscripción no encontrada');

            return;
        }

        $extracted = $this->extractSubscriptionPaymentFailureFromResource($resource);
        $msg = $extracted['motivoUsuario'];
        $suscripcion->update([
            'estado' => 'pendiente',
            'paypal_last_payload' => $resource,
        ]);

        $this->saveEvent($eventId, 'BILLING.SUBSCRIPTION.PAYMENT.FAILED', PasarelaEvento::ESTADO_RECHAZADO, $payload, $msg, null, $suscripcion->id);

        $user = $suscripcion->user;
        if ($user !== null && $user->email !== null && $user->email !== '') {
            $suscripcion->loadMissing('historia');
            Mail::to($user->email)->send(new PaymentFailedMail(
                $suscripcion,
                $extracted['paypalReasonCode'],
                $extracted['motivoUsuario'],
                $extracted['detallePaypal'],
                $extracted['importeFormateado'],
            ));
        }
    }

    /**
     * @param  array<string, mixed>  $resource
     * @return array{paypalReasonCode: ?string, motivoUsuario: string, detallePaypal: ?string, importeFormateado: ?string}
     */
    private function extractSubscriptionPaymentFailureFromResource(array $resource): array
    {
        $last = data_get($resource, 'billing_info.last_failed_payment');
        if (! is_array($last)) {
            return [
                'paypalReasonCode' => null,
                'motivoUsuario' => 'PayPal no pudo cobrar la renovación de tu suscripción. Revisa el método de pago en tu cuenta PayPal.',
                'detallePaypal' => null,
                'importeFormateado' => null,
            ];
        }

        $code = isset($last['reason_code']) && is_string($last['reason_code']) ? $last['reason_code'] : null;
        $desc = isset($last['reason_description']) && is_string($last['reason_description'])
            ? $last['reason_description']
            : null;
        $mapped = PayPalErrorMessage::fromParsed($code, $desc);
        $value = data_get($last, 'amount.value');
        $cur = data_get($last, 'amount.currency_code');
        $importe = null;
        if (is_string($value) && is_string($cur)) {
            $importe = $cur.' '.number_format((float) $value, 2, ',', '.');
        }

        return [
            'paypalReasonCode' => $code ?? $mapped['code'],
            'motivoUsuario' => $mapped['user_message'],
            'detallePaypal' => $mapped['detail'],
            'importeFormateado' => $importe,
        ];
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function handlePaymentSaleCompleted(array $payload, ?string $eventId): void
    {
        $resource = $payload['resource'] ?? [];
        if (! is_array($resource)) {
            $this->saveEvent($eventId, 'PAYMENT.SALE.COMPLETED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, null);

            return;
        }

        $billingId = $resource['billing_agreement_id'] ?? null;
        if (! is_string($billingId) || $billingId === '') {
            $this->saveEvent($eventId, 'PAYMENT.SALE.COMPLETED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, null);

            return;
        }

        $suscripcion = Suscripcion::query()->where('paypal_subscription_id', $billingId)->first();
        if ($suscripcion === null) {
            $this->saveEvent($eventId, 'PAYMENT.SALE.COMPLETED', PasarelaEvento::ESTADO_RECHAZADO, $payload, 'Suscripción no encontrada para el cobro');

            return;
        }

        $this->saveEvent($eventId, 'PAYMENT.SALE.COMPLETED', PasarelaEvento::ESTADO_COMPLETADO, $payload, null, null, $suscripcion->id);

        $user = $suscripcion->user;
        if ($user !== null && $user->email !== null && $user->email !== '') {
            $suscripcion->loadMissing('historia');
            Mail::to($user->email)->send(new SubscriptionRenewedMail($suscripcion, $resource));
        }
    }

    /**
     * @param  array<string, mixed>  $resource
     */
    private function resolveSuscripcionFromResource(array $resource): ?Suscripcion
    {
        $paypalSubId = isset($resource['id']) && is_string($resource['id']) ? $resource['id'] : null;
        if ($paypalSubId !== null) {
            $byId = Suscripcion::query()->where('paypal_subscription_id', $paypalSubId)->first();
            if ($byId !== null) {
                return $byId;
            }
        }

        if (isset($resource['custom_id']) && is_numeric($resource['custom_id'])) {
            return Suscripcion::query()->find((int) $resource['custom_id']);
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function recordUnhandledEvent(array $payload, ?string $eventId, string $eventType): void
    {
        $this->saveEvent($eventId, $eventType, PasarelaEvento::ESTADO_PENDIENTE, $payload, null, null, null);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function saveEvent(
        ?string $paypalEventId,
        string $eventType,
        string $estado,
        array $payload,
        ?string $mensajeError = null,
        ?int $storeOrderId = null,
        ?int $suscripcionId = null,
    ): void {
        PasarelaEvento::query()->create([
            'paypal_event_id' => $paypalEventId,
            'event_type' => $eventType,
            'estado' => $estado,
            'payload' => $payload,
            'mensaje_error' => $mensajeError,
            'store_order_id' => $storeOrderId,
            'suscripcion_id' => $suscripcionId,
        ]);
    }
}
