<?php

use App\Models\User;
use App\Services\Media\HistoriaVideoStorageService;
use Illuminate\Http\UploadedFile;
use Symfony\Component\Process\Process;

test('rechaza video de historia mayor a 10 MB al crear', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('promo.mp4', 11000, 'video/mp4');

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
        ->assertSessionHasErrors(['video' => 'El video no puede superar 10 MB.']);
});

test('acepta video de historia de hasta 10 MB al crear', function (): void {
    $ffmpeg = new Process([(string) config('media.video.ffmpeg_binaries', 'ffmpeg'), '-version']);
    $ffmpeg->run();

    if (! $ffmpeg->isSuccessful()) {
        $this->markTestSkipped('FFmpeg no disponible.');
    }

    $this->mock(HistoriaVideoStorageService::class, function ($mock): void {
        $mock->shouldReceive('store')
            ->once()
            ->andReturn('/storage/historias/videos/demo.mp4');
    });

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
});
