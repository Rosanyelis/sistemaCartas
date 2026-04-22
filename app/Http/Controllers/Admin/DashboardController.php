<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DashboardMetricasService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardMetricasService $metricas
    ) {}

    public function index(Request $request): Response
    {
        $periodo = $request->input('periodo', 'mes');

        return Inertia::render('admin/dashboard', [
            'metricas' => Inertia::defer(fn () => $this->metricas->toArray()),
            'ventasChart' => Inertia::defer(fn () => $this->metricas->ventasChart($periodo)),
            'filters' => ['periodo' => $periodo],
        ]);
    }
}
