<?php

namespace Database\Seeders\Support;

use Illuminate\Support\Facades\File;

final class ProductoSeederImagenes
{
    /** @var list<string> */
    public const array GALLERY_POOL = [
        '/images/products/product-1.png',
        '/images/products/product-2.png',
        '/images/products/product-3.png',
        '/images/products/product-4.png',
        '/images/products/product-5.png',
        '/images/products/product-6.png',
    ];

    public const int GALLERY_COUNT = 5;

    /**
     * Imagen principal aleatoria desde public/images/products.
     * Incluye product-*.png y cualquier otro PNG/WebP/JPG del directorio.
     */
    public static function randomMainImagePath(): string
    {
        $paths = self::mainImagePool();
        if ($paths === []) {
            return '/images/placeholder.svg';
        }

        return $paths[array_rand($paths)];
    }

    /**
     * @return list<string>
     */
    public static function mainImagePool(): array
    {
        $directory = public_path('images/products');
        if (! File::isDirectory($directory)) {
            return self::GALLERY_POOL;
        }

        $extensions = ['png', 'jpg', 'jpeg', 'webp'];

        return collect(File::files($directory))
            ->filter(fn ($file) => in_array(strtolower($file->getExtension()), $extensions, true))
            ->map(fn ($file) => '/images/products/'.$file->getFilename())
            ->values()
            ->all();
    }

    /**
     * 5 rutas de galería rotando sobre product-1 … product-6.
     *
     * @return list<string>
     */
    public static function secondaryGalleryPaths(int $productoIndex): array
    {
        $pool = self::GALLERY_POOL;
        $offset = $productoIndex % count($pool);
        $paths = [];

        for ($i = 0; $i < self::GALLERY_COUNT; $i++) {
            $paths[] = $pool[($offset + $i) % count($pool)];
        }

        return $paths;
    }
}
