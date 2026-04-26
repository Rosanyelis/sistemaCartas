import type { LucideIcon } from 'lucide-react';
import {
    BookOpen,
    CalendarX,
    CircleHelp,
    FileText,
    Gift,
    Heart,
    Image,
    Mail,
    MapPin,
    Newspaper,
    Package,
    Quote,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
} from 'lucide-react';
import type { HistoriaDetalleInclusionIconName } from '@/constants/historia-detalle-inclusion-icons';

export const inclusionLucideMap: Record<HistoriaDetalleInclusionIconName, LucideIcon> = {
    FileText,
    Newspaper,
    Mail,
    Image,
    Gift,
    ShieldCheck,
    Package,
    CalendarX,
    Star,
    Quote,
    CircleHelp,
    BookOpen,
    MapPin,
    Heart,
    Truck,
    Sparkles,
};

/**
 * Resuelve el componente Lucide para el slug guardado en BD; icono desconocido → CircleHelp.
 */
export function inclusionIconOrFallback(iconName: string): LucideIcon {
    if (iconName in inclusionLucideMap) {
        return inclusionLucideMap[iconName as HistoriaDetalleInclusionIconName];
    }

    return CircleHelp;
}
