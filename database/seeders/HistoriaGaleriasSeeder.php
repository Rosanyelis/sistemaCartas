<?php

namespace Database\Seeders;

use App\Models\Historia;
use App\Models\HistoriaGaleria;
use Database\Seeders\Support\HistoriaSeederImagenes;
use Illuminate\Database\Seeder;

class HistoriaGaleriasSeeder extends Seeder
{
    public function run(): void
    {
        $historias = Historia::query()
            ->orderBy('id')
            ->get(['id', 'slug', 'imagen']);

        foreach ($historias as $index => $historia) {
            $paths = HistoriaSeederImagenes::secondaryGalleryPaths($index);

            HistoriaGaleria::query()
                ->where('historia_id', $historia->id)
                ->update(['es_principal' => false]);

            foreach ($paths as $path) {
                HistoriaGaleria::query()->updateOrCreate(
                    [
                        'historia_id' => $historia->id,
                        'path' => $path,
                    ],
                    [
                        'tipo' => 'imagen',
                        'es_principal' => false,
                    ],
                );
            }

            if (! $historia->imagen && $paths !== []) {
                $historia->update(['imagen' => $paths[0]]);
            }
        }
    }
}
