<?php

use App\Models\User;

test('cliente autenticado no puede acceder al panel administrativo', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('administrador puede acceder al panel administrativo', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk();
});
