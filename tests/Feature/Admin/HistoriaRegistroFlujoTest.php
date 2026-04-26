<?php

use App\Enums\HistoriaVarianteTipo;
use App\Models\Historia;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Flujo de registro (creación) de historia: persistencia y props del listado admin.
 *
 * Para pruebas E2E en navegador real (Pest Browser) hace falta `ext-sockets` y
 * `composer require pestphp/pest-plugin-browser --dev`.
 */
test('registrar historia persiste HTML, detalle y variantes en base de datos', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);
    $nombre = 'Historia registro '.$suffix;
    $codigo = '#REG-'.$suffix;
    $descripcionCorta = 'Resumen breve obligatorio.';
    $palabrasLarga = implode(' ', array_fill(0, 40, 'palabra'));
    $descripcionLargaHtml = '<p><strong>Inicio</strong> '.$palabrasLarga.'</p>';
    $detalleInclusiones = [
        ['icon' => 'Newspaper', 'title' => 'Recorte de prensa', 'description' => 'De la época en que transcurre la trama.'],
        ['icon' => 'Mail', 'title' => 'Postal ilustrada'],
    ];

    $response = $this->actingAs($admin)->post(route('admin.historias.store'), [
        'nombre' => $nombre,
        'descripcion_corta' => $descripcionCorta,
        'descripcion_larga' => $descripcionLargaHtml,
        'detalle' => $detalleInclusiones,
        'categoria' => 'Aventura',
        'autor' => 'Autor QA',
        'precio_base' => '19.99',
        'impuesto' => '18',
        'codigo' => $codigo,
        'estado' => 'activo',
        'destacada' => 'si',
        'duracion_meses' => '12',
        'peso' => '0.5kg',
        'dimensiones' => '20x15x2',
        'variantes' => [
            ['tipo' => 'papel', 'valor' => 'Couché 300 g'],
            ['tipo' => 'color', 'valor' => 'Azul cobalto'],
        ],
    ]);

    $response->assertRedirect(route('admin.historias', absolute: false));
    $response->assertSessionHas('success');

    $historia = Historia::query()->where('codigo', $codigo)->first();
    expect($historia)->not->toBeNull();
    expect($historia->nombre)->toBe($nombre);
    expect($historia->descripcion_larga)->toContain('<strong>Inicio</strong>');
    expect($historia->detalle)->toBeArray();
    expect($historia->detalle)->toHaveCount(2);
    expect($historia->detalle[0]['icon'])->toBe('Newspaper');
    expect($historia->detalle[0]['title'])->toBe('Recorte de prensa');
    expect($historia->detalle[0]['description'])->toBe('De la época en que transcurre la trama.');
    expect($historia->detalle[1]['icon'])->toBe('Mail');
    expect($historia->detalle[1]['title'])->toBe('Postal ilustrada');
    expect($historia->variantes)->toHaveCount(2);
    expect($historia->variantes[0]->tipo)->toBe(HistoriaVarianteTipo::Papel);
    expect($historia->variantes[0]->valor)->toBe('Couché 300 g');
    expect($historia->variantes[1]->tipo)->toBe(HistoriaVarianteTipo::Color);
    expect($historia->variantes[1]->valor)->toBe('Azul cobalto');
    expect($historia->destacada)->toBe('si');
});

test('el listado admin de historias incluye la historia recién registrada en las props Inertia', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);
    $nombre = 'Historia listado '.$suffix;
    $codigo = '#LIS-'.$suffix;
    $descripcionLarga = implode(' ', array_fill(0, 30, 'texto'));

    $this->actingAs($admin)->post(route('admin.historias.store'), [
        'nombre' => $nombre,
        'descripcion_corta' => 'Corta para listado.',
        'descripcion_larga' => $descripcionLarga,
        'detalle' => '',
        'categoria' => 'Misterio',
        'autor' => 'Autor Listado',
        'precio_base' => '12',
        'codigo' => $codigo,
        'estado' => 'pausado',
        'destacada' => 'no',
        'duracion_meses' => '6',
    ])->assertRedirect(route('admin.historias', absolute: false));

    $listado = $this->actingAs($admin)->get(route('admin.historias'));
    $listado->assertOk();
    $listado->assertSee($nombre, false);
    $listado->assertSee($codigo, false);

    $listado->assertInertia(fn (Assert $page) => $page
        ->component('admin/stories')
        ->has('historias.data.0', fn (Assert $fila) => $fila
            ->where('nombre', $nombre)
            ->where('codigo', $codigo)
            ->where('estado', 'pausado')
            ->etc()));
});

test('validación rechaza registro sin campos obligatorios', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => '',
            'descripcion_corta' => '',
            'descripcion_larga' => '',
            'categoria' => '',
            'autor' => '',
            'precio_base' => '',
            'codigo' => '',
            'estado' => 'activo',
            'duracion_meses' => '12',
        ])
        ->assertSessionHasErrors([
            'nombre',
            'descripcion_corta',
            'descripcion_larga',
            'categoria',
            'autor',
            'precio_base',
            'codigo',
        ]);
});

test('validación rechaza icono no permitido en detalle de inclusión', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $suffix = uniqid('', true);

    $this->actingAs($admin)
        ->post(route('admin.historias.store'), [
            'nombre' => 'Historia icono inválido '.$suffix,
            'descripcion_corta' => 'Corta.',
            'descripcion_larga' => implode(' ', array_fill(0, 30, 'palabra')),
            'detalle' => [
                ['icon' => 'IconoInventado', 'title' => 'Título'],
            ],
            'categoria' => 'Test',
            'autor' => 'Autor',
            'precio_base' => '10',
            'codigo' => '#ICO-'.$suffix,
            'estado' => 'activo',
            'destacada' => 'no',
            'duracion_meses' => '12',
        ])
        ->assertSessionHasErrors(['detalle.0.icon']);
});
