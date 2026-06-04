<?php

use App\Models\Historia;
use Database\Seeders\HistoriaCategoriasSeeder;
use Database\Seeders\HistoriaGaleriasSeeder;
use Database\Seeders\HistoriasSeeder;
use Database\Seeders\Support\HistoriaSeederImagenes;

test('HistoriasSeeder usa portadas del pool local y galería de cards', function (): void {
    $this->seed(HistoriaCategoriasSeeder::class);
    $this->seed(HistoriasSeeder::class);
    $this->seed(HistoriaGaleriasSeeder::class);

    $historia = Historia::query()->orderBy('id')->first();

    expect($historia)->not->toBeNull();
    expect($historia->imagen)->toBeIn(HistoriaSeederImagenes::MAIN_IMAGE_POOL);
    expect($historia->galeria)->toHaveCount(5);
    expect($historia->galeria->pluck('path')->all())
        ->each->toStartWith('/images/cards/cards-');
});

test('HistoriasSeeder rota portadas distintas en las cinco historias del catálogo', function (): void {
    $this->seed(HistoriaCategoriasSeeder::class);
    $this->seed(HistoriasSeeder::class);

    $portadas = Historia::query()
        ->orderBy('id')
        ->limit(5)
        ->pluck('imagen')
        ->unique()
        ->values()
        ->all();

    expect($portadas)->toHaveCount(5);
    expect($portadas)->each->toBeIn(HistoriaSeederImagenes::MAIN_IMAGE_POOL);
});

test('HistoriaSeederImagenes rota galería según índice de historia', function (): void {
    expect(HistoriaSeederImagenes::secondaryGalleryPaths(0))->toBe([
        '/images/cards/cards-1.png',
        '/images/cards/cards-2.png',
        '/images/cards/cards-3.png',
        '/images/cards/cards-4.png',
        '/images/cards/cards-5.png',
    ]);

    expect(HistoriaSeederImagenes::secondaryGalleryPaths(1))->toBe([
        '/images/cards/cards-2.png',
        '/images/cards/cards-3.png',
        '/images/cards/cards-4.png',
        '/images/cards/cards-5.png',
        '/images/cards/cards-6.png',
    ]);

    expect(HistoriaSeederImagenes::secondaryGalleryPaths(2))->toBe([
        '/images/cards/cards-3.png',
        '/images/cards/cards-4.png',
        '/images/cards/cards-5.png',
        '/images/cards/cards-6.png',
        '/images/cards/cards-1.png',
    ]);
});

test('HistoriaSeederImagenes rota portadas por índice', function (): void {
    expect(HistoriaSeederImagenes::mainImagePathForIndex(0))->toBe(HistoriaSeederImagenes::HERO);
    expect(HistoriaSeederImagenes::mainImagePathForIndex(4))->toBe('/images/cards/hero_desk.png');
    expect(HistoriaSeederImagenes::mainImagePathForIndex(5))->toBe(HistoriaSeederImagenes::HERO);
});
