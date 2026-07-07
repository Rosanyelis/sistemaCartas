import type { PageProps as BasePageProps } from '@inertiajs/core';
import { Deferred, Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    dashboardPageBg,
    formatIsoDate,
} from '@/components/admin/dashboard/dashboard-tokens';
import type {
    ChartSerieFilter,
    DashboardFilters,
    DashboardMetricas,
    VentasChartPoint,
} from '@/components/admin/dashboard/dashboard-types';
import DashboardMetricCards from '@/components/admin/dashboard/DashboardMetricCards';
import DashboardSalesChart from '@/components/admin/dashboard/DashboardSalesChart';
import DashboardSalesSidebar from '@/components/admin/dashboard/DashboardSalesSidebar';
import UserLayout from '@/layouts/user-layout';
import { dashboard as adminDashboard } from '@/routes/admin';

interface PageProps extends BasePageProps {
    metricas?: DashboardMetricas;
    ventasChart?: VentasChartPoint[];
    filters: DashboardFilters;
}

function formatChartRangeLabel(filters: DashboardFilters): string {
    if (filters.chart_desde && filters.chart_hasta) {
        return `${formatIsoDate(filters.chart_desde)} - ${formatIsoDate(filters.chart_hasta)}`;
    }

    if (filters.fecha_desde && filters.fecha_hasta) {
        return `${formatIsoDate(filters.fecha_desde)} - ${formatIsoDate(filters.fecha_hasta)}`;
    }

    if (filters.periodo === 'semana') {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - 6);

        return `${start.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })} - ${now.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })}`;
    }

    if (filters.periodo === 'mes') {
        const year = filters.anio ?? new Date().getFullYear();

        return `01/01/${year} - 31/12/${year}`;
    }

    return 'Sin datos';
}

export default function Dashboard() {
    const { metricas, ventasChart, filters } = usePage<PageProps>().props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [chartSerieFilter, setChartSerieFilter] =
        useState<ChartSerieFilter>('todos');

    const [fechaDesde, setFechaDesde] = useState(filters.fecha_desde ?? '');
    const [fechaHasta, setFechaHasta] = useState(filters.fecha_hasta ?? '');
    const [anio, setAnio] = useState<number | null>(filters.anio ?? null);

    useEffect(() => {
        setFechaDesde(filters.fecha_desde ?? '');
        setFechaHasta(filters.fecha_hasta ?? '');
        setAnio(filters.anio ?? null);
    }, [filters.fecha_desde, filters.fecha_hasta, filters.anio]);

    const periodRangeLabel = useMemo(
        () => formatChartRangeLabel(filters),
        [filters],
    );

    const ventasHistoriasMes = useMemo(() => {
        if (!metricas) {
            return 0;
        }

        return (
            (metricas.ventas_historias_ordenes_del_mes ?? 0) +
            (metricas.ventas_suscripciones_del_mes ?? 0)
        );
    }, [metricas]);

    const ventasProductosMes = metricas?.ventas_productos_del_mes ?? 0;

    const chartSeriesKeys = useMemo((): (
        | 'historias'
        | 'productos'
        | 'cancelados'
    )[] => {
        switch (chartSerieFilter) {
            case 'historias':
                return ['historias'];
            case 'productos':
                return ['productos'];
            case 'cancelados':
                return ['cancelados'];
            default:
                return ['historias', 'productos', 'cancelados'];
        }
    }, [chartSerieFilter]);

    const chartPromedio = useMemo(() => {
        if (!ventasChart?.length) {
            return 0;
        }

        const total = ventasChart.reduce(
            (acc, point) =>
                acc + chartSeriesKeys.reduce((sum, key) => sum + point[key], 0),
            0,
        );

        return total / ventasChart.length;
    }, [ventasChart, chartSeriesKeys]);

    const showHistoriasLine =
        chartSerieFilter === 'todos' || chartSerieFilter === 'historias';
    const showProductosLine =
        chartSerieFilter === 'todos' || chartSerieFilter === 'productos';
    const showCanceladosLine =
        chartSerieFilter === 'todos' || chartSerieFilter === 'cancelados';

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) {
            return;
        }

        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) {
            return;
        }

        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handlePeriodChange = (period: string) => {
        router.get(
            adminDashboard.url({
                query: { periodo: period, ...(anio !== null ? { anio } : {}) },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleAnioChange = (year: number | null) => {
        setAnio(year);
        router.get(
            adminDashboard.url({
                query: {
                    periodo: filters.periodo,
                    ...(year !== null ? { anio: year } : {}),
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDateRangeApply = () => {
        if (!fechaDesde || !fechaHasta) {
            return;
        }

        router.get(
            adminDashboard.url({
                query: {
                    periodo: filters.periodo,
                    fecha_desde: fechaDesde,
                    fecha_hasta: fechaHasta,
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDateRangeClear = () => {
        setFechaDesde('');
        setFechaHasta('');
        router.get(
            adminDashboard.url({
                query: {
                    periodo: filters.periodo,
                    ...(anio !== null ? { anio } : {}),
                },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <UserLayout>
            <Head title="Admin Dashboard" />

            <div
                className={`flex min-w-0 flex-col gap-6 px-3 pt-3 pb-10 font-['Inter',sans-serif] md:px-6 md:pt-4 lg:gap-6 lg:px-8 ${dashboardPageBg}`}
            >
                <div className="flex w-full flex-col gap-1 lg:flex-row lg:items-center lg:gap-5">
                    <h1 className="text-[25px] leading-normal font-semibold text-[#1B3D6D]">
                        ¡Hola, Admin bienvenido!{' '}
                        <span className="text-[24px]">👋</span>
                    </h1>
                    <p className="text-lg leading-7 font-normal text-[#7B7B7B] lg:text-[16px] lg:leading-[22px]">
                        Dale un vistazo a tu resumen
                    </p>
                </div>

                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-6">
                        <Deferred
                            data="metricas"
                            fallback={
                                <div className="h-[94px] w-full animate-pulse rounded-[4px] bg-gray-200" />
                            }
                        >
                            <DashboardMetricCards
                                metricas={metricas}
                                scrollContainerRef={scrollContainerRef}
                                isDragging={isDragging}
                                onMouseDown={onMouseDown}
                                onMouseLeave={onMouseLeave}
                                onMouseUp={onMouseUp}
                                onMouseMove={onMouseMove}
                            />
                        </Deferred>

                        <DashboardSalesChart
                            ventasChart={ventasChart}
                            filters={filters}
                            chartSerieFilter={chartSerieFilter}
                            onChartSerieFilterChange={setChartSerieFilter}
                            periodRangeLabel={periodRangeLabel}
                            fechaDesde={fechaDesde}
                            fechaHasta={fechaHasta}
                            anio={anio}
                            onAnioChange={handleAnioChange}
                            onFechaDesdeChange={setFechaDesde}
                            onFechaHastaChange={setFechaHasta}
                            onPeriodChange={handlePeriodChange}
                            onDateRangeApply={handleDateRangeApply}
                            onDateRangeClear={handleDateRangeClear}
                            chartPromedio={chartPromedio}
                            showHistoriasLine={showHistoriasLine}
                            showProductosLine={showProductosLine}
                            showCanceladosLine={showCanceladosLine}
                        />
                    </div>

                    <DashboardSalesSidebar
                        metricas={metricas}
                        ventasHistoriasMes={ventasHistoriasMes}
                        ventasProductosMes={ventasProductosMes}
                    />
                </div>
            </div>
        </UserLayout>
    );
}
