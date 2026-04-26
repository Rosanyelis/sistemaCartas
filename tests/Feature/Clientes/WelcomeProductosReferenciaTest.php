<?php

use Inertia\Testing\AssertableInertia as Assert;

test('la página de inicio envía tres productos de referencia con slug para la ficha', function (): void {
    $this->get(route('home'))->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('user/welcome')
        ->has('products', 3)
        ->has('products.0', fn (Assert $p) => $p
            ->where('slug', 'sello-lacre-artesanal')
            ->has('name')
            ->has('unit_price')
            ->etc()));
});
