<?php

namespace App\Exports\Admin;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductosExport implements FromQuery, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return Producto::query()
            ->adminFilters($this->filters)
            ->latest()
            ->with(['productoCategoria', 'productoSubcategoria']);
    }

    public function headings(): array
    {
        return [
            'Código',
            'Producto',
            'Categoría',
            'Subcategoría',
            'Precio',
            'Stock',
            'Estado',
        ];
    }

    /**
     * @param  Producto  $producto
     */
    public function map($producto): array
    {
        return [
            $producto->codigo,
            $producto->nombre,
            $producto->productoCategoria?->nombre ?? '-',
            $producto->productoSubcategoria?->nombre ?? '-',
            '$'.number_format($producto->precio, 2),
            $producto->stock,
            ucfirst($producto->estado),
        ];
    }
}
