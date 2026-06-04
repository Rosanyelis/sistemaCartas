<?php

use App\Models\Historia;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\Suscripcion;
use App\Models\User;
use App\Services\Admin\DashboardMetricasService;
use App\Support\HistoriaSuscripcionPrecio;
use Database\Seeders\DashboardDemoDataSeeder;
use Database\Seeders\Support\HistoriaSeederImagenes;
use Illuminate\Support\Carbon;

function demoPeriodStart(int $year = 2026): Carbon
{
    return Carbon::create($year, 4, 1)->startOfDay();
}

function demoPeriodEnd(int $year = 2026): Carbon
{
    return Carbon::create($year, 6, 3)->endOfDay();
}

function assertDemoRecordsSpanPeriod($records, int $year = 2026): void
{
    expect($records)->not->toBeEmpty();
    expect($records->filter(fn ($record) => $record->created_at->month === 4)->count())->toBeGreaterThan(0);
    expect($records->filter(fn ($record) => $record->created_at->month === 5)->count())->toBeGreaterThan(0);
    expect($records->filter(fn ($record) => $record->created_at->month === 6 && $record->created_at->day <= 3
    )->count())->toBeGreaterThan(0);
    expect($records->every(fn ($record) => $record->created_at->between(demoPeriodStart($year), demoPeriodEnd($year))
    ))->toBeTrue();
}

beforeEach(function (): void {
    Carbon::setTestNow('2026-06-03');
});

afterEach(function (): void {
    Carbon::setTestNow();
});

test('dashboard demo data seeder crea cantidades exactas repartidas abr may jun 2026', function (): void {
    (new DashboardDemoDataSeeder)->configure(2026, null, true)->run();

    expect(
        User::query()
            ->clientes()
            ->where('email', 'like', 'demo-cliente-%@historiasporcorreo.test')
            ->count(),
    )->toBe(30);

    expect(Producto::query()->where('slug', 'like', 'demo-producto-%')->count())->toBe(30);

    $productoDemo = Producto::query()
        ->where('slug', 'demo-producto-1')
        ->with('galeria')
        ->first();

    expect($productoDemo?->imagen)->toStartWith('/images/products/');
    expect($productoDemo?->galeria)->toHaveCount(5);
    expect($productoDemo?->galeria->pluck('path')->all())
        ->each->toMatch('/^\/images\/products\/product-\d\.png$/');

    expect(Historia::query()->where('slug', 'like', 'demo-historia-%')->count())->toBe(30);

    $historiaDemo = Historia::query()
        ->where('slug', 'demo-historia-1')
        ->with('galeria')
        ->first();

    expect($historiaDemo?->imagen)->toBeIn(HistoriaSeederImagenes::MAIN_IMAGE_POOL);
    expect($historiaDemo?->galeria)->toHaveCount(5);
    expect($historiaDemo?->galeria->pluck('path')->all())
        ->each->toStartWith('/images/cards/cards-');

    $orders = StoreOrder::query()
        ->where('status', StoreOrder::STATUS_PAID)
        ->where('paypal_order_id', 'like', 'DEMO-ORDER-MAY-%')
        ->get();

    expect($orders)->toHaveCount(50);
    assertDemoRecordsSpanPeriod($orders);

    $subscriptions = Suscripcion::query()
        ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
        ->get();

    expect($subscriptions)->toHaveCount(45);
    assertDemoRecordsSpanPeriod($subscriptions);
});

test('dashboard demo data seeder calcula fecha finalizacion segun meses de entrega de la historia', function (): void {
    (new DashboardDemoDataSeeder)->configure(2026, null, true)->run();

    $suscripcion = Suscripcion::query()
        ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
        ->with('historia')
        ->first();

    expect($suscripcion)->not->toBeNull();

    $historia = $suscripcion->historia;
    expect($historia)->not->toBeNull();

    expect($suscripcion->meses_entrega_total)->toBe(
        HistoriaSuscripcionPrecio::mesesEntregaTotal($historia),
    );

    expect($suscripcion->fecha_finalizacion)->not->toBeNull();

    expect($suscripcion->fecha_finalizacion->format('Y-m-d'))->toBe(
        Carbon::parse($suscripcion->fecha_adquisicion)
            ->addMonthsNoOverflow((int) $suscripcion->meses_entrega_total)
            ->toDateString(),
    );

    $demoSuscripciones = Suscripcion::query()
        ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
        ->with('historia')
        ->get();

    foreach ($demoSuscripciones as $demoSuscripcion) {
        $mesesHistoria = HistoriaSuscripcionPrecio::mesesEntregaTotal($demoSuscripcion->historia);

        if ($mesesHistoria === null) {
            continue;
        }

        expect($demoSuscripcion->fecha_finalizacion)->not->toBeNull();
        expect($demoSuscripcion->meses_entrega_total)->toBe($mesesHistoria);
    }
});

test('dashboard demo data seeder alimenta metricas y grafico con actividad en abr may y jun', function (): void {
    (new DashboardDemoDataSeeder)->configure(2026, null, true)->run();

    $service = app(DashboardMetricasService::class);
    $data = $service->toArray();

    expect($data['clientes_nuevos_mes'])->toBeGreaterThanOrEqual(0)
        ->and($data['suscripciones_del_mes'])->toBeGreaterThanOrEqual(0)
        ->and($data['ventas_productos_del_mes'])->toBeGreaterThanOrEqual(0);

    $chart = $service->ventasChart('mes');

    expect($chart)->not->toBeEmpty();

    $abr = collect($chart)->firstWhere('name', 'Abr');
    $may = collect($chart)->firstWhere('name', 'May');
    $jun = collect($chart)->firstWhere('name', 'Jun');

    expect($abr)->not->toBeNull()
        ->and($abr['historias'] + $abr['productos'])->toBeGreaterThan(0);
    expect($may)->not->toBeNull()
        ->and($may['historias'])->toBeGreaterThan(0)
        ->and($may['productos'])->toBeGreaterThan(0);
    expect($jun)->not->toBeNull()
        ->and($jun['historias'] + $jun['productos'])->toBeGreaterThan(0);
});

test('dashboard demo data seeder aborta en produccion', function (): void {
    $app = app();
    $previous = $app['env'];
    $app['env'] = 'production';

    try {
        expect(fn () => (new DashboardDemoDataSeeder)->run())
            ->toThrow(RuntimeException::class, 'producción');
    } finally {
        $app['env'] = $previous;
    }
});
