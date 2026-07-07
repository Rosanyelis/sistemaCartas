<?php

use App\Models\Producto;
use Inertia\Testing\AssertableInertia as Assert;

test('producto con precio_promocional en cero no expone old_price en la ficha pública', function (): void {
    Producto::factory()->create([
        'slug' => 'objeto-promo-cero',
        'nombre' => 'Objeto promo cero',
        'estado' => 'activo',
        'precio_base' => 25.00,
        'precio_promocional' => 0.00,
    ]);

    $this->get(route('productos.show', ['slug' => 'objeto-promo-cero']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/detalles-producto')
            ->where('product.slug', 'objeto-promo-cero')
            ->where('product.unit_price', 25)
            ->where('product.old_price', null));
});

test('producto con precio_promocional positivo expone old_price con el precio_base tachado', function (): void {
    Producto::factory()->create([
        'slug' => 'objeto-promo-positiva',
        'nombre' => 'Objeto promo positiva',
        'estado' => 'activo',
        'precio_base' => 30.00,
        'precio_promocional' => 22.50,
    ]);

    $this->get(route('productos.show', ['slug' => 'objeto-promo-positiva']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/detalles-producto')
            ->where('product.slug', 'objeto-promo-positiva')
            ->where('product.unit_price', 22.5)
            ->where('product.old_price', 30));
});

test('producto sin precio_promocional mantiene old_price en null y precio_base visible', function (): void {
    Producto::factory()->create([
        'slug' => 'objeto-sin-promo',
        'nombre' => 'Objeto sin promo',
        'estado' => 'activo',
        'precio_base' => 15.00,
        'precio_promocional' => null,
    ]);

    $this->get(route('productos.show', ['slug' => 'objeto-sin-promo']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('product.slug', 'objeto-sin-promo')
            ->where('product.unit_price', 15)
            ->where('product.old_price', null));
});
