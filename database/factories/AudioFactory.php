<?php

namespace Database\Factories;

use App\Models\Audio;
use App\Models\Historia;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Audio>
 */
class AudioFactory extends Factory
{
    protected $model = Audio::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titulo = fake()->sentence(3);

        return [
            'historia_id' => Historia::factory(),
            'titulo' => $titulo,
            'slug' => Str::slug($titulo).'-'.fake()->unique()->regexify('[a-z0-9]{6}'),
            'codigo' => '#A'.fake()->unique()->numberBetween(1000, 9999),
            'audio_path' => 'audios/1/sample.mp3',
            'qr_path' => null,
            'duracion_segundos' => fake()->numberBetween(60, 600),
            'tamano_bytes' => fake()->numberBetween(100000, 5000000),
            'mime_type' => 'audio/mpeg',
            'estado' => 'activo',
        ];
    }

    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activo',
        ]);
    }

    public function pausado(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pausado',
        ]);
    }
}
