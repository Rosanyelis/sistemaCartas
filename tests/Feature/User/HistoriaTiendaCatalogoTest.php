<?php

use App\Models\Historia;
use App\Models\HistoriaCategoria;
use Inertia\Testing\AssertableInertia as Assert;

test('el catálogo de historias devuelve listado paginado y destacadas', function (): void {
    Historia::factory()->count(13)->activo()->create(['destacada' => 'no']);
    $misterioId = HistoriaCategoria::factory()->create(['nombre' => 'Misterio'])->id;
    Historia::factory()->activo()->create([
        'slug' => 'historia-destacada-a',
        'destacada' => 'si',
        'historia_categoria_id' => $misterioId,
    ]);
    Historia::factory()->activo()->create([
        'slug' => 'historia-destacada-b',
        'destacada' => 'si',
        'historia_categoria_id' => $misterioId,
    ]);

    $this->get(route('historias'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/historias')
            ->has('historias.data', 6)
            ->where('historias.total', 15)
            ->has('destacadas', 2)
            ->has('categorias')
            ->where('filters.categoria', 'Todas'));
});

test('el catálogo no incluye historias eliminadas ni pausadas', function (): void {
    Historia::factory()->activo()->create(['slug' => 'solo-activa']);
    Historia::factory()->activo()->create(['slug' => 'borrada'])->delete();
    Historia::factory()->pausado()->create(['slug' => 'pausada']);

    $this->get(route('historias'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('historias.data', 1)
            ->where('historias.data.0.slug', 'solo-activa'));
});

test('filtrar por categoría restringe el listado y las destacadas', function (): void {
    Historia::factory()->activo()->create([
        'slug' => 'aventura-1',
        'historia_categoria_id' => HistoriaCategoria::factory()->create(['nombre' => 'Aventura'])->id,
        'destacada' => 'si',
    ]);
    Historia::factory()->activo()->create([
        'slug' => 'romance-1',
        'historia_categoria_id' => HistoriaCategoria::factory()->create(['nombre' => 'Romance'])->id,
        'destacada' => 'si',
    ]);

    $this->get(route('historias', ['categoria' => 'Aventura']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('historias.data', 1)
            ->where('historias.data.0.slug', 'aventura-1')
            ->has('destacadas', 1)
            ->where('destacadas.0.slug', 'aventura-1')
            ->where('filters.categoria', 'Aventura'));
});

test('búsqueda por nombre filtra el catálogo', function (): void {
    Historia::factory()->activo()->create([
        'nombre' => 'Título único XYZ',
        'slug' => 'slug-busqueda',
    ]);
    Historia::factory()->activo()->create([
        'nombre' => 'Otra historia distinta',
        'slug' => 'slug-otra',
    ]);

    $this->get(route('historias', ['search' => 'XYZ']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('historias.data', 1)
            ->where('historias.data.0.slug', 'slug-busqueda'));
});
