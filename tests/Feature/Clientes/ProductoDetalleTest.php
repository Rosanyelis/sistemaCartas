<?php

use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

test('GET /productos/{slug} con producto activo devuelve ficha y props esperadas', function (): void {
    Producto::factory()->create([
        'slug' => 'objeto-ficha-test',
        'nombre' => 'Objeto de prueba',
        'estado' => 'activo',
    ]);

    $response = $this->get(route('productos.show', ['slug' => 'objeto-ficha-test']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/detalles-producto')
        ->has('product', fn (Assert $p) => $p
            ->where('slug', 'objeto-ficha-test')
            ->where('name', 'Objeto de prueba')
            ->has('subtitle')
            ->has('description')
            ->has('description_is_html')
            ->has('unit_price')
            ->has('category')
            ->has('images')
            ->has('included')
            ->etc()));
});

test('slug inexistente o producto pausado devuelve 404', function (): void {
    $this->get(route('productos.show', ['slug' => 'no-existe']))
        ->assertNotFound();

    Producto::factory()->pausado()->create([
        'slug' => 'solo-pausado',
    ]);

    $this->get(route('productos.show', ['slug' => 'solo-pausado']))
        ->assertNotFound();
});
