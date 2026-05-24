<?php

use App\Models\Historia;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\Suscripcion;
use App\Models\User;
use App\Services\Admin\DashboardMetricasService;
use Database\Seeders\DashboardDemoDataSeeder;
use Illuminate\Support\Carbon;

beforeEach(function (): void {
    Carbon::setTestNow('2026-05-21');
});

afterEach(function (): void {
    Carbon::setTestNow();
});

test('dashboard demo data seeder crea cantidades exactas en mayo 2026', function (): void {
    (new DashboardDemoDataSeeder)->configure(2026, 5, true)->run();

    expect(
        User::query()
            ->clientes()
            ->where('email', 'like', 'demo-cliente-%@historiasporcorreo.test')
            ->count(),
    )->toBe(30);

    expect(Producto::query()->where('slug', 'like', 'demo-producto-%')->count())->toBe(30);
    expect(Historia::query()->where('slug', 'like', 'demo-historia-%')->count())->toBe(30);

    expect(
        StoreOrder::query()
            ->where('status', StoreOrder::STATUS_PAID)
            ->where('paypal_order_id', 'like', 'DEMO-ORDER-MAY-%')
            ->whereMonth('created_at', 5)
            ->whereYear('created_at', 2026)
            ->count(),
    )->toBe(50);

    expect(
        Suscripcion::query()
            ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
            ->whereMonth('created_at', 5)
            ->whereYear('created_at', 2026)
            ->count(),
    )->toBe(45);
});

test('dashboard demo data seeder alimenta metricas y grafico del mes', function (): void {
    (new DashboardDemoDataSeeder)->configure(2026, 5, true)->run();

    $service = app(DashboardMetricasService::class);
    $data = $service->toArray();

    expect($data['clientes_nuevos_mes'])->toBeGreaterThanOrEqual(30)
        ->and($data['suscripciones_del_mes'])->toBeGreaterThanOrEqual(45)
        ->and($data['ventas_productos_del_mes'])->toBeGreaterThan(0);

    $chart = $service->ventasChart('mes');

    expect($chart)->not->toBeEmpty();

    $may = collect($chart)->firstWhere('name', 'May');
    expect($may)->not->toBeNull()
        ->and($may['historias'])->toBeGreaterThan(0)
        ->and($may['productos'])->toBeGreaterThan(0);
});

test('dashboard demo data seeder aborta en produccion', function (): void {
    $app = app();
    $previous = $app['env'];
    $app['env'] = 'production';

    try {
        expect(fn () => (new DashboardDemoDataSeeder)->run())
            ->toThrow(\RuntimeException::class, 'producción');
    } finally {
        $app['env'] = $previous;
    }
});
