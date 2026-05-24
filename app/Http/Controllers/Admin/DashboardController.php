<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardMetricasService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardMetricasService $metricas
    ) {}

    public function index(Request $request): Response
    {
        Gate::authorize('admin');

        $periodo = $request->input('periodo', 'mes');
        $validated = $request->validate([
            'periodo' => ['sometimes', 'string', 'in:mes,semana'],
            'fecha_desde' => ['nullable', 'date'],
            'fecha_hasta' => ['nullable', 'date', 'after_or_equal:fecha_desde'],
        ]);

        $periodo = $validated['periodo'] ?? $periodo;
        $desde = isset($validated['fecha_desde'])
            ? Carbon::parse($validated['fecha_desde'])->startOfDay()
            : null;
        $hasta = isset($validated['fecha_hasta'])
            ? Carbon::parse($validated['fecha_hasta'])->endOfDay()
            : null;

        $chartAxisRange = $this->metricas->ventasChartAxisRange($periodo, $desde, $hasta);

        return Inertia::render('admin/dashboard', [
            'metricas' => Inertia::defer(fn () => $this->metricas->toArray()),
            'ventasChart' => Inertia::defer(fn () => $this->metricas->ventasChart($periodo, $desde, $hasta)),
            'filters' => [
                'periodo' => $periodo,
                'fecha_desde' => $desde?->toDateString(),
                'fecha_hasta' => $hasta?->toDateString(),
                'chart_desde' => $chartAxisRange['desde'] ?? null,
                'chart_hasta' => $chartAxisRange['hasta'] ?? null,
            ],
        ]);
    }
}
