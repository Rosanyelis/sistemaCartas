<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('listados admin vacíos devuelven metadatos de paginación estándar', function (string $routeName, string $component, string $prop): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component($component)
            ->has($prop)
            ->where("{$prop}.data", [])
            ->where("{$prop}.total", 0)
            ->where("{$prop}.current_page", 1)
            ->where("{$prop}.last_page", 1)
            ->where("{$prop}.from", null)
            ->where("{$prop}.to", null)
        );
})->with([
    ['admin.productos', 'admin/products', 'productos'],
    ['admin.clientes', 'admin/clients', 'clientes'],
    ['admin.historias', 'admin/stories', 'historias'],
    ['admin.ordenes', 'admin/orders', 'ordenes'],
    ['admin.suscripciones', 'admin/subscriptions', 'suscripciones'],
]);
