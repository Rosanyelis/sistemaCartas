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

test('cliente no puede listar historias productos ni ordenes en admin', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->get(route('admin.historias'))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('admin.productos'))
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('admin.ordenes'))
        ->assertForbidden();
});

test('admin puede listar historias productos y ordenes', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('admin.historias'))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('admin.productos'))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('admin.ordenes'))
        ->assertOk();
});
