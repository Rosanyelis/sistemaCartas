<?php

use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

test('la página de inicio envía hasta tres productos solo si están activos', function (): void {
    Producto::factory()->pausado()->create(['nombre' => 'No visible en home']);

    Producto::factory()->create([
        'nombre' => 'Visible en home A',
        'estado' => 'activo',
    ]);
    Producto::factory()->create([
        'nombre' => 'Visible en home B',
        'estado' => 'activo',
    ]);

    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('user/welcome')
        ->has('products', 2)
        ->has('products.0', fn (Assert $p) => $p
            ->has('slug')
            ->has('name')
            ->has('unit_price')
            ->has('price')
            ->etc()));
});

test('la página de inicio limita a tres productos activos', function (): void {
    Producto::factory()->count(5)->create(['estado' => 'activo']);

    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('user/welcome')
        ->has('products', 3));
});
