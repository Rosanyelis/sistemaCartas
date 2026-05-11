<?php

namespace App\Policies;

use App\Models\Suscripcion;
use App\Models\User;

class SuscripcionPolicy
{
    /**
     * @param  mixed  ...$args
     */
    public function before(User $user, string $ability, ...$args): ?bool
    {
        if ($ability === 'cancel') {
            return null;
        }

        return $user->can('admin') ? true : false;
    }

    /**
     * El usuario puede solicitar la baja de esta suscripción en el panel.
     */
    public function cancel(User $user, Suscripcion $suscripcion): bool
    {
        return (int) $suscripcion->user_id === (int) $user->id;
    }

    /**
     * Laravel exige el método para poder ejecutar `before` en `viewAny`.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }
}
