<?php

use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use App\Services\Admin\DashboardMetricasService;
use App\Support\Demo\DemoStoreOrderFactory;
use Illuminate\Support\Carbon;

function crearOrdenPagadaEnMes(Producto $producto, int $year, int $month, string $paypalId): void
{
    DemoStoreOrderFactory::createPaidProductOrder(
        $producto,
        null,
        Carbon::create($year, $month, 10, 12, 0, 0),
        $paypalId,
        10.00,
    );
}

test('suscripciones por historia cuenta solo suscripciones activas', function (): void {
    $historia = Historia::factory()->create([
        'slug' => 'historia-metricas-dash',
        'estado' => 'activo',
    ]);
    $user = User::factory()->create(['role' => 'cliente']);

    Suscripcion::factory()->for($historia)->for($user)->create(['estado' => 'activa']);
    Suscripcion::factory()->for($historia)->for($user)->inactiva()->create();

    $service = app(DashboardMetricasService::class);
    $top = $service->suscripcionesPorHistoria();

    $found = collect($top)->firstWhere('name', $historia->nombre);
    expect($found)->not->toBeNull()
        ->and($found['value'])->toBe(1);
});

test('to array ejecuta consultas de metricas sin excepcion', function (): void {
    Historia::factory()->create(['estado' => 'activo']);

    $service = app(DashboardMetricasService::class);
    $data = $service->toArray();

    expect($data)->toHaveKeys([
        'clientes_registrados',
        'clientes_nuevos_mes',
        'clientes_crecimiento_porcentaje',
        'suscripciones_del_mes',
        'suscripciones_activas_mes',
        'suscripciones_bajas_mes',
        'ordenes_del_dia',
        'ordenes_completadas_dia',
        'ordenes_rechazadas_dia',
        'historias_activas',
        'productos_activos',
        'ventas_productos_del_mes',
        'ventas_historias_ordenes_del_mes',
        'ventas_suscripciones_del_mes',
        'ventas_del_mes',
        'suscripciones_por_historia',
        'suscripciones_activas_total',
    ]);
});

test('clientes registrados cuenta solo usuarios con rol cliente', function (): void {
    User::factory()->count(3)->create(['role' => 'cliente']);
    User::factory()->create(['role' => 'admin']);

    $service = app(DashboardMetricasService::class);

    expect($service->clientesRegistrados())->toBe(3)
        ->and($service->toArray()['clientes_registrados'])->toBe(3);
});

test('clientes nuevos del mes excluye administradores', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    User::factory()->create([
        'role' => 'cliente',
        'created_at' => now(),
    ]);
    User::factory()->create([
        'role' => 'admin',
        'created_at' => now(),
    ]);

    $service = app(DashboardMetricasService::class);

    expect($service->clientesNuevosMes())->toBe(1);

    Carbon::setTestNow();
});

test('ventas chart devuelve siete puntos para semana', function (): void {
    $service = app(DashboardMetricasService::class);

    expect($service->ventasChart('semana'))->toHaveCount(7);
});

test('ventas chart mes sin datos en el año devuelve arreglo vacio', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');

    expect($chart)->toBe([]);

    Carbon::setTestNow();
});

test('ventas chart mes con datos solo en mayo extiende hasta diciembre con ceros', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-un-mes',
        'estado' => 'activo',
    ]);

    crearOrdenPagadaEnMes($producto, 2026, 5, 'PAYPAL-CHART-UN-MES');

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');
    $nombres = collect($chart)->pluck('name')->all();

    expect($nombres)->toBe(['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'])
        ->and(collect($chart)->firstWhere('name', 'May')['productos'])->toBe(10.0)
        ->and(collect($chart)->firstWhere('name', 'Jun')['productos'])->toBe(0.0);

    Carbon::setTestNow();
});

test('ventas chart mes con datos de marzo a mayo incluye abril en cero', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-mar-may',
        'estado' => 'activo',
    ]);

    foreach ([3, 5] as $month) {
        crearOrdenPagadaEnMes($producto, 2026, $month, 'PAYPAL-CHART-'.$month);
    }

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');

    $nombres = collect($chart)->pluck('name')->all();

    expect($nombres)->toHaveCount(10)
        ->and($nombres[0])->toBe('Mar')
        ->and($nombres[9])->toBe('Dic')
        ->and(collect($chart)->firstWhere('name', 'Abr')['productos'])->toBe(0.0);

    Carbon::setTestNow();
});

