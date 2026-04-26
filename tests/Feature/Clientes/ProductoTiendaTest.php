<?php

use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use Inertia\Testing\AssertableInertia as Assert;

test('GET /productos responde 200 con listado paginado y metadatos', function (): void {
    Producto::factory()->count(3)->create();

    $response = $this->get(route('productos'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/productos')
        ->has('products.data', 3)
        ->where('products.per_page', 12)
        ->where('products.current_page', 1)
        ->has('products.links')
        ->has('products.total')
        ->has('categorias')
        ->where('filters.categoria_id', null));
});

test('GET /productos filtra por categoria_id en query string', function (): void {
    $categoria = ProductoCategoria::factory()->create();
    $subcategoria = ProductoSubcategoria::factory()
        ->for($categoria, 'categoria')
        ->create();

    Producto::factory()->create([
        'producto_categoria_id' => $categoria->id,
        'producto_subcategoria_id' => $subcategoria->id,
        'estado' => 'activo',
    ]);

    Producto::factory()->create(['estado' => 'activo']);

    $response = $this->get(route('productos', ['categoria_id' => $categoria->id]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/productos')
        ->has('products.data', 1)
        ->where('filters.categoria_id', $categoria->id));
});

test('GET /productos/ejemplo redirige al primer producto activo', function (): void {
    $producto = Producto::factory()->create([
        'slug' => 'primer-activo-tienda',
        'estado' => 'activo',
    ]);

    $this->get(route('productos.ejemplo'))
        ->assertRedirect(route('productos.show', ['slug' => $producto->slug]));
});

test('GET /productos/ejemplo sin productos activos redirige al listado', function (): void {
    $this->get(route('productos.ejemplo'))
        ->assertRedirect(route('productos'));
});
