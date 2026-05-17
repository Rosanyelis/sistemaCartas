<?php

namespace Database\Seeders;

use App\Models\HistoriaCategoria;
use Illuminate\Database\Seeder;

class HistoriaCategoriasSeeder extends Seeder
{
    /**
     * @return list<string>
     */
    public static function nombresDeEjemplo(): array
    {
        return [
            'Aventura',
            'Misterio',
            'Romance',
            'Infantil',
            'Ficción',
        ];
    }

    public function run(): void
    {
        HistoriaCategoria::query()->firstOrCreate(['nombre' => 'Sin categoría']);

        foreach (self::nombresDeEjemplo() as $nombre) {
            HistoriaCategoria::query()->firstOrCreate(['nombre' => $nombre]);
        }
    }
}
