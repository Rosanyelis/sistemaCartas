<?php

namespace App\Services\Admin;

use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use App\Support\HistoriaSuscripcionPrecio;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class DashboardMetricasService
{
    /** @var list<string> */
    private const MESES_ABREV_ES = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];

    /** @var list<string> Índice = Carbon::dayOfWeek (0 = domingo). */
    private const DIAS_ABREV_ES = [
        'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb',
    ];

    public function clientesRegistrados(): int
    {
        return User::query()->clientes()->count();
    }

    public function suscripcionesDelMes(): int
    {
        return Suscripcion::query()
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
    }

    public function suscripcionesActivasMes(): int
    {
        return Suscripcion::query()
            ->where('estado', 'activa')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
    }

    public function suscripcionesBajasMes(): int
    {
        return Suscripcion::query()
            ->where('estado', 'inactiva')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
    }

    public function clientesNuevosMes(): int
    {
        return User::query()
            ->clientes()
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
    }

    public function clientesCrecimientoPorcentaje(): float
    {
        $total = $this->clientesRegistrados();
        $nuevos = $this->clientesNuevosMes();

        if ($total === 0) {
            return 0.0;
        }

        return round(($nuevos / $total) * 100, 2);
    }

    public function ordenesDelDia(): int
    {
        return StoreOrder::query()
            ->whereDate('created_at', Carbon::today())
            ->count();
    }

    public function ordenesCompletadasDia(): int
    {
        return StoreOrder::query()
            ->whereDate('created_at', Carbon::today())
            ->where('status', StoreOrder::STATUS_PAID)
            ->count();
    }

    public function ordenesRechazadasDia(): int
    {
        return StoreOrder::query()
            ->whereDate('created_at', Carbon::today())
            ->where('status', StoreOrder::STATUS_CAPTURE_FAILED)
            ->count();
    }

    public function historiasActivas(): int
    {
        return Historia::query()->where('estado', 'activo')->count();
    }

    public function productosActivos(): int
    {
        return Producto::query()->where('estado', 'activo')->count();
    }

    public function ventasProductosDelMes(): float
    {
        return $this->sumPaidProductoLineTotals($this->orderMonthConstraint());
    }

    public function ventasHistoriasOrdenesDelMes(): float
    {
        return $this->sumPaidHistoriaLineTotals($this->orderMonthConstraint());
    }

    public function ventasSuscripcionesDelMes(): float
    {
        return $this->sumSuscripcionesNetasDelMes();
    }

    public function ventasDelMes(): float
    {
        return round(
            $this->ventasProductosDelMes()
            + $this->ventasHistoriasOrdenesDelMes()
            + $this->ventasSuscripcionesDelMes(),
            2,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'clientes_registrados' => $this->clientesRegistrados(),
            'clientes_nuevos_mes' => $this->clientesNuevosMes(),
            'clientes_crecimiento_porcentaje' => $this->clientesCrecimientoPorcentaje(),
            'suscripciones_del_mes' => $this->suscripcionesDelMes(),
            'suscripciones_activas_mes' => $this->suscripcionesActivasMes(),
            'suscripciones_bajas_mes' => $this->suscripcionesBajasMes(),
            'ordenes_del_dia' => $this->ordenesDelDia(),
            'ordenes_completadas_dia' => $this->ordenesCompletadasDia(),
            'ordenes_rechazadas_dia' => $this->ordenesRechazadasDia(),
            'historias_activas' => $this->historiasActivas(),
            'productos_activos' => $this->productosActivos(),
            'ventas_productos_del_mes' => $this->ventasProductosDelMes(),
            'ventas_historias_ordenes_del_mes' => $this->ventasHistoriasOrdenesDelMes(),
            'ventas_suscripciones_del_mes' => $this->ventasSuscripcionesDelMes(),
            'ventas_del_mes' => $this->ventasDelMes(),
            'suscripciones_por_historia' => $this->suscripcionesPorHistoria(),
            'suscripciones_activas_total' => $this->suscripcionesActivasTotal(),
        ];
    }

    /**
     * @return callable(Builder<StoreOrder>): void
     */
    protected function orderMonthConstraint(): callable
    {
        $now = Carbon::now();

        return function (Builder $q) use ($now): void {
            $q->whereMonth('created_at', $now->month)
                ->whereYear('created_at', $now->year);
        };
    }

    protected function sumSuscripcionesNetasDelMes(): float
    {
        $now = Carbon::now();

        return $this->sumSuscripcionesHistoriasNetasBetween(
            $now->copy()->startOfMonth(),
            $now->copy()->endOfMonth(),
        );
    }

    /**
     * Monto neto de suscripciones a historias en un intervalo (eventos PayPal + fallback sin evento).
     */
    protected function sumSuscripcionesHistoriasNetasBetween(Carbon $start, Carbon $end): float
    {
        $eventos = PasarelaEvento::query()
            ->where('estado', PasarelaEvento::ESTADO_COMPLETADO)
            ->whereNotNull('suscripcion_id')
            ->whereBetween('created_at', [$start, $end])
            ->whereIn('event_type', [
                'PAYMENT.SALE.COMPLETED',
                'BILLING.SUBSCRIPTION.ACTIVATED',
            ])
            ->with(['suscripcion.historia'])
            ->orderBy('created_at')
            ->get();

        $suscripcionIdsConCobro = $eventos
            ->where('event_type', 'PAYMENT.SALE.COMPLETED')
            ->pluck('suscripcion_id')
            ->unique();

        $total = 0.0;
        $suscripcionIdsContabilizados = [];

        foreach ($eventos as $evento) {
            if (
                $evento->event_type === 'BILLING.SUBSCRIPTION.ACTIVATED'
                && $suscripcionIdsConCobro->contains($evento->suscripcion_id)
            ) {
                continue;
            }

            $historia = $evento->suscripcion?->historia;
            if ($historia === null || $evento->suscripcion_id === null) {
                continue;
            }

            $total += HistoriaSuscripcionPrecio::montoPorCiclo($historia);
            $suscripcionIdsContabilizados[] = $evento->suscripcion_id;
        }

        $suscripcionesSinEvento = Suscripcion::query()
            ->where('estado', 'activa')
            ->whereBetween('created_at', [$start, $end])
            ->when(
                $suscripcionIdsContabilizados !== [],
                fn (Builder $q) => $q->whereNotIn('id', $suscripcionIdsContabilizados),
            )
            ->with('historia')
            ->get();

        foreach ($suscripcionesSinEvento as $suscripcion) {
            $historia = $suscripcion->historia;
            if ($historia === null) {
                continue;
            }

            $total += HistoriaSuscripcionPrecio::montoPorCiclo($historia);
        }

        return round($total, 2);
    }

    public function suscripcionesActivasTotal(): int
    {
        return Suscripcion::query()->where('estado', 'activa')->count();
    }

    public function suscripcionesPorHistoria(): array
    {
        return Historia::query()
            ->withCount(['suscripciones' => function ($query) {
                $query->where('estado', 'activa');
            }])
            ->orderByDesc('suscripciones_count')
            ->take(5)
            ->get()
            ->map(function ($h) {
                return [
                    'name' => $h->nombre,
                    'value' => $h->suscripciones_count,
                ];
            })
            ->toArray();
    }

    /**
     * Suma `line_total` de ítems de órdenes pagadas: slug coincide con historia activa (no eliminada).
     *
     * @param  callable(Builder<StoreOrder>): void  $orderDateConstraint
     */
    protected function sumPaidHistoriaLineTotals(callable $orderDateConstraint): float
    {
        return (float) StoreOrderItem::query()
            ->whereHas('storeOrder', function (Builder $q) use ($orderDateConstraint): void {
                $q->where('status', StoreOrder::STATUS_PAID);
                $orderDateConstraint($q);
            })
            ->whereExists(function ($sub): void {
                $sub->selectRaw('1')
                    ->from('historias')
                    ->whereColumn('historias.slug', 'store_order_items.product_slug')
                    ->where('historias.estado', 'activo')
                    ->whereNull('historias.deleted_at');
            })
            ->sum('line_total');
    }

    /**
     * Suma `line_total` de ítems de órdenes pagadas: slug coincide con producto activo y no con una historia (evita duplicar).
     *
     * @param  callable(Builder<StoreOrder>): void  $orderDateConstraint
     */
    protected function sumPaidProductoLineTotals(callable $orderDateConstraint): float
    {
        return (float) StoreOrderItem::query()
            ->whereHas('storeOrder', function (Builder $q) use ($orderDateConstraint): void {
                $q->where('status', StoreOrder::STATUS_PAID);
                $orderDateConstraint($q);
            })
            ->whereExists(function ($sub): void {
                $sub->selectRaw('1')
                    ->from('productos')
                    ->whereColumn('productos.slug', 'store_order_items.product_slug')
                    ->where('productos.estado', 'activo')
                    ->whereNull('productos.deleted_at');
            })
            ->whereNotExists(function ($sub): void {
                $sub->selectRaw('1')
                    ->from('historias')
                    ->whereColumn('historias.slug', 'store_order_items.product_slug')
                    ->whereNull('historias.deleted_at');
            })
            ->sum('line_total');
    }

    /**
     * Serie temporal para «Rendimientos de ventas».
     *
     * - historias: cobros netos de suscripciones a historias (PayPal/PasarelaEvento) más
     *   compras de ítems cuyo slug corresponde a una historia activa (órdenes pagadas).
     * - productos: compras de productos del catálogo (slug de producto activo, sin historia).
     * - cancelados: total de órdenes no pagadas en el periodo.
     *
     * @return array<int, array{name: string, historias: float, productos: float, cancelados: float}>
     */
    public function ventasChart(
        string $periodo = 'mes',
        ?Carbon $desde = null,
        ?Carbon $hasta = null,
        ?int $anio = null,
    ): array {
        if ($periodo === 'semana' && $desde === null && $hasta === null) {
            return $this->buildWeeklyChart();
        }

        if ($periodo === 'semana' && $desde !== null && $hasta !== null) {
            $days = $desde->copy()->startOfDay()->diffInDays($hasta->copy()->endOfDay()) + 1;
            if ($days <= 7) {
                return $this->buildDailyChartBetween($desde, $hasta);
            }
        }

        [$searchStart, $searchEnd] = $this->resolveChartSearchWindow($desde, $hasta, $anio);
        $firstMonth = $this->primerMesConDatosEnPeriodo($searchStart, $searchEnd);

        if ($firstMonth === null) {
            return [];
        }

        $endMonth = $this->resolveMonthlyChartEndMonth($firstMonth, $searchEnd);

        return $this->buildMonthlyChartBetween(
            $firstMonth->copy()->startOfMonth(),
            $endMonth,
        );
    }

    /**
     * Rango efectivo del eje del gráfico (para etiqueta en UI).
     *
     * @return array{desde: string, hasta: string}|null
     */
    public function ventasChartAxisRange(
        string $periodo = 'mes',
        ?Carbon $desde = null,
        ?Carbon $hasta = null,
        ?int $anio = null,
    ): ?array {
        if ($periodo === 'semana' && $desde === null && $hasta === null) {
            $now = Carbon::now();

            return [
                'desde' => $now->copy()->subDays(6)->toDateString(),
                'hasta' => $now->toDateString(),
            ];
        }

        if ($periodo === 'semana' && $desde !== null && $hasta !== null) {
            $days = $desde->copy()->startOfDay()->diffInDays($hasta->copy()->endOfDay()) + 1;
            if ($days <= 7) {
                return [
                    'desde' => $desde->toDateString(),
                    'hasta' => $hasta->toDateString(),
                ];
            }
        }

        [$searchStart, $searchEnd] = $this->resolveChartSearchWindow($desde, $hasta, $anio);
        $firstMonth = $this->primerMesConDatosEnPeriodo($searchStart, $searchEnd);

        if ($firstMonth === null) {
            return null;
        }

        $endMonth = $this->resolveMonthlyChartEndMonth($firstMonth, $searchEnd);

        return [
            'desde' => $firstMonth->copy()->startOfMonth()->toDateString(),
            'hasta' => $endMonth->copy()->endOfMonth()->toDateString(),
        ];
    }

    protected function resolveMonthlyChartEndMonth(Carbon $firstMonth, Carbon $searchEnd): Carbon
    {
        $december = Carbon::create($firstMonth->year, 12, 1)->startOfMonth();
        $searchEndMonth = $searchEnd->copy()->startOfMonth();

        return $december->lte($searchEndMonth) ? $december : $searchEndMonth;
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    protected function resolveChartSearchWindow(
        ?Carbon $desde,
        ?Carbon $hasta,
        ?int $anio = null,
    ): array {
        if ($desde !== null && $hasta !== null) {
            return [$desde->copy()->startOfDay(), $hasta->copy()->endOfDay()];
        }

        $targetYear = $anio !== null ? $anio : Carbon::now()->year;

        return [
            Carbon::create($targetYear, 1, 1)->startOfDay(),
            Carbon::create($targetYear, 12, 31)->endOfDay(),
        ];
    }

    protected function primerMesConDatosEnPeriodo(Carbon $inicio, Carbon $fin): ?Carbon
    {
        $meses = $this->mesesConDatosEntre($inicio, $fin);

        return $meses->first();
    }

    protected function ultimoMesConDatosEnPeriodo(Carbon $inicio, Carbon $fin): ?Carbon
    {
        $meses = $this->mesesConDatosEntre($inicio, $fin);

        return $meses->last();
    }

    /**
     * @return Collection<int, Carbon>
     */
    protected function mesesConDatosEntre(Carbon $inicio, Carbon $fin): Collection
    {
        $inicio = $inicio->copy()->startOfDay();
        $fin = $fin->copy()->endOfDay();

        $keys = [];

        foreach ($this->distinctYearMonthRows(
            StoreOrder::query()->whereBetween('created_at', [$inicio, $fin]),
        ) as $row) {
            $keys[$row['year'].'-'.$row['month']] = true;
        }

        foreach ($this->distinctYearMonthRows(
            PasarelaEvento::query()
                ->where('estado', PasarelaEvento::ESTADO_COMPLETADO)
                ->whereNotNull('suscripcion_id')
                ->whereBetween('created_at', [$inicio, $fin])
                ->whereIn('event_type', [
                    'PAYMENT.SALE.COMPLETED',
                    'BILLING.SUBSCRIPTION.ACTIVATED',
                ]),
        ) as $row) {
            $keys[$row['year'].'-'.$row['month']] = true;
        }

        foreach ($this->distinctYearMonthRows(
            Suscripcion::query()->whereBetween('created_at', [$inicio, $fin]),
        ) as $row) {
            $keys[$row['year'].'-'.$row['month']] = true;
        }

        return collect(array_keys($keys))
            ->map(function (string $key): Carbon {
                [$year, $month] = explode('-', $key);

                return Carbon::create((int) $year, (int) $month, 1)->startOfMonth();
            })
            ->sort()
            ->values();
    }

    /**
     * @param  Builder<Model>  $query
     * @return list<array{year: int, month: int}>
     */
    protected function distinctYearMonthRows(Builder $query): array
    {
        $connection = $query->getModel()->getConnection();
        $column = $query->getModel()->getTable().'.created_at';

        if ($connection->getDriverName() === 'sqlite') {
            $rows = $query
                ->selectRaw("CAST(strftime('%Y', {$column}) AS INTEGER) as chart_year, CAST(strftime('%m', {$column}) AS INTEGER) as chart_month")
                ->distinct()
                ->get();
        } else {
            $rows = $query
                ->selectRaw("YEAR({$column}) as chart_year, MONTH({$column}) as chart_month")
                ->distinct()
                ->get();
        }

        return $rows
            ->map(fn ($row): array => [
                'year' => (int) $row->chart_year,
                'month' => (int) $row->chart_month,
            ])
            ->all();
    }

    /**
     * @return array<int, array{name: string, historias: float, productos: float, cancelados: float}>
     */
    protected function buildMonthlyChartBetween(Carbon $startMonth, Carbon $endMonth): array
    {
        $data = [];
        $current = $startMonth->copy()->startOfMonth();
        $end = $endMonth->copy()->startOfMonth();

        while ($current->lte($end)) {
            $orderForMonth = function (Builder $q) use ($current): void {
                $q->whereMonth('created_at', $current->month)
                    ->whereYear('created_at', $current->year);
            };

            $data[] = [
                'name' => self::MESES_ABREV_ES[$current->month - 1],
                'historias' => $this->ventasHistoriasEnPeriodo(
                    $current->copy()->startOfMonth(),
                    $current->copy()->endOfMonth(),
                    $orderForMonth,
                ),
                'productos' => $this->sumPaidProductoLineTotals($orderForMonth),
                'cancelados' => (float) StoreOrder::query()
                    ->where('status', '!=', StoreOrder::STATUS_PAID)
                    ->whereMonth('created_at', $current->month)
                    ->whereYear('created_at', $current->year)
                    ->sum('total'),
            ];

            $current->addMonth();
        }

        return $data;
    }

    /**
     * @return array<int, array{name: string, historias: float, productos: float, cancelados: float}>
     */
    protected function buildWeeklyChart(): array
    {
        $data = [];
        $now = Carbon::now();

        for ($i = 6; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            $data[] = $this->buildChartPointForDay($date);
        }

        return $data;
    }

    /**
     * @return array<int, array{name: string, historias: float, productos: float, cancelados: float}>
     */
    protected function buildDailyChartBetween(Carbon $desde, Carbon $hasta): array
    {
        $data = [];
        $current = $desde->copy()->startOfDay();
        $end = $hasta->copy()->startOfDay();

        while ($current->lte($end)) {
            $data[] = $this->buildChartPointForDay($current);
            $current->addDay();
        }

        return $data;
    }

    /**
     * @return array{name: string, historias: float, productos: float, cancelados: float}
     */
    protected function buildChartPointForDay(Carbon $date): array
    {
        $orderForDay = function (Builder $q) use ($date): void {
            $q->whereDate('created_at', $date->toDateString());
        };

        return [
            'name' => self::DIAS_ABREV_ES[$date->dayOfWeek],
            'historias' => $this->ventasHistoriasEnPeriodo(
                $date->copy()->startOfDay(),
                $date->copy()->endOfDay(),
                $orderForDay,
            ),
            'productos' => $this->sumPaidProductoLineTotals($orderForDay),
            'cancelados' => (float) StoreOrder::query()
                ->where('status', '!=', StoreOrder::STATUS_PAID)
                ->whereDate('created_at', $date->toDateString())
                ->sum('total'),
        ];
    }

    /**
     * Ventas atribuibles a historias en un bucket (suscripciones + compras one-shot de historia).
     */
    protected function ventasHistoriasEnPeriodo(
        Carbon $start,
        Carbon $end,
        callable $orderDateConstraint,
    ): float {
        return round(
            $this->sumSuscripcionesHistoriasNetasBetween($start, $end)
            + $this->sumPaidHistoriaLineTotals($orderDateConstraint),
            2,
        );
    }
}
