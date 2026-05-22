<?php

use App\Models\Historia;
use App\Models\HistoriaGaleria;
use App\Models\Producto;
use App\Models\ProductoGaleria;
use App\Models\User;
use Illuminate\Http\UploadedFile;

function fakeGaleriaJpeg(int $index): UploadedFile
{
    return UploadedFile::fake()->image("galeria-{$index}.jpg", 80, 80)->size(100);
}

/**
 * @return array<string, mixed>
 */
function historiasStoreBasePayload(): array
{
    $suffix = uniqid('', true);

    return [
        'nombre' => 'Historia galería '.$suffix,
        'descripcion_corta' => 'Resumen breve.',
        'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
        'detalle' => '',
        'historia_categoria_id' => historiaCategoriaId('Galería límite'),
        'autor' => 'Autor QA',
        'precio_base' => '19.99',
        'codigo' => '#GAL-'.$suffix,
        'estado' => 'activo',
        'destacada' => 'no',
        'duracion_meses' => '12',
    ];
}

/**
 * @return array<string, mixed>
 */
function productosStoreBasePayload(Producto $plantilla): array
{
    $suffix = uniqid('', true);

    return [
        'nombre' => 'Producto galería '.$suffix,
        'descripcion_corta' => 'Resumen breve.',
        'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
        'detalle' => [
            ['icon' => 'Package', 'title' => 'Envío', 'description' => ''],
        ],
        'producto_categoria_id' => $plantilla->producto_categoria_id,
        'producto_subcategoria_id' => $plantilla->producto_subcategoria_id,
        'precio_base' => '10',
        'precio_promocional' => '',
        'impuesto' => '',
        'codigo' => '#PGAL-'.$suffix,
        'stock' => 1,
        'peso' => '',
        'dimensiones' => '',
        'estado' => 'activo',
    ];
}

/**
 * @return array<string, mixed>
 */
function productosUpdateBasePayload(Producto $producto): array
{
    return [
        'nombre' => $producto->nombre,
        'descripcion_corta' => $producto->descripcion_corta,
        'descripcion_larga' => $producto->descripcion_larga,
        'detalle' => $producto->detalle ?? [],
        'producto_categoria_id' => $producto->producto_categoria_id,
        'producto_subcategoria_id' => $producto->producto_subcategoria_id,
        'precio_base' => (string) $producto->precio_base,
        'precio_promocional' => $producto->precio_promocional !== null ? (string) $producto->precio_promocional : '',
        'impuesto' => $producto->impuesto !== null ? (string) $producto->impuesto : '',
        'codigo' => $producto->codigo,
        'stock' => $producto->stock,
        'peso' => $producto->peso ?? '',
        'dimensiones' => $producto->dimensiones ?? '',
        'estado' => $producto->estado,
        'producto_gallery_sync' => true,
        'galeria_keep_ids' => [],
    ];
}

test('crear historia rechaza una sexta imagen en galeria', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $galeria = collect(range(1, 6))->map(fn (int $i) => fakeGaleriaJpeg($i))->all();

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            ...historiasStoreBasePayload(),
            'galeria' => $galeria,
        ])
        ->assertSessionHasErrors(['galeria']);
});

test('crear producto rechaza una sexta imagen en galeria', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $plantilla = Producto::factory()->create();

    $galeria = collect(range(1, 6))->map(fn (int $i) => fakeGaleriaJpeg($i))->all();

    $this->actingAs($admin)
        ->post(route('admin.productos.store'), [
            ...productosStoreBasePayload($plantilla),
            'galeria' => $galeria,
        ])
        ->assertSessionHasErrors(['galeria']);
});

test('editar historia rechaza mas de cinco imagenes entre conservadas y nuevas', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->create();

    $keepIds = collect(range(1, 3))->map(function () use ($historia) {
        return HistoriaGaleria::query()->create([
            'historia_id' => $historia->id,
            'path' => '/storage/historias/galeria/test.jpg',
            'tipo' => 'imagen',
            'es_principal' => false,
        ])->id;
    })->all();

    $nuevas = collect(range(1, 3))->map(fn (int $i) => fakeGaleriaJpeg($i))->all();

    $this->actingAs($admin)
        ->patch(route('admin.historias.update', $historia), [
            ...historiasStoreBasePayload(),
            'nombre' => $historia->nombre,
            'codigo' => $historia->codigo,
            'historia_categoria_id' => $historia->historia_categoria_id,
            'historia_gallery_sync' => true,
            'galeria_keep_ids' => $keepIds,
            'galeria' => $nuevas,
        ])
        ->assertSessionHasErrors(['galeria']);
});

test('editar historia permite tres conservadas y dos nuevas en galeria', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->create();

    $keepIds = collect(range(1, 3))->map(function () use ($historia) {
        return HistoriaGaleria::query()->create([
            'historia_id' => $historia->id,
            'path' => '/storage/historias/galeria/test.jpg',
            'tipo' => 'imagen',
            'es_principal' => false,
        ])->id;
    })->all();

    $nuevas = collect(range(1, 2))->map(fn (int $i) => fakeGaleriaJpeg($i))->all();

    $this->actingAs($admin)
        ->patch(route('admin.historias.update', $historia), [
            ...historiasStoreBasePayload(),
            'nombre' => $historia->nombre,
            'codigo' => $historia->codigo,
            'historia_categoria_id' => $historia->historia_categoria_id,
            'historia_gallery_sync' => true,
            'galeria_keep_ids' => $keepIds,
            'galeria' => $nuevas,
        ])
        ->assertRedirect(route('admin.historias'));

    expect($historia->galeria()->where('es_principal', false)->count())->toBe(5);
});

test('editar producto rechaza mas de cinco imagenes entre conservadas y nuevas', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $producto = Producto::factory()->create();

    $keepIds = collect(range(1, 3))->map(function () use ($producto) {
        return ProductoGaleria::query()->create([
            'producto_id' => $producto->id,
            'path' => '/storage/productos/galeria/test.jpg',
            'tipo' => 'imagen',
            'es_principal' => false,
        ])->id;
    })->all();

    $nuevas = collect(range(1, 3))->map(fn (int $i) => fakeGaleriaJpeg($i + 10))->all();

    $this->actingAs($admin)
        ->patch(route('admin.productos.update', $producto), [
            ...productosUpdateBasePayload($producto),
            'galeria_keep_ids' => $keepIds,
            'galeria' => $nuevas,
        ])
        ->assertSessionHasErrors(['galeria']);
});

test('editar producto permite tres conservadas y dos nuevas en galeria', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $producto = Producto::factory()->create();

    $keepIds = collect(range(1, 3))->map(function () use ($producto) {
        return ProductoGaleria::query()->create([
            'producto_id' => $producto->id,
            'path' => '/storage/productos/galeria/test.jpg',
            'tipo' => 'imagen',
            'es_principal' => false,
        ])->id;
    })->all();

    $nuevas = collect(range(1, 2))->map(fn (int $i) => fakeGaleriaJpeg($i + 20))->all();

    $this->actingAs($admin)
        ->patch(route('admin.productos.update', $producto), [
            ...productosUpdateBasePayload($producto),
            'galeria_keep_ids' => $keepIds,
            'galeria' => $nuevas,
        ])
        ->assertRedirect(route('admin.productos'));

    expect($producto->galeria()->where('es_principal', false)->count())->toBe(5);
});
