<?php

use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use App\Models\User;

test('un admin puede crear una categoría de producto vía json', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->postJson('/admin/taxonomia/producto-categorias', [
        'nombre' => 'Papelería demo',
    ]);

    $response->assertCreated();
    expect(ProductoCategoria::query()->where('nombre', 'Papelería demo')->exists())->toBeTrue();
});

test('un admin puede listar subcategorías filtradas por categoría', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::query()->create(['nombre' => 'Cat listado']);
    $cat->subcategorias()->create(['nombre' => 'Sub A']);

    $response = $this->actingAs($admin)->getJson('/admin/taxonomia/producto-subcategorias?producto_categoria_id='.$cat->id);

    $response->assertOk();
    $response->assertJsonPath('data.0.nombre', 'Sub A');
});

test('no se puede eliminar una categoría que tiene productos', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::factory()->create();
    $sub = ProductoSubcategoria::factory()->create(['producto_categoria_id' => $cat->id]);
    Producto::factory()->create([
        'producto_categoria_id' => $cat->id,
        'producto_subcategoria_id' => $sub->id,
    ]);

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/producto-categorias/'.$cat->id);

    $response->assertStatus(422);
    expect(ProductoCategoria::query()->whereKey($cat->id)->exists())->toBeTrue();
});

test('un admin puede eliminar una categoría sin productos', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::factory()->create();

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/producto-categorias/'.$cat->id);

    $response->assertNoContent();
    expect(ProductoCategoria::query()->whereKey($cat->id)->exists())->toBeFalse();
});

test('no se puede eliminar una subcategoría que tiene productos', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::factory()->create();
    $sub = ProductoSubcategoria::factory()->create(['producto_categoria_id' => $cat->id]);
    Producto::factory()->create([
        'producto_categoria_id' => $cat->id,
        'producto_subcategoria_id' => $sub->id,
    ]);

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/producto-subcategorias/'.$sub->id);

    $response->assertStatus(422);
    expect(ProductoSubcategoria::query()->whereKey($sub->id)->exists())->toBeTrue();
});

test('un admin puede eliminar una subcategoría sin productos', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::factory()->create();
    $sub = ProductoSubcategoria::factory()->create(['producto_categoria_id' => $cat->id]);

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/producto-subcategorias/'.$sub->id);

    $response->assertNoContent();
    expect(ProductoSubcategoria::query()->whereKey($sub->id)->exists())->toBeFalse();
});