test('ventas chart mes con datos de marzo a diciembre recorre hasta diciembre', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-12-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-mar-dic',
        'estado' => 'activo',
    ]);

    foreach ([3, 12] as $month) {
        crearOrdenPagadaEnMes($producto, 2026, $month, 'PAYPAL-CHART-MD-'.$month);
    }

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');
    $nombres = collect($chart)->pluck('name')->all();

    expect($nombres)->toHaveCount(10)
        ->and($nombres[0])->toBe('Mar')
        ->and($nombres[9])->toBe('Dic');

    Carbon::setTestNow();
});

test('ventas chart mes con datos de mayo a agosto extiende hasta diciembre', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-12-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-may-ago',
        'estado' => 'activo',
    ]);

    foreach ([5, 8] as $month) {
        crearOrdenPagadaEnMes($producto, 2026, $month, 'PAYPAL-CHART-MA-'.$month);
    }

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');
    $nombres = collect($chart)->pluck('name')->all();

    expect($nombres)->toBe(['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'])
        ->and(collect($chart)->firstWhere('name', 'Sep')['productos'])->toBe(0.0);

    Carbon::setTestNow();
});

test('ventas chart con rango de fechas solo incluye meses con datos dentro del rango', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-06-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-rango',
        'estado' => 'activo',
    ]);

    foreach ([2, 4] as $month) {
        crearOrdenPagadaEnMes($producto, 2026, $month, 'PAYPAL-CHART-RANGO-'.$month);
    }

    $desde = Carbon::parse('2026-01-01')->startOfDay();
    $hasta = Carbon::parse('2026-06-30')->endOfDay();

    $chart = app(DashboardMetricasService::class)->ventasChart('mes', $desde, $hasta);

    expect(collect($chart)->pluck('name')->all())->toBe([
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
    ]);

    Carbon::setTestNow();
});

test('clientes crecimiento porcentaje es nuevos sobre total registrados', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    User::factory()->count(3)->create([
        'role' => 'cliente',
        'created_at' => Carbon::parse('2025-01-10'),
    ]);
    User::factory()->create([
        'role' => 'cliente',
        'created_at' => now(),
    ]);

    expect(app(DashboardMetricasService::class)->clientesCrecimientoPorcentaje())->toBe(25.0);

    Carbon::setTestNow();
});

test('ventas chart semana usa etiquetas de dia en español', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-21 12:00:00'));

    $chart = app(DashboardMetricasService::class)->ventasChart('semana');
    $nombres = collect($chart)->pluck('name')->all();

    expect($nombres)->toHaveCount(7)
        ->and($nombres)->toContain('Jue')
        ->and(array_diff($nombres, ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']))->toBe([]);

    Carbon::setTestNow();
});

test('ventas del mes usa line_total neto y no el total con iva', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-ventas-netas',
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'paypal_order_id' => 'PAYPAL-ORDER-VENTAS-NETAS',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'USD',
        'total' => 14.50,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 1,
        'unit_price' => 12.50,
        'line_total' => 12.50,
    ]);

    $service = app(DashboardMetricasService::class);

    expect($service->ventasProductosDelMes())->toBe(12.50)
        ->and($service->ventasDelMes())->toBe(12.50);

    Carbon::setTestNow();
});

test('ventas del mes suma cobros de suscripcion del mes en neto', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $historia = Historia::factory()->create([
        'slug' => 'historia-ventas-netas',
        'estado' => 'activo',
        'precio_suscripcion' => 12.50,
    ]);
    $user = User::factory()->create(['role' => 'cliente']);
    $suscripcion = Suscripcion::factory()
        ->for($historia)
        ->for($user)
        ->activa()
        ->create();

    PasarelaEvento::query()->create([
        'suscripcion_id' => $suscripcion->id,
        'paypal_event_id' => 'evt-sale-1',
        'event_type' => 'PAYMENT.SALE.COMPLETED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'payload' => [],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $service = app(DashboardMetricasService::class);

    expect($service->ventasSuscripcionesDelMes())->toBe(12.50)
        ->and($service->ventasDelMes())->toBe(12.50);

    Carbon::setTestNow();
});

test('ventas del mes incluye suscripcion activa del mes sin evento de pasarela', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $historia = Historia::factory()->create([
        'slug' => 'historia-ventas-fallback',
        'estado' => 'activo',
        'precio_suscripcion' => 15.00,
    ]);
    $user = User::factory()->create(['role' => 'cliente']);

    Suscripcion::factory()
        ->for($historia)
        ->for($user)
        ->activa()
        ->create([
            'created_at' => now(),
            'updated_at' => now(),
        ]);

    $service = app(DashboardMetricasService::class);

    expect($service->ventasSuscripcionesDelMes())->toBe(15.00)
        ->and($service->ventasDelMes())->toBe(15.00);

    Carbon::setTestNow();
});

