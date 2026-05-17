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

class DashboardMetricasService
{
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

        if ($total <= $nuevos || $nuevos === 0) {
            return 0.0;
        }

        $anteriores = $total - $nuevos;

        return round(($nuevos / $anteriores) * 100, 2);
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

        $eventos = PasarelaEvento::query()
            ->where('estado', PasarelaEvento::ESTADO_COMPLETADO)
            ->whereNotNull('suscripcion_id')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
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

        foreach ($eventos as $evento) {
            if (
                $evento->event_type === 'BILLING.SUBSCRIPTION.ACTIVATED'
                && $suscripcionIdsConCobro->contains($evento->suscripcion_id)
            ) {
                continue;
            }

            $historia = $evento->suscripcion?->historia;
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
     * @return array<int, array<string, mixed>>
     */
    public function ventasChart(string $periodo = 'mes'): array
    {
        $data = [];
        $now = Carbon::now();

        if ($periodo === 'semana') {
            for ($i = 6; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i);

                $orderForDay = function (Builder $q) use ($date): void {
                    $q->whereDate('created_at', $date->toDateString());
                };

                $historias = $this->sumPaidHistoriaLineTotals($orderForDay);
                $productos = $this->sumPaidProductoLineTotals($orderForDay);
                $cancelados = (float) StoreOrder::query()
                    ->where('status', '!=', StoreOrder::STATUS_PAID)
                    ->whereDate('created_at', $date->toDateString())
                    ->sum('total');

                $data[] = [
                    'name' => $date->format('D'),
                    'historias' => $historias,
                    'productos' => $productos,
                    'cancelados' => $cancelados,
                ];
            }
        } else {
            for ($i = 11; $i >= 0; $i--) {
                $date = $now->copy()->subMonths($i);

                $orderForMonth = function (Builder $q) use ($date): void {
                    $q->whereMonth('created_at', $date->month)
                        ->whereYear('created_at', $date->year);
                };

                $historias = $this->sumPaidHistoriaLineTotals($orderForMonth);
                $productos = $this->sumPaidProductoLineTotals($orderForMonth);
                $cancelados = (float) StoreOrder::query()
                    ->where('status', '!=', StoreOrder::STATUS_PAID)
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->sum('total');

                $data[] = [
                    'name' => $date->format('M'),
                    'historias' => $historias,
                    'productos' => $productos,
                    'cancelados' => $cancelados,
                ];
            }
        }

        return $data;
    }
}
