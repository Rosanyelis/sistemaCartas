<?php

namespace App\Exports\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ClientesExport implements FromQuery, WithHeadings, WithMapping
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        $query = User::query()->where('role', '!=', 'admin');

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->withExists('suscripciones');
    }

    public function headings(): array
    {
        return [
            'ID',
            'Cliente',
            'Correo electrónico',
            'Teléfono',
            'País',
            'Estado',
            'Fecha de Registro',
            'Suscripciones Activas',
            'Rol',
        ];
    }

    /**
     * @param  User  $user
     */
    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->phone ?? '-',
            $user->cod_pais ?? '-',
            $user->status === 'active' ? 'Activo' : 'Inactivo',
            $user->created_at?->format('d/m/Y') ?? '-',
            $user->suscripciones_exists ? 'Sí' : 'No',
            $user->role,
        ];
    }
}
