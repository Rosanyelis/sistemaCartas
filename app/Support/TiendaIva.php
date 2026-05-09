<?php

namespace App\Support;

/**
 * IVA aplicado sobre importes netos del catálogo (precio base sin impuesto).
 */
final class TiendaIva
{
    public static function percentage(): float
    {
        $p = (float) config('tienda.iva_percentage', 16);

        return max(0.0, $p);
    }

    public static function rate(): float
    {
        return self::percentage() / 100;
    }

    public static function amountFromNet(float $netExclusive): float
    {
        return round($netExclusive * self::rate(), 2);
    }

    /**
     * Importe total a cobrar (neto + IVA redondeados).
     */
    public static function grossFromNet(float $netExclusive): float
    {
        $iva = self::amountFromNet($netExclusive);

        return round($netExclusive + $iva, 2);
    }
}
