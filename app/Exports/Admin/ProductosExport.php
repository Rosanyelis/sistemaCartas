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
        $query = Producto::query();

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%");
            });
        }

        if (! empty($this->filters['categoria'])) {
            $query->where('categoria', $this->filters['categoria']);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Código',
            'Nombre',
            'Categoría',
            'Subcategoría',
            'Precio Base',
            'Stock',
            'Estado',
            'Fecha Registro',
        ];
    }

    /**
     * @param  Producto  $producto
     */
    public function map($producto): array
    {
        return [
            $producto->id,
            $producto->codigo,
            $producto->nombre,
            $producto->categoria,
            $producto->subcategoria ?? '-',
            '$'.number_format($producto->precio, 2),
            $producto->stock,
            ucfirst($producto->estado),
            $producto->created_at?->format('d/m/Y') ?? '-',
        ];
    }
}
