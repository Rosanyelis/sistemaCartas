<?php

use App\Enums\HistoriaVarianteTipo;
use App\Models\Historia;
use App\Models\User;

test('al crear una historia se persisten variantes con tipo y valor', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $descripcionLarga = implode(' ', array_fill(0, 50, 'palabra'));

    $codigo = '#VAR-'.uniqid('', true);

    $response = $this->actingAs($admin)->post(route('admin.historias.store'), [
        'nombre' => 'Historia Test Variantes',
        'descripcion_corta' => 'Corta',
        'descripcion_larga' => $descripcionLarga,
        'categoria' => 'Aventura',
        'autor' => 'Autor',
        'precio_base' => '10.50',
        'codigo' => $codigo,
        'estado' => 'activo',
        'duracion_meses' => '12',
        'variantes' => [
            ['tipo' => 'papel', 'valor' => 'Couché 300g'],
            ['tipo' => 'color', 'valor' => 'Azul índigo'],
        ],
    ]);

    $response->assertRedirect(route('admin.historias', absolute: false));

    $historia = Historia::query()->where('codigo', $codigo)->first();
    expect($historia)->not->toBeNull();
    expect($historia->variantes)->toHaveCount(2);
    expect($historia->variantes[0]->tipo)->toBe(HistoriaVarianteTipo::Papel);
    expect($historia->variantes[0]->valor)->toBe('Couché 300g');
    expect($historia->variantes[1]->tipo)->toBe(HistoriaVarianteTipo::Color);
    expect($historia->variantes[1]->valor)->toBe('Azul índigo');
});

test('al duplicar una historia se copian las variantes', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->create();
    $historia->variantes()->create([
        'tipo' => HistoriaVarianteTipo::Papel,
        'valor' => 'Bond blanco',
    ]);
    $historia->variantes()->create([
        'tipo' => HistoriaVarianteTipo::Color,
        'valor' => 'Rojo carmín',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.historias.duplicate', $historia))
        ->assertRedirect(route('admin.historias', absolute: false));

    $copia = Historia::query()->where('nombre', $historia->nombre.' (Copia)')->first();
    expect($copia)->not->toBeNull();
    expect($copia->variantes)->toHaveCount(2);
    expect($copia->variantes->pluck('valor')->sort()->values()->all())->toBe(
        collect(['Bond blanco', 'Rojo carmín'])->sort()->values()->all(),
    );
});
