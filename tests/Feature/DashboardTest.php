<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('admin users receive the admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('admin.dashboard', absolute: false));

    $this->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/dashboard'));
});

test('client users are redirected from dashboard to orders', function () {
    $cliente = User::factory()->create(['role' => 'cliente']);
    $this->actingAs($cliente);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('user.orders', absolute: false));
});
