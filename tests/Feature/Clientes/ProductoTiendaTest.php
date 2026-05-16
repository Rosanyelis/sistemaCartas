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
        ->where('filters.categoria_id', null)
        ->where('filters.search', ''));
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
        ->where('filters.categoria_id', $categoria->id)
        ->where('filters.search', ''));
});

test('GET /productos filtra por search en query string', function (): void {
    Producto::factory()->create([
        'nombre' => 'Objeto Marcador Busqueda Unico',
        'estado' => 'activo',
    ]);

    Producto::factory()->create([
        'nombre' => 'Otro articulo generico',
        'estado' => 'activo',
    ]);

    $response = $this->get(route('productos', ['search' => 'Marcador Busqueda']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/productos')
        ->has('products.data', 1)
        ->where('filters.search', 'Marcador Busqueda'));
});

test('GET /productos combina categoria_id y search', function (): void {
    $categoria = ProductoCategoria::factory()->create();
    $otra = ProductoCategoria::factory()->create();

    $sub = ProductoSubcategoria::factory()->for($categoria, 'categoria')->create();
    $subOtra = ProductoSubcategoria::factory()->for($otra, 'categoria')->create();

    Producto::factory()->create([
        'nombre' => 'Objeto token123busqueda',
        'producto_categoria_id' => $categoria->id,
        'producto_subcategoria_id' => $sub->id,
        'estado' => 'activo',
    ]);

    Producto::factory()->create([
        'nombre' => 'Otro mismo cat sin termino',
        'producto_categoria_id' => $categoria->id,
        'producto_subcategoria_id' => $sub->id,
        'estado' => 'activo',
    ]);

    Producto::factory()->create([
        'nombre' => 'Objeto token123busqueda otra linea',
        'producto_categoria_id' => $otra->id,
        'producto_subcategoria_id' => $subOtra->id,
        'estado' => 'activo',
    ]);

    $response = $this->get(route('productos', [
        'categoria_id' => $categoria->id,
        'search' => 'token123busqueda',
    ]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/productos')
        ->has('products.data', 1)
        ->where('filters.categoria_id', $categoria->id)
        ->where('filters.search', 'token123busqueda'));
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
