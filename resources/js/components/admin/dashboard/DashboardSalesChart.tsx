import { Deferred } from '@inertiajs/react';
import { AlignJustify, CalendarDays, ChevronDown } from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    cardShadow,
    CHART_COLORS,
    chartFilterShadow,
    formatMxn,
    iconBoxClass,
    iconStroke,
} from '@/components/admin/dashboard/dashboard-tokens';
import { CHART_FILTER_OPTIONS } from '@/components/admin/dashboard/dashboard-types';
import type {
    ChartSerieFilter,
    DashboardFilters,
    VentasChartPoint,
} from '@/components/admin/dashboard/dashboard-types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DashboardSalesChartProps = {
    ventasChart?: VentasChartPoint[];
    filters: DashboardFilters;
    chartSerieFilter: ChartSerieFilter;
    onChartSerieFilterChange: (filter: ChartSerieFilter) => void;
    periodRangeLabel: string;
    fechaDesde: string;
    fechaHasta: string;
    anio: number | null;
    onAnioChange: (year: number | null) => void;
    onFechaDesdeChange: (value: string) => void;
    onFechaHastaChange: (value: string) => void;
    onPeriodChange: (period: string) => void;
    onDateRangeApply: () => void;
    onDateRangeClear: () => void;
    chartPromedio: number;
    showHistoriasLine: boolean;
    showProductosLine: boolean;
    showCanceladosLine: boolean;
};

function buildYearOptions(
    referenceYear: number,
    currentAnio: number | null,
): number[] {
    const candidates = [
        referenceYear - 2,
        referenceYear - 1,
        referenceYear,
        referenceYear + 1,
    ];

    if (currentAnio !== null && !candidates.includes(currentAnio)) {
        candidates.push(currentAnio);
    }

    return Array.from(new Set(candidates)).sort((a, b) => a - b);
}

