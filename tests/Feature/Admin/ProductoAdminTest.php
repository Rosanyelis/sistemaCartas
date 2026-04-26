<?php

use App\Models\Producto;
use App\Models\User;

test('un admin puede obtener el json de formulario de un producto', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $producto = Producto::factory()->create();

    $response = $this->actingAs($admin)->getJson("/admin/productos/{$producto->id}/formulario");

    $response->assertOk()
        ->assertJsonPath('nombre', $producto->nombre)
        ->assertJsonPath('codigo', $producto->codigo);
});

test('actualizar un producto redirige con mensaje de éxito en sesión', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $producto = Producto::factory()->create();

    $payload = [
        'nombre' => $producto->nombre,
        'descripcion_corta' => $producto->descripcion_corta,
        'descripcion_larga' => $producto->descripcion_larga,
        'detalle' => $producto->detalle ?? '',
        'producto_categoria_id' => $producto->producto_categoria_id,
        'producto_subcategoria_id' => $producto->producto_subcategoria_id,
        'precio_base' => (string) $producto->precio_base,
        'precio_promocional' => $producto->precio_promocional !== null ? (string) $producto->precio_promocional : '',
        'impuesto' => $producto->impuesto !== null ? (string) $producto->impuesto : '',
        'codigo' => $producto->codigo,
        'stock' => $producto->stock,
        'imagen' => $producto->imagen ?? '',
        'peso' => $producto->peso ?? '',
        'dimensiones' => $producto->dimensiones ?? '',
        'estado' => $producto->estado,
    ];

    $response = $this->actingAs($admin)->patch("/admin/productos/{$producto->id}", $payload);

    $response->assertRedirect(route('admin.productos'));
    $response->assertSessionHas('success');
});
