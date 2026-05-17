import React, { useMemo, useRef, useState } from 'react';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import UserLayout from '@/layouts/user-layout';
import { Head, Deferred, usePage, router } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faFileLines,
    faBox,
    faChevronDown,
    faDollarSign,
    faCalendarDays,
    faScroll,
    faBagShopping,
} from '@fortawesome/free-solid-svg-icons';
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

const DONUT_COLORS = ['#734B19', '#707A5E', '#1B3D6D', '#E6E6E6', '#BFDBFE'];

const cardShadow = 'shadow-[0px_0px_10px_rgba(36,16,167,0.15)]';

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

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    return `${format(start)} - ${format(now)}`;
}

export default function Dashboard() {
    const { metricas, ventasChart, filters } = usePage<PageProps>().props;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const periodRangeLabel = useMemo(
        () => formatPeriodRange(filters.periodo),
        [filters.periodo],
    );

    const ventasHistorias = useMemo(
        () =>
            ventasChart?.reduce((acc, curr) => acc + curr.historias, 0) ?? 0,
        [ventasChart],
    );

    const ventasProductos = useMemo(
        () =>
            ventasChart?.reduce((acc, curr) => acc + curr.productos, 0) ?? 0,
        [ventasChart],
    );

    const chartPromedio = useMemo(() => {
        if (!ventasChart?.length) {
            return 0;
        }

        const total = ventasChart.reduce(
            (acc, point) =>
                acc + point.historias + point.productos + point.cancelados,
            0,
        );

        return total / ventasChart.length;
    }, [ventasChart]);

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

    const mesSubtitle = metricas
        ? `+${metricas.clientes_nuevos_mes} este mes`
        : undefined;

    return (
        <UserLayout>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-5 bg-[#F5F6F7] px-3 py-3 font-['Inter'] md:gap-6 md:px-6 md:py-4 lg:px-8">
                <div className="flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-5">
                    <h1 className="text-[25px] font-semibold leading-tight text-[#1B3D6D]">
                        ¡Hola, Admin bienvenido!{' '}
                        <span className="text-[24px]">👋</span>
                    </h1>
                    <span className="text-base font-normal text-[#7B7B7B] lg:shrink-0">
                        Dale un vistazo a tu resumen
                    </span>
                </div>

                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <Deferred
                            data="metricas"
                            fallback={
                                <div className="h-[94px] w-full animate-pulse rounded bg-gray-200" />
                            }
                        >
                            <div
                                ref={scrollContainerRef}
                        onMouseDown={onMouseDown}
                        onMouseLeave={onMouseLeave}
                        onMouseUp={onMouseUp}
                        onMouseMove={onMouseMove}
                        className={`flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] xl:grid xl:snap-none xl:grid-cols-5 xl:overflow-visible [&::-webkit-scrollbar]:hidden ${
                            isDragging
                                ? 'cursor-grabbing select-none'
                                : 'cursor-grab select-none xl:cursor-auto xl:select-auto'
                        }`}
                    >
                        <MetricCard
                            icon={faUsers}
                            title="Registrados"
                            subtitle={mesSubtitle}
                            value={metricas?.clientes_registrados ?? 0}
                            growthPercent={
                                metricas?.clientes_crecimiento_porcentaje
                            }
                            className="min-w-[260px] max-w-[300px] shrink-0 snap-start xl:min-w-0 xl:max-w-none xl:w-full xl:shrink"
                        />
                        <MetricCard
                            icon={faFileLines}
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
                                        metricas?.suscripciones_bajas_mes ?? 0,
                                    tone: 'danger',
                                    icon: 'down',
                                },
                            ]}
                            className="min-w-[260px] max-w-[300px] shrink-0 snap-start xl:min-w-0 xl:max-w-none xl:w-full xl:shrink"
                        />
                        <MetricCard
                            icon={faBox}
                            title="Órdenes de día"
                            subtitle={mesSubtitle}
                            value={metricas?.ordenes_del_dia ?? 0}
                            stats={[
                                {
                                    label: 'Completadas',
                                    value:
                                        metricas?.ordenes_completadas_dia ?? 0,
                                    tone: 'success',
                                    icon: 'check',
                                },
                                {
                                    label: 'Rechazadas',
                                    value:
                                        metricas?.ordenes_rechazadas_dia ?? 0,
                                    tone: 'danger',
                                    icon: 'times',
                                },
                            ]}
                            className="min-w-[260px] max-w-[300px] shrink-0 snap-start xl:min-w-0 xl:max-w-none xl:w-full xl:shrink"
                        />
                        <MetricCard
                            icon={faScroll}
                            title="Historias activas"
                            value={metricas?.historias_activas ?? 0}
                            className="min-w-[130px] max-w-[130px] shrink-0 snap-start xl:min-w-0 xl:max-w-none xl:w-full xl:shrink"
                        />
                        <MetricCard
                            icon={faBagShopping}
                            title="Productos activos"
                            value={metricas?.productos_activos ?? 0}
                            className="min-w-[130px] max-w-[130px] shrink-0 snap-start xl:min-w-0 xl:max-w-none xl:w-full xl:shrink"
                        />
                        <div
                            className="w-2 shrink-0 xl:hidden"
                            aria-hidden
                        />
                            </div>
                        </Deferred>

                        <div
                            className={`min-w-0 rounded bg-white p-4 ${cardShadow} md:p-4`}
                        >
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <h2 className="text-xl font-semibold text-[#7B7B7B]">
                                Rendimientos de ventas
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <label className="flex h-10 items-center gap-2.5 rounded-md border border-[#DFE4EA] bg-white px-5 py-3 text-[13px] text-[#1B3D6D]">
                                    <FontAwesomeIcon
                                        icon={faCalendarDays}
                                        className="size-4 shrink-0"
                                    />
                                    <select
                                        value={filters.periodo}
                                        onChange={(e) =>
                                            handlePeriodChange(e.target.value)
                                        }
                                        className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
                                    >
                                        <option value="semana">Semana</option>
                                        <option value="mes">Mes</option>
                                    </select>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="pointer-events-none -ml-4 size-4 shrink-0 text-[#1B3D6D]"
                                    />
                                </label>
                                <div className="flex h-10 items-center gap-2.5 rounded-md border border-[#DFE4EA] bg-white px-5 py-3 text-[13px] text-[#1B3D6D]">
                                    <span>{periodRangeLabel}</span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className="size-4 shrink-0 opacity-60"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 md:flex-row">
                            <div className="hidden w-[110px] shrink-0 flex-col rounded bg-white shadow-[0px_0px_2px_rgba(0,0,0,0.1)] md:flex">
                                {['Todos', 'Historias', 'Productos', 'Cancelados'].map(
                                    (item, index) => (
                                        <button
                                            key={item}
                                            type="button"
                                            className={`px-2 py-2 text-left text-[13px] ${
                                                index === 0
                                                    ? 'font-semibold text-[#1B3D6D]'
                                                    : 'font-normal text-[#7B7B7B] hover:text-[#373737]'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-4 flex flex-wrap gap-9 text-[13px]">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-sm bg-[#2C5629]" />
                                        <span className="text-[#2C5629]">
                                            Historias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-sm bg-[#1B3D6D]" />
                                        <span className="text-[#1B3D6D]">
                                            Productos
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-sm bg-[#7297BC]" />
                                        <span className="text-[#7297BC]">
                                            Cancelados
                                        </span>
                                    </div>
                                </div>

                                <Deferred
                                    data="ventasChart"
                                    fallback={
                                        <div className="h-[300px] w-full animate-pulse rounded bg-gray-100" />
                                    }
                                >
                                    <div className="h-[280px] w-full min-w-0 md:h-[320px]">
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
                                                        padding: '5px 14px',
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
                                                <Line
                                                    type="monotone"
                                                    dataKey="historias"
                                                    stroke="#2C5629"
                                                    strokeWidth={2.5}
                                                    dot={false}
                                                    strokeDasharray="4 4"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="productos"
                                                    stroke="#1B3D6D"
                                                    strokeWidth={2.5}
                                                    dot={false}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="cancelados"
                                                    stroke="#7297BC"
                                                    strokeWidth={2.5}
                                                    dot={false}
                                                />
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
                    </div>

                    <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[265px] xl:shrink-0">
                        <div
                            className={`rounded bg-white p-3 ${cardShadow}`}
                        >
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#7B7B7B]">
                                    Ventas totales
                                </h3>
                                <div className="rounded-sm bg-[#F5F5FF] p-1 text-[#1B3D6D]">
                                    <FontAwesomeIcon
                                        icon={faDollarSign}
                                        className="size-6"
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
                                            <div className="size-3 rounded-sm bg-[#734B19]" />
                                            <span className="text-[#734B19]">
                                                Historias
                                            </span>
                                        </div>
                                        <span className="text-[#734B19]">
                                            {formatMxn(ventasHistorias)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-sm bg-[#1B3D6D]" />
                                            <span className="text-[#1B3D6D]">
                                                Productos
                                            </span>
                                        </div>
                                        <span className="text-[#1B3D6D]">
                                            {formatMxn(ventasProductos)}
                                        </span>
                                    </div>
                                </div>
                            </Deferred>
                        </div>

                        <div
                            className={`flex flex-1 flex-col rounded bg-white p-3 ${cardShadow}`}
                        >
                            <div className="mb-4 flex items-center justify-between gap-2">
                                <h3 className="text-base font-semibold text-[#7B7B7B]">
                                    Historias activas
                                </h3>
                                <div className="rounded-sm bg-[#F5F5FF] p-1 text-[#1B3D6D]">
                                    <FontAwesomeIcon
                                        icon={faScroll}
                                        className="size-6"
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
                                        <div className="relative mx-auto mb-4 flex h-[200px] w-full items-center justify-center border border-[#F2F2F2] p-4">
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
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-4xl font-semibold text-[#1B3D6D]">
                                                    {metricas.suscripciones_activas_total}
                                                </span>
                                                <span className="max-w-[90px] text-center text-[9px] leading-tight text-[#7B7B7B]">
                                                    Total suscripciones activas
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 rounded-b bg-[#FBFBFF] p-4 text-[13px]">
                                            {metricas.suscripciones_por_historia.map(
                                                (hist, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center justify-between gap-2"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <div
                                                                className="size-3 shrink-0 rounded-sm"
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
