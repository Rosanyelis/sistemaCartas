<?php

namespace Database\Factories;

use App\Models\ProductoCategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductoCategoria>
 */
class ProductoCategoriaFactory extends Factory
{
    protected $model = ProductoCategoria::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->unique()->words(2, true),
        ];
    }
}
