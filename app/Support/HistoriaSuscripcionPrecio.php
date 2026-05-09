<?php

namespace App\Support;

use App\Models\Historia;

/**
 * Precio e intervalo de facturación de suscripción a historia (PayPal Billing).
 */
final class HistoriaSuscripcionPrecio
{
    /**
     * Importe recurrente cobrado en PayPal (neto catálogo + IVA configurado).
     */
    public static function montoPorCicloCargoPayPal(Historia $historia): float
    {
        return TiendaIva::grossFromNet(self::montoPorCiclo($historia));
    }

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

    /**
     * Total de meses de entregas (arco de la historia): solo `historias.duracion_meses`.
     * No se deduce del ciclo de facturación PayPal.
     */
    public static function mesesEntregaTotal(Historia $historia): ?int
    {
        $d = $historia->duracion_meses;
        if ($d === null || (int) $d <= 0) {
            return null;
        }

        return max(1, min(120, (int) $d));
    }
}
