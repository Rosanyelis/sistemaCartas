<?php

use Database\Seeders\HistoriaCategoriasSeeder;
use Illuminate\Support\Facades\Artisan;

test('HistoriaCategoriasSeeder crea categorías de ejemplo', function (): void {
    Artisan::call('db:seed', ['--class' => HistoriaCategoriasSeeder::class]);

    foreach (HistoriaCategoriasSeeder::nombresDeEjemplo() as $nombre) {
        $this->assertDatabaseHas('historia_categorias', ['nombre' => $nombre]);
    }

    $this->assertDatabaseHas('historia_categorias', ['nombre' => 'Sin categoría']);
});
