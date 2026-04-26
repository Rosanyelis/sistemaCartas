/**
 * Lista blanca de iconos Lucide (PascalCase, exports de `lucide-react`).
 * Mantener en sync con `App\Support\HistoriaDetalleInclusionIcon::ALLOWED`.
 */
export const HISTORIA_DETALLE_INCLUSION_ICONS = [
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
] as const;

export type HistoriaDetalleInclusionIconName = (typeof HISTORIA_DETALLE_INCLUSION_ICONS)[number];
