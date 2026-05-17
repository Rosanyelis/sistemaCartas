<?php

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use App\Services\Admin\DashboardMetricasService;

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
        'ventas_del_mes',
        'suscripciones_por_historia',
        'suscripciones_activas_total',
    ]);
});

test('clientes registrados cuenta solo usuarios con rol cliente', function (): void {
    User::factory()->count(3)->create(['role' => 'cliente']);
    User::factory()->create(['role' => 'admin']);

    $service = app(DashboardMetricasService::class);

    expect($service->clientesRegistrados())->toBe(3);
});

test('ventas chart devuelve siete puntos para semana y doce para mes', function (): void {
    $service = app(DashboardMetricasService::class);

    expect($service->ventasChart('semana'))->toHaveCount(7)
        ->and($service->ventasChart('mes'))->toHaveCount(12);
});
