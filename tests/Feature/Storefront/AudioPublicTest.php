<?php

use App\Models\Audio;
use App\Models\Historia;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    Storage::fake('local');
    Storage::fake('public');
});

test('página pública de audio activo responde 200', function (): void {
    $historia = Historia::factory()->activo()->create([
        'nombre' => 'Historia pública',
        'slug' => 'historia-publica-audio',
        'descripcion_corta' => 'Resumen de la historia',
        'imagen' => '/images/story_cover.png',
    ]);
    $audio = Audio::factory()->for($historia)->activo()->create([
        'titulo' => 'Audio público',
        'audio_path' => 'audios/1/test.mp3',
        'mime_type' => 'audio/mpeg',
    ]);
    Storage::disk('local')->put($audio->audio_path, str_repeat('x', 1024));

    $this->get(route('audios.show', $audio))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/audio-publico')
            ->where('audio.titulo', 'Audio público')
            ->where('audio.historia.nombre', 'Historia pública')
            ->where('audio.historia.slug', 'historia-publica-audio')
            ->where('audio.historia.show_url', route('historias.show', 'historia-publica-audio')));
});

test('audio pausado devuelve 404 en página pública', function (): void {
    $historia = Historia::factory()->activo()->create();
    $audio = Audio::factory()->for($historia)->pausado()->create();

    $this->get(route('audios.show', $audio))->assertNotFound();
});

test('stream devuelve audio inline sin exponer storage público', function (): void {
    $historia = Historia::factory()->activo()->create();
    $audio = Audio::factory()->for($historia)->activo()->create([
        'audio_path' => 'audios/2/stream.mp3',
        'mime_type' => 'audio/mpeg',
        'tamano_bytes' => 512,
    ]);
    Storage::disk('local')->put($audio->audio_path, str_repeat('a', 512));

    $response = $this->get(route('audios.stream', $audio));

    $response->assertOk();
    expect($response->headers->get('Content-Disposition'))->toContain('inline');
    expect($response->headers->get('Content-Type'))->toBe('audio/mpeg');
});

test('audio pausado devuelve 404 en stream', function (): void {
    $historia = Historia::factory()->activo()->create();
    $audio = Audio::factory()->for($historia)->pausado()->create([
        'audio_path' => 'audios/3/pausado.mp3',
    ]);
    Storage::disk('local')->put($audio->audio_path, 'data');

    $this->get(route('audios.stream', $audio))->assertNotFound();
});
