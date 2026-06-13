<?php

use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('subir imagen de producto la guarda como webp', function (): void {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $producto = Producto::factory()->create();
    $suffix = uniqid('', true);

    $imagen = UploadedFile::fake()->image('producto.jpg', 640, 480);

    $this->actingAs($admin)
        ->patch(route('admin.productos.update', $producto), [
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
            'imagen' => $imagen,
        ])
        ->assertRedirect(route('admin.productos', absolute: false))
        ->assertSessionHasNoErrors();

    $producto->refresh();

    expect($producto->imagen)->toContain('.webp');

    $relative = str_replace('/storage/', '', (string) $producto->imagen);
    Storage::disk('public')->assertExists($relative);
    expect(str_ends_with($relative, '.webp'))->toBeTrue();
});

test('rechaza campo video al crear producto', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $categoria = ProductoCategoria::factory()->create();
    $subcategoria = ProductoSubcategoria::factory()->create([
        'producto_categoria_id' => $categoria->id,
    ]);
    $suffix = uniqid('', true);

    $video = UploadedFile::fake()->create('clip.mp4', 500, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.productos.store'), [
            'nombre' => 'Producto sin video '.$suffix,
            'descripcion_corta' => 'Resumen.',
            'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
            'detalle' => [],
            'producto_categoria_id' => $categoria->id,
            'producto_subcategoria_id' => $subcategoria->id,
            'precio_base' => '25.00',
            'codigo' => '#NOVID-'.$suffix,
            'stock' => 5,
            'estado' => 'activo',
            'video' => $video,
        ])
        ->assertSessionHasErrors(['video']);
});
