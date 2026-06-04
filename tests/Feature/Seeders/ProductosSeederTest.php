<?php

use App\Models\Producto;
use Database\Seeders\ProductoGaleriasSeeder;
use Database\Seeders\ProductosSeeder;
use Database\Seeders\Support\ProductoSeederImagenes;

test('ProductosSeeder usa imagenes locales y galeria product-N', function (): void {
    $this->seed(ProductosSeeder::class);
    $this->seed(ProductoGaleriasSeeder::class);

    $producto = Producto::query()->orderBy('id')->first();

    expect($producto)->not->toBeNull();
    expect($producto->imagen)->toStartWith('/images/products/');
    expect($producto->galeria)->toHaveCount(5);
    expect($producto->galeria->pluck('path')->all())
        ->each->toMatch('/^\/images\/products\/product-\d\.png$/');
});

test('ProductoSeederImagenes rota galería según índice de producto', function (): void {
    expect(ProductoSeederImagenes::secondaryGalleryPaths(0))->toBe([
        '/images/products/product-1.png',
        '/images/products/product-2.png',
        '/images/products/product-3.png',
        '/images/products/product-4.png',
        '/images/products/product-5.png',
    ]);

    expect(ProductoSeederImagenes::secondaryGalleryPaths(1))->toBe([
        '/images/products/product-2.png',
        '/images/products/product-3.png',
        '/images/products/product-4.png',
        '/images/products/product-5.png',
        '/images/products/product-6.png',
    ]);
});

test('ProductoSeederImagenes mainImagePool incluye imágenes del directorio products', function (): void {
    $pool = ProductoSeederImagenes::mainImagePool();

    expect($pool)->not->toBeEmpty();
    expect($pool)->each->toStartWith('/images/products/');
});
