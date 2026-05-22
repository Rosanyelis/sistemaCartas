import React, { useMemo, useRef, useState } from 'react';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import UserLayout from '@/layouts/user-layout';
import { Head, Deferred, usePage, router } from '@inertiajs/react';
import {
    AlignJustify,
    CalendarDays,
    ChevronDown,
    DollarSign,
    FileText,
    Package,
    ScrollText,
    ShoppingBag,
    Users,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageProps as BasePageProps } from '@inertiajs/core';
import { dashboard as adminDashboard } from '@/routes/admin';

interface PageProps extends BasePageProps {
    metricas?: {
        clientes_registrados: number;
        clientes_nuevos_mes: number;
        clientes_crecimiento_porcentaje: number;
        suscripciones_del_mes: number;
        suscripciones_activas_mes: number;
        suscripciones_bajas_mes: number;
        ordenes_del_dia: number;
        ordenes_completadas_dia: number;
        ordenes_rechazadas_dia: number;
        historias_activas: number;
        productos_activos: number;
        ventas_productos_del_mes: number;
        ventas_historias_ordenes_del_mes: number;
        ventas_suscripciones_del_mes: number;
        ventas_del_mes: number;
        suscripciones_por_historia: { name: string; value: number }[];
        suscripciones_activas_total: number;
    };
    ventasChart?: {
        name: string;
        historias: number;
        productos: number;
        cancelados: number;
    }[];
    filters: {
        periodo: string;
    };
}

/** Colores del donut según Figma (Historias activas). */
const DONUT_COLORS = [
    '#734B19',
    '#707A5E',
    '#1B3D6D',
    '#E6E6E6',
    '#BFDBFE',
];

type ChartSerieFilter = 'todos' | 'historias' | 'productos' | 'cancelados';

const CHART_FILTER_OPTIONS: { key: ChartSerieFilter; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'historias', label: 'Historias' },
    { key: 'productos', label: 'Productos' },
    { key: 'cancelados', label: 'Cancelados' },
];

const cardShadow = 'shadow-[0px_0px_10px_rgba(36,16,167,0.15)]';
const iconStroke = 1.75;
const iconBoxClass =
    'flex shrink-0 items-center rounded-[2px] bg-[#F5F5FF] p-1 text-[#1B3D6D]';

function formatMxn(amount: number): string {
    return `$${amount.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} MX`;
}

function formatPeriodRange(periodo: string): string {
    const now = new Date();
    const format = (date: Date) =>
        date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    if (periodo === 'semana') {
        const start = new Date(now);
        start.setDate(now.getDate() - 6);

        return `${format(start)} - ${format(now)}`;
    }

    const start = new Date(now.getFullYear(), 0, 1);

    return `${format(start)} - ${format(now)}`;
}

