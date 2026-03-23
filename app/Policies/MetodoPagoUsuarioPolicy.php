<?php

namespace App\Policies;

use App\Models\MetodoPagoUsuario;
use App\Models\User;

class MetodoPagoUsuarioPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, MetodoPagoUsuario $metodo): bool
    {
        return $user->id === $metodo->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, MetodoPagoUsuario $metodo): bool
    {
        return $user->id === $metodo->user_id;
    }
}