export default function DashboardSalesChart({
    ventasChart,
    filters,
    chartSerieFilter,
    onChartSerieFilterChange,
    periodRangeLabel,
    fechaDesde,
    fechaHasta,
    anio,
    onAnioChange,
    onFechaDesdeChange,
    onFechaHastaChange,
    onPeriodChange,
    onDateRangeApply,
    onDateRangeClear,
    chartPromedio,
    showHistoriasLine,
    showProductosLine,
    showCanceladosLine,
}: DashboardSalesChartProps) {
    const hasCustomRange =
        Boolean(filters.fecha_desde) || Boolean(filters.fecha_hasta);

    const showYearSelector = filters.periodo === 'mes';
    const referenceYear = new Date().getFullYear();
    const yearOptions = buildYearOptions(referenceYear, anio);

    return (
        <div
            className={`min-w-0 rounded-[4px] bg-white p-4 ${cardShadow} lg:gap-4 lg:p-4`}
        >
            <div className="mb-4 flex flex-col gap-4 max-lg:gap-4 lg:mb-4 lg:gap-4">
                <div className="flex flex-col gap-3 max-lg:gap-3 lg:h-10 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="lg:hidden">
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
                                                    onChartSerieFilterChange(
                                                        key,
                                                    )
                                                }
                                                className={`cursor-pointer rounded-[2px] px-3 py-2.5 text-[13px] focus:bg-[#F5F5FF] ${
                                                    chartSerieFilter === key
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
                        </div>
                        <h2 className="shrink-0 text-[20px] leading-none font-semibold text-[#7B7B7B]">
                            Rendimientos de ventas
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 max-lg:w-full max-lg:gap-3 lg:flex lg:h-10 lg:shrink-0 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-4">
                        <label className="flex h-10 shrink-0 items-center gap-2.5 rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 text-[13px] leading-none text-[#1B3D6D]">
                            <CalendarDays
                                className="size-4 shrink-0"
                                strokeWidth={iconStroke}
                            />
                            <select
                                value={filters.periodo}
                                onChange={(e) => onPeriodChange(e.target.value)}
                                className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
                            >
                                <option value="semana">Semana</option>
                                <option value="mes">Mes</option>
                            </select>
                            <ChevronDown
                                className="pointer-events-none -ml-4 size-4 shrink-0 text-[#1B3D6D]"
                                strokeWidth={iconStroke}
                            />
                        </label>

                        {showYearSelector ? (
                            <label className="flex h-10 shrink-0 items-center gap-2.5 rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 text-[13px] leading-none text-[#1B3D6D]">
                                <CalendarDays
                                    className="size-4 shrink-0"
                                    strokeWidth={iconStroke}
                                />
                                <select
                                    value={anio === null ? '' : String(anio)}
                                    onChange={(e) => {
                                        const raw = e.target.value;

                                        onAnioChange(
                                            raw === '' ? null : Number(raw),
                                        );
                                    }}
                                    aria-label="Año"
                                    className="cursor-pointer appearance-none bg-transparent pr-5 outline-none"
                                >
                                    <option value="">Todos los años</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none -ml-4 size-4 shrink-0 text-[#1B3D6D]"
                                    strokeWidth={iconStroke}
                                />
                            </label>
                        ) : null}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="hidden h-10 shrink-0 items-center gap-2.5 rounded-[6px] border border-[#DFE4EA] bg-white px-5 py-3 text-[13px] leading-none text-[#1B3D6D] lg:flex"
                                >
                                    <span className="whitespace-nowrap">
                                        {periodRangeLabel}
                                    </span>
                                    <ChevronDown
                                        className="size-4 shrink-0"
                                        strokeWidth={iconStroke}
                                    />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="hidden w-64 rounded-[4px] border border-[#DFE4EA] bg-white p-3 shadow-[0px_0px_10px_rgba(36,16,167,0.15)] lg:block"
                            >
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] text-[#7B7B7B]">
                                        Desde
                                        <input
                                            type="date"
                                            value={fechaDesde}
                                            onChange={(e) =>
                                                onFechaDesdeChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-[4px] border border-[#DFE4EA] px-2 py-1.5 text-[13px] text-[#1B3D6D]"
                                        />
                                    </label>
                                    <label className="text-[11px] text-[#7B7B7B]">
                                        Hasta
                                        <input
                                            type="date"
                                            value={fechaHasta}
                                            onChange={(e) =>
                                                onFechaHastaChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 w-full rounded-[4px] border border-[#DFE4EA] px-2 py-1.5 text-[13px] text-[#1B3D6D]"
                                        />
                                    </label>
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={onDateRangeApply}
                                            disabled={
                                                !fechaDesde || !fechaHasta
                                            }
                                            className="flex-1 rounded-[4px] bg-[#1B3D6D] px-2 py-1.5 text-[11px] font-semibold text-white disabled:opacity-40"
                                        >
                                            Aplicar
                                        </button>
                                        {hasCustomRange && (
                                            <button
                                                type="button"
                                                onClick={onDateRangeClear}
                                                className="text-[11px] text-[#7B7B7B] underline"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex h-10 min-w-0 flex-1 flex-wrap items-center gap-2 rounded-[6px] border border-[#DFE4EA] bg-white px-3 py-2 text-[13px] text-[#1B3D6D] max-lg:flex lg:hidden">
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) =>
                                    onFechaDesdeChange(e.target.value)
                                }
                                className="min-w-0 flex-1 cursor-pointer bg-transparent outline-none"
                                aria-label="Fecha desde"
                            />
                            <span className="text-[#7B7B7B]">—</span>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) =>
                                    onFechaHastaChange(e.target.value)
                                }
                                className="min-w-0 flex-1 cursor-pointer bg-transparent outline-none"
                                aria-label="Fecha hasta"
                            />
                            <button
                                type="button"
                                onClick={onDateRangeApply}
                                disabled={!fechaDesde || !fechaHasta}
                                className="shrink-0 rounded-[4px] bg-[#1B3D6D] px-2 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
                            >
                                Aplicar
                            </button>
                            {hasCustomRange && (
                                <button
                                    type="button"
                                    onClick={onDateRangeClear}
                                    className="shrink-0 text-[11px] text-[#7B7B7B] underline"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>

                        <p className="w-full text-[12px] text-[#7B7B7B] max-lg:block lg:hidden">
                            Eje: {periodRangeLabel}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:gap-6">
                <div
                    className={`hidden w-[110px] shrink-0 flex-col rounded-[4px] bg-white lg:flex ${chartFilterShadow}`}
                >
                    {CHART_FILTER_OPTIONS.map(({ key, label }, index) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChartSerieFilterChange(key)}
                            className={`px-2 py-2 text-left text-[13px] leading-none ${
                                chartSerieFilter === key
                                    ? 'font-semibold text-[#1B3D6D]'
                                    : 'font-normal text-[#7B7B7B] hover:text-[#373737]'
                            } ${index === 0 ? 'lg:rounded-t-[4px]' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap gap-6 text-[13px] max-lg:gap-6 lg:mb-4 lg:gap-9">
                        <div className="flex items-center gap-2">
                            <div
                                className="size-3 rounded-[2px]"
                                style={{
                                    backgroundColor: CHART_COLORS.historias,
                                }}
                            />
                            <span style={{ color: CHART_COLORS.historias }}>
                                Historias
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="size-3 rounded-[2px]"
                                style={{
                                    backgroundColor: CHART_COLORS.productos,
                                }}
                            />
                            <span style={{ color: CHART_COLORS.productos }}>
                                Productos
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="size-3 rounded-[2px]"
                                style={{
                                    backgroundColor: CHART_COLORS.cancelados,
                                }}
                            />
                            <span style={{ color: CHART_COLORS.cancelados }}>
                                Cancelados
                            </span>
                        </div>
                    </div>

                    <Deferred
                        data="ventasChart"
                        fallback={
                            <div className="h-[186px] w-full animate-pulse rounded bg-gray-100 lg:h-[341px]" />
                        }
                    >
                        <div className="relative h-[186px] w-full min-w-0 lg:h-[341px]">
                            {!ventasChart?.length ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center text-[14px] font-medium text-[#7B7B7B]">
                                    Sin datos en el periodo
                                </div>
                            ) : null}
                            <ResponsiveContainer width="100%" height="100%">
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
                                        interval={0}
                                        minTickGap={4}
                                        tick={{
                                            fontSize: 12,
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
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: '#1B3D6D',
                                            color: '#fff',
                                            fontSize: '14px',
                                            padding: '5px 14px',
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                        labelFormatter={(label) =>
                                            String(label)
                                        }
                                        formatter={(value, name) => {
                                            const seriesLabels: Record<
                                                string,
                                                string
                                            > = {
                                                historias: 'Historias',
                                                productos: 'Productos',
                                                cancelados: 'Cancelados',
                                            };

                                            return [
                                                formatMxn(Number(value)),
                                                seriesLabels[String(name)] ??
                                                    String(name),
                                            ];
                                        }}
                                        cursor={{
                                            stroke: '#1B3D6D',
                                            strokeWidth: 1,
                                            strokeDasharray: '3 3',
                                        }}
                                    />
                                    {showHistoriasLine && (
                                        <Line
                                            type="monotone"
                                            dataKey="historias"
                                            stroke={CHART_COLORS.historias}
                                            strokeWidth={2.5}
                                            dot={false}
                                            strokeDasharray="4 4"
                                        />
                                    )}
                                    {showProductosLine && (
                                        <Line
                                            type="monotone"
                                            dataKey="productos"
                                            stroke={CHART_COLORS.productos}
                                            strokeWidth={2.5}
                                            dot={false}
                                        />
                                    )}
                                    {showCanceladosLine && (
                                        <Line
                                            type="monotone"
                                            dataKey="cancelados"
                                            stroke={CHART_COLORS.cancelados}
                                            strokeWidth={2.5}
                                            dot={false}
                                        />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Deferred>

                    <p className="mt-4 text-center text-[13px] leading-none font-semibold text-[#7B7B7B] lg:text-left">
                        Promedio de los últimos 30 Días:{' '}
                        {formatMxn(chartPromedio)}
                    </p>
                </div>
            </div>
        </div>
    );
}
