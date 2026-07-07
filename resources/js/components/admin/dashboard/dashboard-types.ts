export type DashboardMetricas = {
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

export type VentasChartPoint = {
    name: string;
    historias: number;
    productos: number;
    cancelados: number;
};

export type DashboardFilters = {
    periodo: string;
    anio?: number | null;
    fecha_desde?: string | null;
    fecha_hasta?: string | null;
    chart_desde?: string | null;
    chart_hasta?: string | null;
};

export type ChartSerieFilter =
    | 'todos'
    | 'historias'
    | 'productos'
    | 'cancelados';

export const CHART_FILTER_OPTIONS: {
    key: ChartSerieFilter;
    label: string;
}[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'historias', label: 'Historias' },
    { key: 'productos', label: 'Productos' },
    { key: 'cancelados', label: 'Cancelados' },
];
