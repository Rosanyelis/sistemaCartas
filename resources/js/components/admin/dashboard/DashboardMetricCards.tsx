import MetricCard from '@/components/admin/dashboard/MetricCard';
import {
    MetricHistoriasIcon,
    MetricOrdenesIcon,
    MetricProductosIcon,
    MetricRegistradosIcon,
    MetricSuscripcionesIcon,
} from '@/components/admin/dashboard/dashboard-metric-icons';
import { metricCardsGridDesktopClass } from '@/components/admin/dashboard/dashboard-tokens';
import type { DashboardMetricas } from '@/components/admin/dashboard/dashboard-types';
import { RefObject } from 'react';

type DashboardMetricCardsProps = {
    metricas?: DashboardMetricas;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
    isDragging: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
    onMouseUp: () => void;
    onMouseMove: (e: React.MouseEvent) => void;
};

export default function DashboardMetricCards({
    metricas,
    scrollContainerRef,
    isDragging,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
}: DashboardMetricCardsProps) {
    const clientesRegistradosSubtitle = metricas
        ? `+${metricas.clientes_nuevos_mes} este mes`
        : 'Rol cliente';

    const mesSubtitle = metricas
        ? `+${metricas.clientes_nuevos_mes} este mes`
        : undefined;

    return (
        <div className="w-full min-w-0">
            <div
                ref={scrollContainerRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                className={`max-lg:flex max-lg:touch-pan-x max-lg:snap-x max-lg:snap-mandatory max-lg:gap-3 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:pb-1 max-lg:[-ms-overflow-style:none] max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden ${metricCardsGridDesktopClass} ${
                    isDragging
                        ? 'max-lg:cursor-grabbing max-lg:select-none'
                        : 'max-lg:cursor-grab max-lg:select-none'
                }`}
            >
                <MetricCard
                    icon={MetricRegistradosIcon}
                    title="Registrados"
                    subtitle={clientesRegistradosSubtitle}
                    value={metricas?.clientes_registrados ?? 0}
                    growthPercent={metricas?.clientes_crecimiento_porcentaje}
                />
                <MetricCard
                    icon={MetricSuscripcionesIcon}
                    title="Suscripciones"
                    subtitle={mesSubtitle}
                    value={metricas?.suscripciones_del_mes ?? 0}
                    iconClassName="bg-[rgba(27,61,109,0.1)] text-[#1B3D6D]"
                    stats={[
                        {
                            label: 'Activos',
                            value: metricas?.suscripciones_activas_mes ?? 0,
                            tone: 'success',
                            icon: 'up',
                        },
                        {
                            label: 'Bajas',
                            value: metricas?.suscripciones_bajas_mes ?? 0,
                            tone: 'danger',
                            icon: 'down',
                        },
                    ]}
                />
                <MetricCard
                    icon={MetricOrdenesIcon}
                    title="Órdenes de día"
                    subtitle={mesSubtitle}
                    value={metricas?.ordenes_del_dia ?? 0}
                    stats={[
                        {
                            label: 'Completadas',
                            value: metricas?.ordenes_completadas_dia ?? 0,
                            tone: 'success',
                            icon: 'check',
                        },
                        {
                            label: 'Rechazadas',
                            value: metricas?.ordenes_rechazadas_dia ?? 0,
                            tone: 'danger',
                            icon: 'times',
                        },
                    ]}
                />
                <MetricCard
                    icon={MetricHistoriasIcon}
                    title="Historias activas"
                    value={metricas?.historias_activas ?? 0}
                    compact
                />
                <MetricCard
                    icon={MetricProductosIcon}
                    title="Productos activos"
                    value={metricas?.productos_activos ?? 0}
                    compact
                />
                <div className="w-2 shrink-0 lg:hidden" aria-hidden />
            </div>
        </div>
    );
}