export default function Dashboard() {
    const { metricas, ventasChart, filters } = usePage<PageProps>().props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [chartSerieFilter, setChartSerieFilter] =
        useState<ChartSerieFilter>('todos');

    const periodRangeLabel = useMemo(
        () => formatPeriodRange(filters.periodo),
        [filters.periodo],
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
                acc +
                chartSeriesKeys.reduce((sum, key) => sum + point[key], 0),
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
            adminDashboard.url({ query: { periodo: period } }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const clientesRegistradosSubtitle = metricas
        ? `+${metricas.clientes_nuevos_mes} este mes`
        : 'Rol cliente';

    const mesSubtitle = metricas
        ? `+${metricas.clientes_nuevos_mes} este mes`
        : undefined;

    return (
        <UserLayout>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 bg-[#F5F6F7] px-3 pb-10 pt-3 font-['Inter',sans-serif] md:px-6 md:pt-4 lg:px-8">
                <div className="flex w-full flex-col gap-1">
                    <h1 className="text-[25px] font-semibold leading-normal text-[#1B3D6D]">
                        ¡Hola, Admin bienvenido!{' '}
                        <span className="text-[24px]">👋</span>
                    </h1>
                    <p className="text-lg font-normal leading-7 text-[#7B7B7B] md:text-base md:leading-normal">
                        Dale un vistazo a tu resumen
                    </p>
                </div>

                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <Deferred
                            data="metricas"
                            fallback={
                                <div className="h-[94px] w-full animate-pulse rounded-[4px] bg-gray-200" />
                            }
                        >
                            <div
                                ref={scrollContainerRef}
                                onMouseDown={onMouseDown}
                                onMouseLeave={onMouseLeave}
                                onMouseUp={onMouseUp}
                                onMouseMove={onMouseMove}
                                className={`flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] xl:grid xl:snap-none xl:grid-cols-5 xl:gap-4 xl:overflow-visible [&::-webkit-scrollbar]:hidden ${
                                    isDragging
                                        ? 'cursor-grabbing select-none'
                                        : 'cursor-grab select-none xl:cursor-auto xl:select-auto'
                                }`}
                            >
                                <MetricCard
                                    icon={Users}
                                    title="Registrados"
                                    subtitle={clientesRegistradosSubtitle}
                                    value={metricas?.clientes_registrados ?? 0}
                                    growthPercent={
                                        metricas?.clientes_crecimiento_porcentaje
                                    }
                                />
                                <MetricCard
                                    icon={FileText}
                                    title="Suscripciones"
                                    subtitle={mesSubtitle}
                                    value={metricas?.suscripciones_del_mes ?? 0}
                                    iconClassName="bg-[rgba(27,61,109,0.1)] text-[#1B3D6D]"
                                    stats={[
                                        {
                                            label: 'Activos',
                                            value:
                                                metricas?.suscripciones_activas_mes ??
                                                0,
                                            tone: 'success',
                                            icon: 'up',
                                        },
                                        {
                                            label: 'Bajas',
                                            value:
                                                metricas?.suscripciones_bajas_mes ??
                                                0,
                                            tone: 'danger',
                                            icon: 'down',
                                        },
                                    ]}
                                />
                                <MetricCard
                                    icon={Package}
                                    title="Órdenes de día"
                                    subtitle={mesSubtitle}
                                    value={metricas?.ordenes_del_dia ?? 0}
                                    stats={[
                                        {
                                            label: 'Completadas',
                                            value:
                                                metricas?.ordenes_completadas_dia ??
                                                0,
                                            tone: 'success',
                                            icon: 'check',
                                        },
                                        {
                                            label: 'Rechazadas',
                                            value:
                                                metricas?.ordenes_rechazadas_dia ??
                                                0,
                                            tone: 'danger',
                                            icon: 'times',
                                        },
                                    ]}
                                />
                                <MetricCard
                                    icon={ScrollText}
                                    title="Historias activas"
                                    value={metricas?.historias_activas ?? 0}
                                    compact
                                />
                                <MetricCard
                                    icon={ShoppingBag}
                                    title="Productos activos"
                                    value={metricas?.productos_activos ?? 0}
                                    compact
                                />
                                <div
                                    className="w-2 shrink-0 xl:hidden"
                                    aria-hidden
                                />
                            </div>
                        </Deferred>

                        <div
                            className={`min-w-0 rounded-[4px] bg-white p-3 ${cardShadow}`}
                        >
                            <div className="mb-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className={`${iconBoxClass} cursor-pointer transition-opacity hover:opacity-80`}
                                                aria-haspopup="menu"
                                                aria-label="Filtrar series del gráfico"
                                            >
                                                <AlignJustify
                                                    className="size-6"
                                                    strokeWidth={iconStroke}
                                                />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            className="min-w-[148px] rounded-[4px] border-0 bg-white p-2 shadow-[0px_0px_10px_rgba(36,16,167,0.15)]"
                                        >
                                            {CHART_FILTER_OPTIONS.map(
                                                ({ key, label }) => (
                                                    <DropdownMenuItem
                                                        key={key}
                                                        onSelect={() =>
                                                            setChartSerieFilter(
                                                                key,
                                                            )
                                                        }
                                                        className={`cursor-pointer rounded-[2px] px-3 py-2.5 text-[13px] focus:bg-[#F5F5FF] ${
                                                            chartSerieFilter ===
                                                            key
                                                                ? 'font-semibold text-[#1B3D6D]'
                                                                : 'font-normal text-[#7B7B7B]'
                                                        }`}
                                                    >
                                                        {label}
                                                    </DropdownMenuItem>
                                                ),
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <h2 className="text-[20px] font-semibold text-[#7B7B7B]">
                                        Rendimientos de ventas
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <label className="flex h-10 items-center gap-2.5 rounded-[6px] border border-[#DFE4EA] bg-white px-4 py-3 text-[13px] text-[#1B3D6D]">
                                        <CalendarDays
                                            className="size-4 shrink-0"
                                            strokeWidth={iconStroke}
                                        />
                                        <select
                                            value={filters.periodo}
                                            onChange={(e) =>
                                                handlePeriodChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
                                        >
                                            <option value="semana">
                                                Semana
                                            </option>
                                            <option value="mes">Mes</option>
                                        </select>
                                        <ChevronDown
                                            className="pointer-events-none -ml-4 size-4 shrink-0 text-[#1B3D6D]"
                                            strokeWidth={iconStroke}
                                        />
                                    </label>
                                    <div className="flex h-10 flex-1 items-center justify-center gap-2.5 rounded-[6px] border border-[#DFE4EA] bg-white px-4 py-3 text-[13px] text-[#1B3D6D] md:flex-none">
                                        <span>{periodRangeLabel}</span>
                                        <ChevronDown
                                            className="size-4 shrink-0 opacity-60"
                                            strokeWidth={iconStroke}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="mb-4 flex flex-wrap gap-6 text-[13px]">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-[2px] bg-[#2C5629]" />
                                        <span className="text-[#2C5629]">
                                            Historias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-[2px] bg-[#1B3D6D]" />
                                        <span className="text-[#1B3D6D]">
                                            Productos
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-[2px] bg-[#7297BC]" />
                                        <span className="text-[#7297BC]">
                                            Cancelados
                                        </span>
                                    </div>
                                </div>

                                <Deferred
                                        data="ventasChart"
                                        fallback={
                                            <div className="h-[186px] w-full animate-pulse rounded bg-gray-100 md:h-[320px]" />
                                        }
                                    >
                                        <div className="h-[186px] w-full min-w-0 md:h-[320px]">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <LineChart
                                                    data={ventasChart || []}
                                                    margin={{
                                                        top: 5,
                                                        right: 8,
                                                        left: 0,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="0"
                                                        vertical={false}
                                                        stroke="#E5E7EB"
                                                    />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{
                                                            fontSize: 14,
                                                            fill: '#7B7B7B',
                                                            fontWeight: 700,
                                                        }}
                                                        dy={10}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{
                                                            fontSize: 14,
                                                            fill: '#373737',
                                                        }}
                                                        tickFormatter={(val) =>
                                                            `$${val}`
                                                        }
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            backgroundColor:
                                                                '#1B3D6D',
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            padding:
                                                                '5px 14px',
                                                        }}
                                                        itemStyle={{
                                                            color: '#fff',
                                                        }}
                                                        formatter={(value) =>
                                                            formatMxn(
                                                                Number(value),
                                                            )
                                                        }
                                                        cursor={{
                                                            stroke: '#1B3D6D',
                                                            strokeWidth: 1,
                                                            strokeDasharray:
                                                                '3 3',
                                                        }}
                                                    />
                                                    {showHistoriasLine && (
                                                        <Line
                                                            type="monotone"
                                                            dataKey="historias"
                                                            stroke="#2C5629"
                                                            strokeWidth={2.5}
                                                            dot={false}
                                                            strokeDasharray="4 4"
                                                        />
                                                    )}
                                                    {showProductosLine && (
                                                        <Line
                                                            type="monotone"
                                                            dataKey="productos"
                                                            stroke="#1B3D6D"
                                                            strokeWidth={2.5}
                                                            dot={false}
                                                        />
                                                    )}
                                                    {showCanceladosLine && (
                                                        <Line
                                                            type="monotone"
                                                            dataKey="cancelados"
                                                            stroke="#7297BC"
                                                            strokeWidth={2.5}
                                                            dot={false}
                                                        />
                                                    )}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Deferred>

                                <p className="mt-4 text-center text-[13px] font-semibold text-[#7B7B7B] md:text-left">
                                    Promedio de los últimos 30 Días:{' '}
                                    {formatMxn(chartPromedio)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[265px] xl:shrink-0">
                        <div
                            className={`rounded-[4px] bg-white p-3 ${cardShadow}`}
                        >
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <h3 className="text-[16px] font-semibold text-[#7B7B7B]">
                                    Ventas totales
                                </h3>
                                <div className={iconBoxClass}>
                                    <DollarSign
                                        className="size-6"
                                        strokeWidth={iconStroke}
                                    />
                                </div>
                            </div>

                            <Deferred
                                data="metricas"
                                fallback={
                                    <div className="mb-4 h-8 w-40 animate-pulse rounded bg-gray-200" />
                                }
                            >
                                <p className="mb-4 text-[25px] font-semibold leading-none text-[#A4A4A4]">
                                    {formatMxn(
                                        metricas?.ventas_del_mes ?? 0,
                                    ).replace(' MX', 'MX')}
                                </p>
                            </Deferred>

                            <Deferred
                                data="ventasChart"
                                fallback={
                                    <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
                                }
                            >
                                <div className="flex flex-col gap-2 text-[13px]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-[2px] bg-[#734B19]" />
                                            <span className="text-[#734B19]">
                                                Historias
                                            </span>
                                        </div>
                                        <span className="text-[#734B19]">
                                            {formatMxn(ventasHistoriasMes)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-[2px] bg-[#1B3D6D]" />
                                            <span className="text-[#1B3D6D]">
                                                Productos
                                            </span>
                                        </div>
                                        <span className="text-[#1B3D6D]">
                                            {formatMxn(ventasProductosMes)}
                                        </span>
                                    </div>
                                </div>
                            </Deferred>
                        </div>

                        <div
                            className={`flex flex-1 flex-col rounded-[4px] bg-white p-3 ${cardShadow}`}
                        >
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <h3 className="text-[16px] font-semibold text-[#7B7B7B]">
                                    Historias activas
                                </h3>
                                <div className={iconBoxClass}>
                                    <ScrollText
                                        className="size-6"
                                        strokeWidth={iconStroke}
                                    />
                                </div>
                            </div>

                            <Deferred
                                data="metricas"
                                fallback={
                                    <div className="h-64 w-full animate-pulse rounded bg-gray-100" />
                                }
                            >
                                {metricas?.suscripciones_por_historia
                                    ?.length ? (
                                    <>
                                        <div className="relative mx-auto mb-4 flex h-[220px] w-full items-center justify-center rounded-[2px] border border-[#F2F2F2] p-4">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={
                                                            metricas.suscripciones_por_historia
                                                        }
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {metricas.suscripciones_por_historia.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        DONUT_COLORS[
                                                                            index %
                                                                                DONUT_COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                                                <span className="text-[36px] font-semibold leading-none text-[#1B3D6D]">
                                                    {
                                                        metricas.suscripciones_activas_total
                                                    }
                                                </span>
                                                <span className="max-w-[90px] text-center text-[9px] leading-normal text-[#7B7B7B]">
                                                    Total suscripciones
                                                    activas
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 rounded-b-[2px] bg-[#FBFBFF] p-4 text-[13px]">
                                            {metricas.suscripciones_por_historia.map(
                                                (hist, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between gap-2"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div
                                                                className="size-3 shrink-0 rounded-[2px]"
                                                                style={{
                                                                    backgroundColor:
                                                                        DONUT_COLORS[
                                                                            i %
                                                                                DONUT_COLORS.length
                                                                        ],
                                                                }}
                                                            />
                                                            <span className="truncate text-[#7B7B7B]">
                                                                {hist.name}
                                                            </span>
                                                        </div>
                                                        <span className="shrink-0 font-semibold text-[#1B3D6D]">
                                                            {hist.value}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-10 text-center text-sm text-[#7B7B7B]">
                                        No hay datos suficientes
                                    </div>
                                )}
                            </Deferred>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