test('ventas chart mes refleja suscripciones de historias en el bucket del mes', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $historia = Historia::factory()->create([
        'slug' => 'historia-chart-mes',
        'estado' => 'activo',
        'precio_suscripcion' => 20.00,
    ]);
    $user = User::factory()->create(['role' => 'cliente']);
    $suscripcion = Suscripcion::factory()
        ->for($historia)
        ->for($user)
        ->activa()
        ->create();

    PasarelaEvento::query()->create([
        'suscripcion_id' => $suscripcion->id,
        'paypal_event_id' => 'evt-chart-mes-1',
        'event_type' => 'PAYMENT.SALE.COMPLETED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'payload' => [],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $service = app(DashboardMetricasService::class);
    $chart = $service->ventasChart('mes');
    $mayo = collect($chart)->firstWhere('name', 'May');

    expect($mayo)->not->toBeNull()
        ->and($mayo['historias'])->toBe(20.00);

    Carbon::setTestNow();
});

test('ventas chart mes suma suscripciones y compras de historias en serie historias', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $historia = Historia::factory()->create([
        'slug' => 'historia-chart-combo',
        'estado' => 'activo',
        'precio_suscripcion' => 10.00,
    ]);
    $user = User::factory()->create(['role' => 'cliente']);
    $suscripcion = Suscripcion::factory()
        ->for($historia)
        ->for($user)
        ->activa()
        ->create();

    PasarelaEvento::query()->create([
        'suscripcion_id' => $suscripcion->id,
        'paypal_event_id' => 'evt-chart-combo-sub',
        'event_type' => 'PAYMENT.SALE.COMPLETED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'payload' => [],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $order = StoreOrder::query()->create([
        'paypal_order_id' => 'PAYPAL-ORDER-CHART-HISTORIA',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'USD',
        'total' => 15.00,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $historia->slug,
        'product_name' => $historia->nombre,
        'quantity' => 1,
        'unit_price' => 15.00,
        'line_total' => 15.00,
    ]);

    $chart = app(DashboardMetricasService::class)->ventasChart('mes');
    $mayo = collect($chart)->firstWhere('name', 'May');

    expect($mayo)->not->toBeNull()
        ->and($mayo['historias'])->toBe(25.00);

    Carbon::setTestNow();
});

test('ventas chart mes deja historias en cero con solo compra de producto', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $producto = Producto::factory()->create([
        'slug' => 'producto-chart-solo',
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'paypal_order_id' => 'PAYPAL-ORDER-CHART-SOLO',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'USD',
        'total' => 25.00,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 1,
        'unit_price' => 25.00,
        'line_total' => 25.00,
    ]);

    $service = app(DashboardMetricasService::class);
    $chart = $service->ventasChart('mes');
    $mayo = collect($chart)->firstWhere('name', 'May');

    expect($mayo)->not->toBeNull()
        ->and($mayo['historias'])->toBe(0.0)
        ->and($mayo['productos'])->toBe(25.00);

    Carbon::setTestNow();
});

test('ventas del mes no duplica activacion y cobro de suscripcion en el mismo mes', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-15 12:00:00'));

    $historia = Historia::factory()->create([
        'slug' => 'historia-ventas-dedup',
        'estado' => 'activo',
        'precio_suscripcion' => 10.00,
    ]);
    $user = User::factory()->create(['role' => 'cliente']);
    $suscripcion = Suscripcion::factory()
        ->for($historia)
        ->for($user)
        ->activa()
        ->create();

    PasarelaEvento::query()->create([
        'suscripcion_id' => $suscripcion->id,
        'paypal_event_id' => 'evt-activated-1',
        'event_type' => 'BILLING.SUBSCRIPTION.ACTIVATED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'payload' => [],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    PasarelaEvento::query()->create([
        'suscripcion_id' => $suscripcion->id,
        'paypal_event_id' => 'evt-sale-2',
        'event_type' => 'PAYMENT.SALE.COMPLETED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'payload' => [],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $service = app(DashboardMetricasService::class);

    expect($service->ventasSuscripcionesDelMes())->toBe(10.00);

    Carbon::setTestNow();
});
