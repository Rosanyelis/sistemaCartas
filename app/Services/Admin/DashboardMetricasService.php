<?php

namespace App\Services\Admin;

use App\Models\Historia;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class DashboardMetricasService
{
    public function clientesRegistrados(): int
    {
        return User::query()->where('role', 'cliente')->count();
    }

    public function suscripcionesDelMes(): int
    {
        return Suscripcion::query()
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
    }

    public function ordenesDelDia(): int
    {
        return StoreOrder::query()
            ->whereDate('created_at', Carbon::today())
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

    public function ventasDelMes(): float
    {
        return (float) StoreOrder::query()
            ->where('status', StoreOrder::STATUS_PAID)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'clientes_registrados' => $this->clientesRegistrados(),
            'suscripciones_del_mes' => $this->suscripcionesDelMes(),
            'ordenes_del_dia' => $this->ordenesDelDia(),
            'historias_activas' => $this->historiasActivas(),
            'productos_activos' => $this->productosActivos(),
            'ventas_del_mes' => $this->ventasDelMes(),
            'suscripciones_por_historia' => $this->suscripcionesPorHistoria(),
        ];
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
