<?php

namespace App\Services\Admin;

use App\Models\Historia;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\Suscripcion;
use App\Models\User;
use Carbon\Carbon;

class DashboardMetricasService
{
    public function usuariosRegistrados(): int
    {
        return User::query()->count();
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
            ->where('status', 'completed')
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
            'usuarios_registrados' => $this->usuariosRegistrados(),
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
                $query->where('status', 'active');
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
     * @return array<int, array<string, mixed>>
     */
    public function ventasChart(string $periodo = 'mes'): array
    {
        $data = [];
        $now = Carbon::now();

        if ($periodo === 'semana') {
            for ($i = 6; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i);

                $historias = StoreOrder::query()
                    ->where('status', 'paid')
                    ->whereDate('created_at', $date)
                    ->whereHas('items', fn ($q) => $q->where('buyable_type', Historia::class))
                    ->sum('total');

                $productos = StoreOrder::query()
                    ->where('status', 'paid')
                    ->whereDate('created_at', $date)
                    ->whereHas('items', fn ($q) => $q->where('buyable_type', Producto::class))
                    ->sum('total');

                $cancelados = StoreOrder::query()
                    ->where('status', '!=', 'paid')
                    ->whereDate('created_at', $date)
                    ->sum('total');

                $data[] = [
                    'name' => $date->format('D'),
                    'historias' => (float) $historias,
                    'productos' => (float) $productos,
                    'cancelados' => (float) $cancelados,
                ];
            }
        } else {
            for ($i = 11; $i >= 0; $i--) {
                $date = $now->copy()->subMonths($i);

                $historias = StoreOrder::query()
                    ->where('status', 'paid')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->whereHas('items', fn ($q) => $q->where('buyable_type', Historia::class))
                    ->sum('total');

                $productos = StoreOrder::query()
                    ->where('status', 'paid')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->whereHas('items', fn ($q) => $q->where('buyable_type', Producto::class))
                    ->sum('total');

                $cancelados = StoreOrder::query()
                    ->where('status', '!=', 'paid')
                    ->whereMonth('created_at', $date->month)
                    ->whereYear('created_at', $date->year)
                    ->sum('total');

                $data[] = [
                    'name' => $date->format('M'),
                    'historias' => (float) $historias,
                    'productos' => (float) $productos,
                    'cancelados' => (float) $cancelados,
                ];
            }
        }

        return $data;
    }
}
