<?php

namespace App\Policies\Concerns;

use App\Models\User;

/**
 * En policies de recursos solo administrables en el panel admin,
 * concede cualquier habilidad a usuarios con permiso `admin`.
 *
 * Laravel comprueba que el método de la habilidad exista antes de ejecutar `before`;
 * por eso se declaran stubs que no se alcanzan cuando `before` devuelve true/false.
 */
trait GrantsAllAbilitiesToAdmins
{
    public function before(User $user, string $ability, mixed ...$args): ?bool
    {
        return $user->can('admin') ? true : false;
    }

    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, mixed $model): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, mixed $model): bool
    {
        return false;
    }

    public function delete(User $user, mixed $model): bool
    {
        return false;
    }

    public function duplicate(User $user, mixed $model): bool
    {
        return false;
    }

    public function toggleStatus(User $user, mixed $model): bool
    {
        return false;
    }
}
