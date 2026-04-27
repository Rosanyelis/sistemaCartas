<?php

namespace App\Support\Store;

use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use NumberFormatter;

/**
 * Fila de listado “Mis órdenes” (una por ítem de pedido, datos para la UI pública).
 */
final class ClientePedidoLinea
{
    /**
     * @return array{
     *     id: string,
     *     order_id: int,
     *     item_id: int,
     *     fecha: string,
     *     producto: string,
     *     imagen: string,
     *     precio: string,
     *     cantidad: int,
     *     estado: string,
     *     estado_color: 'success'|'danger'|'warning',
     * }
     */
    public static function toArray(StoreOrderItem $item, ?string $imagen): array
    {
        $order = $item->storeOrder;
        if ($order === null) {
            throw new \InvalidArgumentException('Falta relación storeOrder en el ítem.');
        }

        $estado = self::estadoMeta($order->status);

        return [
            'id' => '#'.$order->id,
            'order_id' => (int) $order->id,
            'item_id' => (int) $item->id,
            'fecha' => $order->created_at?->toDateString() ?? '',
            'producto' => $item->product_name,
            'imagen' => self::imagenOPlaceholder($imagen),
            'precio' => self::formatLineTotal($item, $order->currency),
            'cantidad' => (int) $item->quantity,
            'estado' => $estado['label'],
            'estado_color' => $estado['color'],
        ];
    }

    public static function imagenOPlaceholder(?string $imagen): string
    {
        if (is_string($imagen) && $imagen !== '') {
            return $imagen;
        }

        return '/images/placeholder.svg';
    }

    /**
     * Precio = total de la línea (alinear con la columna “Precio” en la UI).
     */
    public static function formatLineTotal(StoreOrderItem $item, string $currency): string
    {
        $code = strtoupper(trim($currency));
        if (strlen($code) !== 3) {
            $code = 'USD';
        }

        $fmt = new NumberFormatter('en_US', NumberFormatter::CURRENCY);
        $formatted = $fmt->formatCurrency((float) $item->line_total, $code);
        if (! is_string($formatted)) {
            return '$'.number_format((float) $item->line_total, 2, '.', ',');
        }

        return $formatted;
    }

    /**
     * Misma lógica semántica que el panel admin (pagado, fallo de captura, pendiente);
     * claves reales: paid, capture_failed, pending_payment, etc.
     *
     * @return array{label: string, color: 'success'|'danger'|'warning'}
     */
    public static function estadoMeta(string $status): array
    {
        return match ($status) {
            StoreOrder::STATUS_PAID => ['label' => 'Pagado', 'color' => 'success'],
            StoreOrder::STATUS_CAPTURE_FAILED => ['label' => 'Pago no completado', 'color' => 'danger'],
            StoreOrder::STATUS_PENDING_PAYMENT => ['label' => 'Pendiente de pago', 'color' => 'warning'],
            default => ['label' => $status, 'color' => 'warning'],
        };
    }
}
