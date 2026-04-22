<?php

namespace Database\Factories;

use App\Models\Entrega;
use App\Models\Historia;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Entrega>
 */
class EntregaFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'historia_id' => Historia::factory(),
            'numero_entrega' => fake()->unique()->numberBetween(1, 100),
            'titulo' => fake()->sentence(4),
            'contenido' => fake()->paragraphs(3, true),
            'archivo' => null,
            'estado' => fake()->randomElement(['pendiente', 'enviado', 'entregado']),
            'fecha_envio' => fake()->optional(0.6)->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
