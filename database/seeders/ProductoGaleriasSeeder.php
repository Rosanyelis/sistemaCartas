<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\ProductoGaleria;
use Database\Seeders\Support\ProductoSeederImagenes;
use Illuminate\Database\Seeder;

class ProductoGaleriasSeeder extends Seeder
{
    public function run(): void
    {
        $productos = Producto::query()
            ->orderBy('id')
            ->get(['id', 'slug', 'imagen']);

        foreach ($productos as $index => $producto) {
            $paths = ProductoSeederImagenes::secondaryGalleryPaths($index);

            ProductoGaleria::query()
                ->where('producto_id', $producto->id)
                ->update(['es_principal' => false]);

            foreach ($paths as $path) {
                ProductoGaleria::query()->updateOrCreate(
                    [
                        'producto_id' => $producto->id,
                        'path' => $path,
                    ],
                    [
                        'tipo' => 'imagen',
                        'es_principal' => false,
                    ],
                );
            }

            if (! $producto->imagen && $paths !== []) {
                $producto->update(['imagen' => $paths[0]]);
            }
        }
    }
}
