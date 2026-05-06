<?php

namespace App\Support;

use App\Models\Historia;

/**
 * Precio e intervalo de facturación de suscripción a historia (PayPal Billing).
 */
final class HistoriaSuscripcionPrecio
{
    public static function montoPorCiclo(Historia $historia): float
    {
        if ($historia->precio_suscripcion !== null && (float) $historia->precio_suscripcion > 0) {
            return round((float) $historia->precio_suscripcion, 2);
        }

        $promo = $historia->precio_promocional;
        if ($promo !== null && (float) $promo > 0) {
            return round((float) $promo, 2);
        }

        return round((float) $historia->precio_base, 2);
    }

    public static function intervaloMeses(Historia $historia): int
    {
        $meses = (int) ($historia->duracion_meses ?? 1);

        return max(1, min(120, $meses));
    }
}
