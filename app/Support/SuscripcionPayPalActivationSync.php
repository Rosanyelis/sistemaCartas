<?php

namespace App\Support;

use App\Models\Suscripcion;
use Carbon\Carbon;
use Throwable;

/**
 * Unifica fechas y estado al confirmar una suscripción PayPal (webhook ACTIVATED o sync tras onApprove).
 */
final class SuscripcionPayPalActivationSync
{
    /**
     * @param  array<string, mixed>  $resource  Resource del webhook o respuesta GET /v1/billing/subscriptions/{id}
     * @return bool Si debe enviarse correo de activación (pasó de no activa a activa)
     */
    public static function applyFromActivatedResource(Suscripcion $suscripcion, array $resource): bool
    {
        $suscripcion->loadMissing('historia');

        $wasActiva = $suscripcion->estado === 'activa';

        $fechaAdq = now()->toDateString();
        $startRaw = $resource['start_time'] ?? null;
        if (is_string($startRaw) && $startRaw !== '') {
            try {
                $fechaAdq = Carbon::parse($startRaw)->timezone(config('app.timezone'))->toDateString();
            } catch (Throwable) {
                // conservar fecha por defecto
            }
        }

        $proximo = null;
        $nextRaw = data_get($resource, 'billing_info.next_billing_time');
        if (is_string($nextRaw) && $nextRaw !== '') {
            try {
                $proximo = Carbon::parse($nextRaw)->timezone(config('app.timezone'))->toDateString();
            } catch (Throwable) {
                $proximo = null;
            }
        }

        if ($proximo === null && $suscripcion->historia !== null) {
            $proximo = Carbon::parse($fechaAdq)
                ->addMonths(HistoriaSuscripcionPrecio::intervaloMeses($suscripcion->historia))
                ->toDateString();
        }

        $mesesArco = (int) ($suscripcion->meses_entrega_total ?? 0);
        if ($mesesArco < 1 && $suscripcion->historia !== null) {
            $desdeHistoria = HistoriaSuscripcionPrecio::mesesEntregaTotal($suscripcion->historia);
            if ($desdeHistoria !== null) {
                $mesesArco = $desdeHistoria;
            }
        }

        $fechaFin = null;
        if ($mesesArco > 0) {
            $fechaFin = Carbon::parse($fechaAdq)
                ->addMonths($mesesArco)
                ->toDateString();
        }

        $payload = [
            'estado' => 'activa',
            'fecha_adquisicion' => $fechaAdq,
            'fecha_finalizacion' => $fechaFin,
            'proximo_cobro' => $proximo,
            'paypal_last_payload' => $resource,
        ];
        if ($mesesArco >= 1) {
            $payload['meses_entrega_total'] = $mesesArco;
        }
        $suscripcion->update($payload);

        return ! $wasActiva;
    }
}
