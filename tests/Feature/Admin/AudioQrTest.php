<?php

use App\Models\Audio;
use App\Models\Historia;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('local');
    Storage::fake('public');
});

test('al crear audio se genera qr png', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();

    $this->actingAs($admin)->post(route('admin.audios.store'), [
        'historia_id' => $historia->id,
        'titulo' => 'Audio QR',
        'estado' => 'activo',
        'audio' => UploadedFile::fake()->create('qr-test.mp3', 80, 'audio/mpeg'),
    ]);

    $audio = Audio::query()->where('titulo', 'Audio QR')->first();
    expect($audio)->not->toBeNull();
    expect($audio->qr_path)->toStartWith('/storage/qr/audios/');

    $relative = str_replace('/storage/', '', (string) $audio->qr_path);
    Storage::disk('public')->assertExists($relative);
});

test('admin puede descargar qr como png', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->activo()->create();

    $this->actingAs($admin)->post(route('admin.audios.store'), [
        'historia_id' => $historia->id,
        'titulo' => 'Descarga QR',
        'estado' => 'activo',
        'audio' => UploadedFile::fake()->create('dl.mp3', 80, 'audio/mpeg'),
    ]);

    $audio = Audio::query()->where('titulo', 'Descarga QR')->firstOrFail();

    $response = $this->actingAs($admin)->get(route('admin.audios.qr', $audio));

    $response->assertOk();
    $response->assertHeader('content-type', 'image/png');
});
