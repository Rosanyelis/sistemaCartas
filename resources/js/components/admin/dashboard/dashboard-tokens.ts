/** Tokens extraídos de Figma 15516:8185 / 15550:1692 (Historias por Correo — Dashboard). */

export const dashboardPageBg = 'bg-[#F5F6F7]';

export const cardShadow = 'shadow-[0px_0px_10px_rgba(36,16,167,0.15)]';

export const chartFilterShadow = 'lg:shadow-[0px_0px_2px_rgba(0,0,0,0.1)]';

export const iconStroke = 1.75;

export const iconBoxClass =
    'flex shrink-0 items-center rounded-[2px] bg-[#F5F5FF] p-1 text-[#1B3D6D]';

export const CHART_COLORS = {
    historias: '#2C5629',
    productos: '#1B3D6D',
    cancelados: '#7297BC',
    ventasHistorias: '#734B19',
} as const;

export const DONUT_COLORS = [
    '#734B19',
    '#707A5E',
    '#1B3D6D',
    '#E6E6E6',
    '#BFDBFE',
] as const;

export const metricCardsGridDesktopClass =
    'lg:grid lg:w-full lg:grid-cols-[minmax(0,1.23fr)_minmax(0,1.23fr)_minmax(0,1.23fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-4 lg:overflow-visible';

export function formatMxn(amount: number): string {
    return `$${amount.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} MX`;
}

export function formatIsoDate(iso: string): string {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}
