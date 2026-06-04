<?php

namespace Database\Seeders\Support;

final class HistoriaSeederImagenes
{
    public const string HERO = '/images/cards/hero-image.webp';

    /** @var list<string> */
    public const array MAIN_IMAGE_POOL = [
        '/images/cards/hero-image.webp',
        '/images/cards/carta.png',
        '/images/cards/catalogo.png',
        '/images/cards/catalogo2.png',
        '/images/cards/hero_desk.png',
    ];

    /** @var list<string> */
    public const array CARD_POOL = [
        '/images/cards/cards-1.png',
        '/images/cards/cards-2.png',
        '/images/cards/cards-3.png',
        '/images/cards/cards-4.png',
        '/images/cards/cards-5.png',
        '/images/cards/cards-6.png',
    ];

    public const int GALLERY_COUNT = 5;

    public static function mainImagePathForIndex(int $index): string
    {
        return self::MAIN_IMAGE_POOL[$index % count(self::MAIN_IMAGE_POOL)];
    }

    public static function randomMainImagePath(): string
    {
        return self::MAIN_IMAGE_POOL[array_rand(self::MAIN_IMAGE_POOL)];
    }

    /**
     * 5 rutas de galería rotando sobre el pool de 6 cards.
     *
     * @return list<string>
     */
    public static function secondaryGalleryPaths(int $historiaIndex): array
    {
        $pool = self::CARD_POOL;
        $offset = $historiaIndex % count($pool);
        $paths = [];

        for ($i = 0; $i < self::GALLERY_COUNT; $i++) {
            $paths[] = $pool[($offset + $i) % count($pool)];
        }

        return $paths;
    }
}
