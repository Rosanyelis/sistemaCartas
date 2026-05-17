<?php

use App\Exports\Admin\ProductosExport;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use App\Models\User;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Facades\Excel;

test('export de productos usa columnas alineadas al listado', function (): void {
    Carbon::setTestNow(Carbon::parse('2026-05-17 12:00:00'));
    $admin = User::factory()->create(['role' => 'admin']);
    $cat = ProductoCategoria::factory()->create(['nombre' => 'Cat Export']);
    $sub = ProductoSubcategoria::factory()->create([
        'producto_categoria_id' => $cat->id,
        'nombre' => 'Sub Export',
    ]);
    Producto::factory()->create([
        'producto_categoria_id' => $cat->id,
        'producto_subcategoria_id' => $sub->id,
        'codigo' => 'PRD-EXP-1',
        'nombre' => 'Producto Export',
        'precio_base' => 25.50,
        'stock' => 7,
    ]);

    Excel::fake();

    $this->actingAs($admin)->get(route('admin.productos.export'));

    Excel::assertDownloaded('productos_2026_05_17_120000.xlsx', function (ProductosExport $export): bool {
        expect($export->headings())->toBe([
            'Código',
            'Producto',
            'Categoría',
            'Subcategoría',
            'Precio',
            'Stock',
            'Estado',
        ]);

        $row = $export->map($export->query()->first());

        expect($row[0])->toBe('PRD-EXP-1');
        expect($row[1])->toBe('Producto Export');
        expect($row[2])->toBe('Cat Export');
        expect($row[3])->toBe('Sub Export');
        expect($row[5])->toBe(7);

        return true;
    });

    Carbon::setTestNow();
});
