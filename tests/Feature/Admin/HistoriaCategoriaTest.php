<?php

use App\Models\Historia;
use App\Models\HistoriaCategoria;
use App\Models\User;

test('un admin puede crear una categoría de historia vía json', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->postJson('/admin/taxonomia/historia-categorias', [
        'nombre' => 'Drama demo',
    ]);

    $response->assertCreated();
    expect(HistoriaCategoria::query()->where('nombre', 'Drama demo')->exists())->toBeTrue();
});

test('un admin puede listar categorías de historia paginadas', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    HistoriaCategoria::factory()->create(['nombre' => 'Cat listado']);

    $response = $this->actingAs($admin)->getJson('/admin/taxonomia/historia-categorias');

    $response->assertOk();
    $response->assertJsonPath('data.0.nombre', 'Cat listado');
});

test('no se puede eliminar una categoría que tiene historias', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = HistoriaCategoria::factory()->create();
    Historia::factory()->create(['historia_categoria_id' => $cat->id]);

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/historia-categorias/'.$cat->id);

    $response->assertStatus(422);
    expect(HistoriaCategoria::query()->whereKey($cat->id)->exists())->toBeTrue();
});

test('un admin puede eliminar una categoría sin historias', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = HistoriaCategoria::factory()->create();

    $response = $this->actingAs($admin)->deleteJson('/admin/taxonomia/historia-categorias/'.$cat->id);

    $response->assertNoContent();
    expect(HistoriaCategoria::query()->whereKey($cat->id)->exists())->toBeFalse();
});
