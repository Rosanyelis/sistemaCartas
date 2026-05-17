<?php

namespace App\Exports\Admin;

use App\Models\Historia;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class HistoriasExport implements FromQuery, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        return Historia::query()
            ->adminFilters($this->filters)
            ->latest()
            ->with('historiaCategoria');
    }

    public function headings(): array
    {
        return [
            'Código',
            'Historia',
            'Categoría',
            'Autor',
            'Precio',
            'Estado',
        ];
    }

    /**
     * @param  Historia  $historia
     */
    public function map($historia): array
    {
        return [
            $historia->codigo,
            $historia->nombre,
            $historia->historiaCategoria?->nombre ?? '',
            $historia->autor,
            '$'.number_format((float) $historia->precio_base, 2),
            ucfirst($historia->estado),
        ];
    }
}
