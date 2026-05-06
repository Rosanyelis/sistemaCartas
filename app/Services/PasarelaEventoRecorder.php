<?php

namespace App\Services;

use App\Models\PasarelaEvento;

final class PasarelaEventoRecorder
{
    /**
     * Idempotencia por `paypal_event_id` cuando viene de webhooks PayPal.
     *
     * @param  array<string, mixed>  $payload
     */
    public static function recordOrFetchByPayPalEventId(
        ?string $paypalEventId,
        string $eventType,
        string $estado,
        array $payload,
        ?string $mensajeError = null,
        ?int $storeOrderId = null,
        ?int $suscripcionId = null,
    ): PasarelaEvento {
        if (is_string($paypalEventId) && $paypalEventId !== '') {
            $existing = PasarelaEvento::query()->where('paypal_event_id', $paypalEventId)->first();
            if ($existing !== null) {
                return $existing;
            }
        }

        return PasarelaEvento::query()->create([
            'paypal_event_id' => (is_string($paypalEventId) && $paypalEventId !== '') ? $paypalEventId : null,
            'event_type' => $eventType,
            'estado' => $estado,
            'payload' => $payload,
            'mensaje_error' => $mensajeError,
            'store_order_id' => $storeOrderId,
            'suscripcion_id' => $suscripcionId,
        ]);
    }
}
