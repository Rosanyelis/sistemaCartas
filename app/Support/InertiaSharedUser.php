<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

/**
 * Serializa el usuario autenticado para props compartidas de Inertia (URLs públicas, perfil tienda).
 */
final class InertiaSharedUser
{
    /**
     * @return array<string, mixed>|null
     */
    public static function from(mixed $user): ?array
    {
        if (! $user instanceof User) {
            return null;
        }

        $avatarUrl = null;
        if (is_string($user->avatar) && $user->avatar !== '') {
            $avatarUrl = asset(Storage::url($user->avatar));
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            'role' => $user->role,
            'direction' => $user->direction,
            'zip_code' => $user->zip_code,
            'phone' => $user->phone,
            'avatar' => $avatarUrl,
            'avatar_url' => $avatarUrl,
            'two_factor_enabled' => $user->two_factor_confirmed_at !== null,
            'created_at' => $user->created_at?->toIso8601String(),
            'updated_at' => $user->updated_at?->toIso8601String(),
        ];
    }
}
