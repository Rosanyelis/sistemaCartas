<?php

use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use App\Services\Admin\DashboardMetricasService;
use Illuminate\Support\Carbon;

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

test('ventas chart devuelve siete puntos para semana y doce para mes', function (): void {
    $service = app(DashboardMetricasService::class);

    expect($service->ventasChart('semana'))->toHaveCount(7)
        ->and($service->ventasChart('mes'))->toHaveCount(12);
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
    $mesActual = collect($chart)->last();

    expect($mesActual)->not->toBeNull()
        ->and($mesActual['historias'])->toBe(20.00);

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
    $mesActual = collect($chart)->last();

    expect($mesActual)->not->toBeNull()
        ->and($mesActual['historias'])->toBe(0.0)
        ->and($mesActual['productos'])->toBe(25.00);

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
