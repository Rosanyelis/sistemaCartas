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
        $query = Historia::query();

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

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('created_at', [
                $this->filters['start_date'].' 00:00:00',
                $this->filters['end_date'].' 23:59:59',
            ]);
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
            'Autor',
            'Precio Base',
            'Estado',
            'Fecha Registro',
        ];
    }

    /**
     * @param  Historia  $historia
     */
    public function map($historia): array
    {
        return [
            $historia->id,
            $historia->codigo,
            $historia->nombre,
            $historia->categoria,
            $historia->autor,
            '$'.number_format($historia->precio_base, 2),
            ucfirst($historia->estado),
            $historia->created_at?->format('d/m/Y') ?? '-',
        ];
    }
}
