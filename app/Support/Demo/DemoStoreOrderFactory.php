<?php

namespace App\Support\Demo;

use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\User;
use Illuminate\Support\Carbon;

final class DemoStoreOrderFactory
{
    public static function createPaidProductOrder(
        Producto $producto,
        ?User $user,
        Carbon $createdAt,
        string $paypalOrderId,
        float $lineTotal,
    ): StoreOrder {
        $order = new StoreOrder([
            'user_id' => $user?->id,
            'paypal_order_id' => $paypalOrderId,
            'status' => StoreOrder::STATUS_PAID,
            'currency' => 'USD',
            'total' => $lineTotal,
        ]);
        $order->created_at = $createdAt;
        $order->updated_at = $createdAt;
        $order->save();

        StoreOrderItem::query()->create([
            'store_order_id' => $order->id,
            'product_slug' => $producto->slug,
            'product_name' => $producto->nombre,
            'quantity' => 1,
            'unit_price' => $lineTotal,
            'line_total' => $lineTotal,
        ]);

        return $order;
    }
}
