<?php

namespace Database\Factories;

use App\Models\Historia;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Historia>
 */
class HistoriaFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nombre = fake()->unique()->sentence(3);

        return [
            'nombre' => $nombre,
            'slug' => Str::slug($nombre),
            'codigo' => '#'.fake()->unique()->numberBetween(1000, 9999),
            'imagen' => 'https://picsum.photos/seed/'.fake()->word().'/200/200',
            'descripcion_corta' => fake()->sentence(),
            'descripcion_larga' => fake()->paragraphs(2, true),
            'detalle' => fake()->paragraph(),
            'categoria' => fake()->randomElement(['Aventura', 'Romance', 'Misterio', 'Ficción', 'Infantil']),
            'autor' => fake()->name(),
            'precio_base' => fake()->randomFloat(2, 50, 500),
            'precio_promocional' => fake()->optional(0.5)->randomFloat(2, 30, 400),
            'impuesto' => 16.00,
            'peso' => fake()->randomFloat(1, 0.1, 2).'kg',
            'dimensiones' => fake()->numberBetween(10, 30).'x'.fake()->numberBetween(10, 30).'x'.fake()->numberBetween(1, 5),
            'estado' => 'activo',
            'fecha_publicacion' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    /**
     * Estado activo.
     */
    public function activo(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activo',
        ]);
    }

    /**
     * Estado pausado.
     */
    public function pausado(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pausado',
        ]);
    }
}
