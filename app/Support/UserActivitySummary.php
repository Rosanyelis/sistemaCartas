<?php

namespace App\Support;

use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;

/**
 * Métricas de actividad del usuario para el panel de perfil (suscripciones / productos pagados).
 */
final class UserActivitySummary
{
    /**
     * @return array{activeSubscriptions: int, acquiredProducts: int}
     */
    public static function forUser(User $user): array
    {
        $activeSubscriptions = Suscripcion::query()
            ->where('user_id', $user->id)
            ->whereIn('estado', ['activa', 'pendiente'])
            ->count();

        $acquiredProducts = (int) StoreOrderItem::query()
            ->whereHas('storeOrder', static function ($q) use ($user): void {
                $q->where('user_id', $user->id)
                    ->where('status', StoreOrder::STATUS_PAID);
            })
            ->sum('quantity');

        return [
            'activeSubscriptions' => $activeSubscriptions,
            'acquiredProducts' => $acquiredProducts,
        ];
    }
}
