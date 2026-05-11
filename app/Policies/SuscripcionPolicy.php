<?php

namespace App\Policies;

use App\Models\Suscripcion;
use App\Models\User;

class SuscripcionPolicy
{
    /**
     * El usuario puede solicitar la baja de esta suscripción en el panel.
     */
    public function cancel(User $user, Suscripcion $suscripcion): bool
    {
        return (int) $suscripcion->user_id === (int) $user->id;
    }
}
