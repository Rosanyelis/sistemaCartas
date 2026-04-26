<?php

use App\Models\Historia;
use Inertia\Testing\AssertableInertia as Assert;

test('la ficha pública de historia resuelve por slug y expone detalle como array', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-demo-publica',
        'estado' => 'activo',
        'detalle' => [
            ['icon' => 'FileText', 'title' => 'La carta', 'description' => 'Texto secundario.'],
            ['icon' => 'Gift', 'title' => 'Regalo sorpresa'],
        ],
    ]);

    $this->get(route('historias.show', 'historia-demo-publica'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/detalles-historia')
            ->where('historia.slug', 'historia-demo-publica')
            ->where('historia.detalle.0.icon', 'FileText')
            ->where('historia.detalle.0.title', 'La carta')
            ->where('historia.detalle.0.description', 'Texto secundario.')
            ->where('historia.detalle.1.icon', 'Gift')
            ->where('historia.detalle.1.title', 'Regalo sorpresa'));
});

test('historia pausada no es visible en la ficha pública', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-pausada',
        'estado' => 'pausado',
    ]);

    $this->get(route('historias.show', 'historia-pausada'))
        ->assertNotFound();
});

test('slug inexistente en ficha pública devuelve 404', function (): void {
    $this->get(route('historias.show', 'no-existe-'.uniqid('', true)))
        ->assertNotFound();
});
