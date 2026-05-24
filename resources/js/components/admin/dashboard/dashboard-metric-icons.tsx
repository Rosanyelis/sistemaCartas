import type { IconComponent } from '@/components/ui/icon';
import {
    PanelNavClientesIcon,
    PanelNavHistoriasIcon,
} from '@/components/panel/panel-nav-icons';

type SvgIconDef = {
    viewBox: string;
    path: string;
};

function createFigmaMetricIcon({ viewBox, path }: SvgIconDef): IconComponent {
    return function FigmaMetricIcon({ className }: { className?: string }) {
        return (
            <svg
                className={`size-6 shrink-0 ${className ?? ''}`}
                viewBox={viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
            >
                <path d={path} fill="currentColor" />
            </svg>
        );
    };
}

/** Users — Registrados (Figma 15553:7798 / 15550:1692). */
export const MetricRegistradosIcon = PanelNavClientesIcon;

/** File Alt — Suscripciones. */
export const MetricSuscripcionesIcon = createFigmaMetricIcon({
    viewBox: '0 0 12 16',
    path: 'M8 0H2.66667C1.2 0 0 1.2 0 2.66667V13.3333C0 14.8 1.2 16 2.66667 16H8C9.46667 16 10.6667 14.8 10.6667 13.3333V4L8 0ZM8 4.66667V13.3333H2.66667V2.66667H7.33333V4.66667H8ZM3.33333 7.33333H7.33333V8.66667H3.33333V7.33333ZM3.33333 10H7.33333V11.3333H3.33333V10Z',
});

/** Box — Órdenes de día. */
export const MetricOrdenesIcon = createFigmaMetricIcon({
    viewBox: '0 0 16 16',
    path: 'M14.6667 4.66667L8 0L1.33333 4.66667V12L8 16L14.6667 12V4.66667ZM8 1.86667L12.6667 4.66667L8 7.46667L3.33333 4.66667L8 1.86667ZM2.66667 5.6L7.33333 8.4V13.8667L2.66667 11.0667V5.6ZM8.66667 13.8667V8.4L13.3333 5.6V11.0667L8.66667 13.8667Z',
});

/** Scroll Old — Historias activas. */
export const MetricHistoriasIcon = PanelNavHistoriasIcon;

/** Shopping Bag — Productos activos. */
export const MetricProductosIcon = createFigmaMetricIcon({
    viewBox: '0 0 15 16',
    path: 'M4.66667 4.66667V3.33333C4.66667 1.49333 6.16 0 8 0C9.84 0 11.3333 1.49333 11.3333 3.33333V4.66667H14C14.7333 4.66667 15.3333 5.26667 15.3333 6V14.6667C15.3333 15.4 14.7333 16 14 16H2C1.26667 16 0.666667 15.4 0.666667 14.6667V6C0.666667 5.26667 1.26667 4.66667 2 4.66667H4.66667ZM6 3.33333C6 2.6 6.6 2 7.33333 2H8.66667C9.4 2 10 2.6 10 3.33333V4.66667H6V3.33333ZM2.66667 6V14.6667H13.3333V6H2.66667Z',
});
