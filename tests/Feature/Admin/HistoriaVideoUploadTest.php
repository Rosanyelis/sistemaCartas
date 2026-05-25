<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;

test('rechaza video de historia mayor a 2 MB al crear', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('promo.mp4', 3000, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => 'Historia video grande '.$suffix,
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
        ->assertSessionHasErrors(['video' => 'El video no puede superar 2 MB.']);
});

test('acepta video de historia de hasta 2 MB al crear', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('promo.mp4', 1500, 'video/mp4');

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
});
