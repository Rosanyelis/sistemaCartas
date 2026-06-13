<?php

use App\Models\Historia;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('subir imagen de historia la guarda como webp', function (): void {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $imagen = UploadedFile::fake()->image('portada.jpg', 800, 600);

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => 'Historia webp '.$suffix,
            'descripcion_corta' => 'Resumen breve.',
            'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
            'historia_categoria_id' => historiaCategoriaId('Aventura'),
            'autor' => 'Autor QA',
            'precio_base' => '19.99',
            'codigo' => '#WEBP-'.$suffix,
            'estado' => 'activo',
            'destacada' => 'no',
            'duracion_meses' => '12',
            'imagen' => $imagen,
        ])
        ->assertRedirect(route('admin.historias', absolute: false))
        ->assertSessionHasNoErrors();

    $historia = Historia::query()->where('codigo', '#WEBP-'.$suffix)->first();

    expect($historia)->not->toBeNull();
    expect($historia->imagen)->toContain('.webp');

    $relative = str_replace('/storage/', '', (string) $historia->imagen);
    Storage::disk('public')->assertExists($relative);
    expect(str_ends_with($relative, '.webp'))->toBeTrue();
});
