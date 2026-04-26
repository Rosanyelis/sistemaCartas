<?php

namespace App\Support;

/**
 * Iconos permitidos para cada fila de `historias.detalle` (JSON: icon, title, description).
 *
 * Nombres en PascalCase, alineados con los exports de `lucide-react` y con
 * `resources/js/constants/historia-detalle-inclusion-icons.ts` (mantener ambos en sync).
 */
final class HistoriaDetalleInclusionIcon
{
    /** @var list<string> */
    public const ALLOWED = [
        'FileText',
        'Newspaper',
        'Mail',
        'Image',
        'Gift',
        'ShieldCheck',
        'Package',
        'CalendarX',
        'Star',
        'Quote',
        'CircleHelp',
        'BookOpen',
        'MapPin',
        'Heart',
        'Truck',
        'Sparkles',
    ];

    /**
     * @return list<string>
     */
    public static function allowed(): array
    {
        return self::ALLOWED;
    }
}
