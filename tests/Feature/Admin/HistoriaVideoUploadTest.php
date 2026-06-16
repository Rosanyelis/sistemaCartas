<?php

use App\Models\Historia;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('rechaza video de historia con formato no permitido al crear', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('promo.avi', 2000, 'video/x-msvideo');

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => 'Historia video inválido '.$suffix,
            'descripcion_corta' => 'Resumen breve.',
            'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
            'historia_categoria_id' => historiaCategoriaId('Aventura'),
            'autor' => 'Autor QA',
            'precio_base' => '19.99',
            'codigo' => '#VID-'.$suffix,
            'estado' => 'activo',
            'destacada' => 'no',
            'duracion_meses' => '12',
            'video' => $video,
        ])
        ->assertSessionHasErrors(['video' => 'El video debe ser MP4 o MOV.']);
});

test('acepta video de historia mp4 al crear', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('promo.mp4', 5000, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => 'Historia video ok '.$suffix,
            'descripcion_corta' => 'Resumen breve.',
            'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
            'historia_categoria_id' => historiaCategoriaId('Aventura'),
            'autor' => 'Autor QA',
            'precio_base' => '19.99',
            'codigo' => '#VIDOK-'.$suffix,
            'estado' => 'activo',
            'destacada' => 'no',
            'duracion_meses' => '12',
            'video' => $video,
        ])
        ->assertRedirect(route('admin.historias', absolute: false))
        ->assertSessionHasNoErrors();

    $historia = Historia::query()->where('codigo', '#VIDOK-'.$suffix)->first();

    expect($historia)->not->toBeNull()
        ->and($historia->video)->toContain('.mp4');

    $relativePath = str_replace('/storage/', '', (string) $historia->video);
    expect(Storage::disk('public')->exists($relativePath))->toBeTrue();
});
