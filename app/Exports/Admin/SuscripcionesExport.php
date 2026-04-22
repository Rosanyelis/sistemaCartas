<?php

namespace App\Exports\Admin;

use App\Models\Suscripcion;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SuscripcionesExport implements FromQuery, WithHeadings, WithMapping
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        $query = Suscripcion::query()->with(['user', 'historia']);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('codigo', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if (! empty($this->filters['start_date']) && ! empty($this->filters['end_date'])) {
            $query->whereBetween('fecha_adquisicion', [
                $this->filters['start_date'].' 00:00:00',
                $this->filters['end_date'].' 23:59:59',
            ]);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'ID Suscripción',
            'Suscripción',
            'Cliente',
            'Estado',
            'Fecha Adquisición',
            'Fecha Culminación',
        ];
    }

    /**
     * @param  Suscripcion  $suscripcion
     */
    public function map($suscripcion): array
    {
        return [
            $suscripcion->codigo ?? ('#'.str_pad((string) $suscripcion->id, 5, '0', STR_PAD_LEFT)),
            $suscripcion->historia?->nombre ?? 'Suscripción '.$suscripcion->id,
            $suscripcion->user?->name ?? 'Usuario Eliminado',
            $suscripcion->status === 'active' ? 'Activo' : 'Cancelado',
            $suscripcion->fecha_adquisicion?->format('d/m/Y') ?? '-',
            $suscripcion->fecha_culminacion?->format('d/m/Y') ?? '-',
        ];
    }
}
