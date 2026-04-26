<?php

use App\Enums\HistoriaVarianteTipo;
use App\Models\Historia;
use App\Models\HistoriaVariante;
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

test('la ficha pública incluye variantes serializadas', function (): void {
    $historia = Historia::factory()->create([
        'slug' => 'historia-con-variantes',
        'estado' => 'activo',
    ]);

    HistoriaVariante::query()->create([
        'historia_id' => $historia->id,
        'tipo' => HistoriaVarianteTipo::Papel,
        'valor' => 'A5',
    ]);

    $this->get(route('historias.show', 'historia-con-variantes'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('historia.variantes.0.tipo', 'papel')
            ->where('historia.variantes.0.valor', 'A5'));
});

test('la ficha pública expone vídeo e imagen principal para poster del reproductor', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-video-con-poster',
        'estado' => 'activo',
        'video' => 'https://example.com/promo.mp4',
        'imagen' => 'https://example.com/portada.jpg',
    ]);

    $this->get(route('historias.show', 'historia-video-con-poster'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('historia.video', 'https://example.com/promo.mp4')
            ->where('historia.imagen', 'https://example.com/portada.jpg'));
});

test('la ficha pública expone vídeo sin imagen principal como null', function (): void {
    Historia::factory()->create([
        'slug' => 'historia-video-sin-poster',
        'estado' => 'activo',
        'video' => 'https://example.com/solo-video.mp4',
        'imagen' => null,
    ]);

    $this->get(route('historias.show', 'historia-video-sin-poster'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('historia.video', 'https://example.com/solo-video.mp4')
            ->where('historia.imagen', null));
});
