<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\ProductoGaleria;
use Illuminate\Database\Seeder;

class ProductoGaleriasSeeder extends Seeder
{
    public function run(): void
    {
        $productos = Producto::query()
            ->orderBy('id')
            ->get(['id', 'slug', 'imagen']);

        foreach ($productos as $producto) {
            $paths = $this->galleryForProducto($producto->slug, (int) $producto->id);

            ProductoGaleria::query()
                ->where('producto_id', $producto->id)
                ->update(['es_principal' => false]);

            foreach ($paths as $index => $path) {
                ProductoGaleria::query()->updateOrCreate(
                    [
                        'producto_id' => $producto->id,
                        'path' => $path,
                    ],
                    [
                        'tipo' => 'imagen',
                        'es_principal' => $index === 0,
                    ],
                );
            }

            if (! $producto->imagen && $paths !== []) {
                $producto->update(['imagen' => $paths[0]]);
            }
        }
    }

    /**
     * @return list<string>
     */
    private function galleryForProducto(string $slug, int $id): array
    {
        $seed = trim($slug) !== '' ? $slug : 'producto-'.$id;

        return [
            "https://picsum.photos/seed/{$seed}-1/900/900",
            "https://picsum.photos/seed/{$seed}-2/900/900",
            "https://picsum.photos/seed/{$seed}-3/900/900",
        ];
    }
}
