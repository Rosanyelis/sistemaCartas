<?php

use App\Models\Audio;
use App\Models\Historia;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    Storage::fake('local');
    Storage::fake('public');
});

test('admin puede crear audio con archivo', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();

    $response = $this->actingAs($admin)->post(route('admin.audios.store'), [
        'historia_id' => $historia->id,
        'titulo' => 'Capítulo uno',
        'codigo' => '#AUD-'.uniqid(),
        'estado' => 'activo',
        'audio' => UploadedFile::fake()->create('capitulo.mp3', 100, 'audio/mpeg'),
    ]);

    $response->assertRedirect(route('admin.audios', absolute: false));
    $response->assertSessionHas('success');

    $audio = Audio::query()->where('titulo', 'Capítulo uno')->first();
    expect($audio)->not->toBeNull();
    expect($audio->historia_id)->toBe($historia->id);
    expect($audio->qr_path)->not->toBeNull();
    Storage::disk('local')->assertExists($audio->audio_path);
});

test('crear audio requiere historia válida', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.audios.store'), [
        'historia_id' => 99999,
        'titulo' => 'Sin historia',
        'estado' => 'activo',
        'audio' => UploadedFile::fake()->create('test.mp3', 50, 'audio/mpeg'),
    ]);

    $response->assertSessionHasErrors(['historia_id']);
});

test('crear audio rechaza mime no permitido', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();

    $response = $this->actingAs($admin)->post(route('admin.audios.store'), [
        'historia_id' => $historia->id,
        'titulo' => 'Audio inválido',
        'estado' => 'activo',
        'audio' => UploadedFile::fake()->create('mal.exe', 50, 'application/octet-stream'),
    ]);

    $response->assertSessionHasErrors(['audio']);
});

test('admin puede listar audios en inertia', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();
    Audio::factory()->for($historia)->create(['titulo' => 'Audio listado QA']);

    $this->actingAs($admin)
        ->get(route('admin.audios'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audios')
            ->has('audios.data', 1)
            ->where('audios.data.0.titulo', 'Audio listado QA'));
});

test('admin puede actualizar y eliminar audio', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();
    $audio = Audio::factory()->for($historia)->create([
        'titulo' => 'Original',
        'audio_path' => 'audios/1/original.mp3',
    ]);
    Storage::disk('local')->put($audio->audio_path, 'audio-content');

    $this->actingAs($admin)
        ->patch(route('admin.audios.update', $audio), [
            'historia_id' => $historia->id,
            'titulo' => 'Actualizado',
            'estado' => 'pausado',
        ])
        ->assertRedirect(route('admin.audios', absolute: false));

    $audio->refresh();
    expect($audio->titulo)->toBe('Actualizado');
    expect($audio->estado)->toBe('pausado');

    $this->actingAs($admin)
        ->delete(route('admin.audios.destroy', $audio))
        ->assertRedirect(route('admin.audios', absolute: false));

    expect(Audio::withTrashed()->find($audio->id)?->trashed())->toBeTrue();
    Storage::disk('local')->assertMissing($audio->audio_path);
});
