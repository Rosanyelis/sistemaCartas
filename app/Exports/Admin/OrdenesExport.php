<?php

namespace App\Exports\Admin;

use App\Models\StoreOrder;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrdenesExport implements FromQuery, WithHeadings, WithMapping
{
    /**
     * @param  array<string, mixed>  $filters
     */
    public function __construct(private array $filters = []) {}

    public function query(): Builder
    {
        $query = StoreOrder::query()->with(['user', 'items']);

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
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
            'ID Pedido',
            'Cliente',
            'Productos',
            'Cantidad',
            'Monto',
            'Estado',
            'Fecha',
        ];
    }

    /**
     * @param  StoreOrder  $order
     */
    public function map($order): array
    {
        $items = $order->items->map(function ($item) {
            return $item->name ?? 'Producto';
        })->implode(', ');

        $cantidad = $order->items->sum('quantity');

        return [
            '#'.str_pad((string) $order->id, 5, '0', STR_PAD_LEFT),
            $order->user->name ?? 'Invitado',
            $items,
            $cantidad,
            '$'.number_format($order->total, 2).' MXN',
            $this->formatStatus($order->status),
            $order->created_at?->format('d/m/Y') ?? '-',
        ];
    }

    private function formatStatus(string $status): string
    {
        return match ($status) {
            'completed', 'paid' => 'Completado',
            'pending', 'pending_payment' => 'Pendiente',
            'failed', 'capture_failed' => 'Rechazado',
            default => ucfirst($status),
        };
    }
}
