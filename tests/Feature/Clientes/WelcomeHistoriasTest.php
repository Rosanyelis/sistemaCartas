<?php

use App\Models\Historia;
use Inertia\Testing\AssertableInertia as Assert;

test('GET / incluye historias activas destacadas en stories', function (): void {
    Historia::factory()->create([
        'estado' => 'activo',
        'destacada' => 'si',
        'nombre' => 'Historia portada',
        'slug' => 'historia-portada-home',
        'imagen' => 'https://example.test/cover.jpg',
    ]);

    Historia::factory()->pausado()->create([
        'destacada' => 'si',
        'nombre' => 'No visible',
    ]);

    Historia::factory()->create([
        'estado' => 'activo',
        'destacada' => 'no',
        'nombre' => 'Sin destacar',
    ]);

    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('user/welcome')
        ->has('stories', 1)
        ->has('stories.0', fn (Assert $s) => $s
            ->where('slug', 'historia-portada-home')
            ->where('title', 'Historia portada')
            ->where('img', 'https://example.test/cover.jpg')
            ->has('price')
            ->etc()));
});

test('GET / devuelve stories vacío si no hay destacadas activas', function (): void {
    Historia::factory()->create([
        'estado' => 'activo',
        'destacada' => 'no',
    ]);

    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('user/welcome')
        ->has('stories', 0));
});
