<?php

use Inertia\Testing\AssertableInertia as Assert;

test('la ficha de producto responde ok con props de catálogo', function (): void {
    $response = $this->get(route('productos.show', ['slug' => 'kit-lacre-real']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/detalles-producto')
        ->where('referenceDemo', false)
        ->has('product', fn (Assert $p) => $p
            ->where('slug', 'kit-lacre-real')
            ->where('name', 'Kit de Lacre Real')
            ->etc()));
});

test('la ruta de ejemplo muestra ficha con datos de referencia', function (): void {
    $response = $this->get(route('productos.ejemplo'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/detalles-producto')
        ->where('referenceDemo', true)
        ->has('product', fn (Assert $p) => $p
            ->where('slug', 'kit-lacre-real')
            ->where('name', 'Kit de Lacre Real')
            ->etc()));
});

test('slug de producto inexistente devuelve 404', function (): void {
    $this->get(route('productos.show', ['slug' => 'no-existe']))
        ->assertNotFound();
});
