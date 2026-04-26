<?php

namespace Database\Factories;

use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductoSubcategoria>
 */
class ProductoSubcategoriaFactory extends Factory
{
    protected $model = ProductoSubcategoria::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'producto_categoria_id' => ProductoCategoria::factory(),
            'nombre' => fake()->words(2, true),
        ];
    }
}
