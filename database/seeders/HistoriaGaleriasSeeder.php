<?php

namespace Database\Seeders;

use App\Models\Historia;
use App\Models\HistoriaGaleria;
use Illuminate\Database\Seeder;

class HistoriaGaleriasSeeder extends Seeder
{
    public function run(): void
    {
        $historias = Historia::query()
            ->orderBy('id')
            ->get(['id', 'slug', 'imagen']);

        foreach ($historias as $historia) {
            $paths = $this->galleryForHistoria($historia->slug, (int) $historia->id);

            HistoriaGaleria::query()
                ->where('historia_id', $historia->id)
                ->update(['es_principal' => false]);

            foreach ($paths as $index => $path) {
                HistoriaGaleria::query()->updateOrCreate(
                    [
                        'historia_id' => $historia->id,
                        'path' => $path,
                    ],
                    [
                        'tipo' => 'imagen',
                        'es_principal' => $index === 0,
                    ],
                );
            }

            if (! $historia->imagen && $paths !== []) {
                $historia->update(['imagen' => $paths[0]]);
            }
        }
    }

    /**
     * @return list<string>
     */
    private function galleryForHistoria(string $slug, int $id): array
    {
        $seed = trim($slug) !== '' ? $slug : 'historia-'.$id;

        return [
            "https://picsum.photos/seed/{$seed}-a/900/900",
            "https://picsum.photos/seed/{$seed}-b/900/900",
            "https://picsum.photos/seed/{$seed}-c/900/900",
        ];
    }
}
