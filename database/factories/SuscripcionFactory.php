<?php

namespace Database\Factories;

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Suscripcion>
 */
class SuscripcionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fechaAdquisicion = fake()->dateTimeBetween('-6 months', 'now');

        return [
            'user_id' => User::factory(),
            'historia_id' => Historia::factory(),
            'tipo' => fake()->randomElement(['Mensual', 'Trimestral', 'Anual']),
            'cantidad' => fake()->numberBetween(1, 5),
            'fecha_adquisicion' => $fechaAdquisicion,
            'fecha_finalizacion' => fake()->optional(0.3)->dateTimeBetween($fechaAdquisicion, '+1 year'),
            'proximo_cobro' => fake()->dateTimeBetween('now', '+3 months'),
            'estado' => 'activa',
        ];
    }

    /**
     * Estado activa.
     */
    public function activa(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'activa',
        ]);
    }

    /**
     * Estado inactiva.
     */
    public function inactiva(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'inactiva',
        ]);
    }

    /**
     * Estado pendiente.
     */
    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'pendiente',
        ]);
    }
}
