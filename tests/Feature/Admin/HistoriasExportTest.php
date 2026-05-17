<?php

use App\Exports\Admin\HistoriasExport;
use App\Models\Historia;
use App\Models\HistoriaCategoria;
use App\Models\User;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Facades\Excel;

test('export de historias devuelve filas con columnas del listado', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-17 12:00:00'));
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = HistoriaCategoria::factory()->create(['nombre' => 'Export Cat']);
    Historia::factory()->create([
        'historia_categoria_id' => $cat->id,
        'codigo' => 'HST-EXP-1',
        'nombre' => 'Historia Export',
        'autor' => 'Autor Export',
    ]);

    Excel::fake();

    $this->actingAs($admin)->get(route('admin.historias.export'));

    Excel::assertDownloaded('historias_2026_05_17_120000.xlsx', function (HistoriasExport $export): bool {
        $rows = $export->query()->get();

        expect($rows)->not->toBeEmpty();
        expect($export->headings())->toBe([
            'Código',
            'Historia',
            'Categoría',
            'Autor',
            'Precio',
            'Estado',
        ]);

        $first = $export->map($rows->first());

        expect($first)->toHaveCount(6);
        expect($first[0])->toBe('HST-EXP-1');
        expect($first[1])->toBe('Historia Export');
        expect($first[2])->toBe('Export Cat');

        return true;
    });

    Carbon::setTestNow();
});

test('export de historias filtra por categoria_id', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-17 12:00:00'));
    $admin = User::factory()->create(['role' => 'admin']);
    $catA = HistoriaCategoria::factory()->create(['nombre' => 'Cat A']);
    $catB = HistoriaCategoria::factory()->create(['nombre' => 'Cat B']);
    Historia::factory()->create(['historia_categoria_id' => $catA->id, 'codigo' => 'HST-A']);
    Historia::factory()->create(['historia_categoria_id' => $catB->id, 'codigo' => 'HST-B']);

    Excel::fake();

    $this->actingAs($admin)->get(route('admin.historias.export', ['categoria_id' => $catA->id]));

    Excel::assertDownloaded('historias_2026_05_17_120000.xlsx', function (HistoriasExport $export): bool {
        $codigos = $export->query()->pluck('codigo')->all();

        expect($codigos)->toContain('HST-A');
        expect($codigos)->not->toContain('HST-B');

        return true;
    });

    Carbon::setTestNow();
});
