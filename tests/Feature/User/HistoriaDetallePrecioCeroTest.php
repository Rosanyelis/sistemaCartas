<?php

use App\Models\Historia;
use Inertia\Testing\AssertableInertia as Assert;

test('historia con precio_promocional en cero expone precio_promocional como null en la ficha pública', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-promo-cero',
        'estado' => 'activo',
        'precio_base' => 80.00,
        'precio_promocional' => 0.00,
    ]);

    $this->get(route('historias.show', 'historia-promo-cero'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/detalles-historia')
            ->where('historia.slug', 'historia-promo-cero')
            ->where('historia.precio_base', '80.00')
            ->where('historia.precio_promocional', null));
});

test('historia con precio_promocional positivo expone el precio con tachado', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-promo-positiva',
        'estado' => 'activo',
        'precio_base' => 100.00,
        'precio_promocional' => 65.00,
    ]);

    $this->get(route('historias.show', 'historia-promo-positiva'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/detalles-historia')
            ->where('historia.slug', 'historia-promo-positiva')
            ->where('historia.precio_base', '100.00')
            ->where('historia.precio_promocional', '65'));
});

test('historia sin precio_promocional expone null y precio_base como activo', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-sin-promo',
        'estado' => 'activo',
        'precio_base' => 40.00,
        'precio_promocional' => null,
    ]);

    $this->get(route('historias.show', 'historia-sin-promo'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('historia.slug', 'historia-sin-promo')
            ->where('historia.precio_base', '40.00')
            ->where('historia.precio_promocional', null));
});
