import {
    cardShadow,
    DONUT_COLORS,
    formatMxn,
    iconBoxClass,
    iconStroke,
} from '@/components/admin/dashboard/dashboard-tokens';
import type { DashboardMetricas } from '@/components/admin/dashboard/dashboard-types';
import { Deferred } from '@inertiajs/react';
import { DollarSign, ScrollText } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type DashboardSalesSidebarProps = {
    metricas?: DashboardMetricas;
    ventasHistoriasMes: number;
    ventasProductosMes: number;
};

export default function DashboardSalesSidebar({
    metricas,
    ventasHistoriasMes,
    ventasProductosMes,
}: DashboardSalesSidebarProps) {
    return (
        <div className="flex w-full min-w-0 flex-col gap-4 xl:w-[265px] xl:shrink-0 xl:gap-4">
            <div className={`rounded-[4px] bg-white p-3 ${cardShadow}`}>
                <div className="mb-3 flex items-start justify-between gap-2 lg:mb-0 lg:gap-2">
                    <h3 className="text-[16px] font-semibold leading-none text-[#7B7B7B]">
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
                        <div className="mb-4 h-8 w-40 animate-pulse rounded bg-gray-200 lg:mt-3" />
                    }
                >
                    <p className="mb-4 text-[25px] font-semibold leading-none text-[#A4A4A4] lg:mb-3 lg:mt-3">
                        {formatMxn(metricas?.ventas_del_mes ?? 0).replace(
                            ' MX',
                            'MX',
                        )}
                    </p>
                </Deferred>

                <Deferred
                    data="ventasChart"
                    fallback={
                        <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
                    }
                >
                    <div className="flex flex-col gap-2 text-[13px] lg:gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-[2px] bg-[#734B19]" />
                                <span className="text-[#734B19]">Historias</span>
                            </div>
                            <span className="text-[#734B19]">
                                {formatMxn(ventasHistoriasMes)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-3 rounded-[2px] bg-[#1B3D6D]" />
                                <span className="text-[#1B3D6D]">Productos</span>
                            </div>
                            <span className="text-[#1B3D6D]">
                                {formatMxn(ventasProductosMes)}
                            </span>
                        </div>
                    </div>
                </Deferred>
            </div>

            <div
                className={`flex flex-1 flex-col rounded-[4px] bg-white p-3 ${cardShadow} lg:gap-4`}
            >
                <div className="mb-4 flex items-center justify-between gap-2 lg:mb-0">
                    <h3 className="text-[16px] font-semibold leading-none text-[#7B7B7B]">
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
                    {metricas?.suscripciones_por_historia?.length ? (
                        <>
                            <div className="relative mx-auto mb-4 flex h-[220px] w-full items-center justify-center rounded-[2px] border border-[#F2F2F2] p-4 lg:mb-0">
                                <ResponsiveContainer width="100%" height="100%">
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
                                                        key={`cell-${entry.name}`}
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
                                        {metricas.suscripciones_activas_total}
                                    </span>
                                    <span className="max-w-[90px] text-center text-[9px] leading-normal text-[#7B7B7B]">
                                        Total suscripciones activas
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 rounded-b-[2px] bg-[#FBFBFF] p-4 text-[13px] lg:gap-2">
                                {metricas.suscripciones_por_historia.map(
                                    (hist, i) => (
                                        <div
                                            key={hist.name}
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
    );
}
