<?php

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('invitado no puede ver suscripciones', function (): void {
    $this->get(route('user.subscriptions', absolute: false))
        ->assertRedirect(route('login', absolute: false));
});

test('cliente sin suscripciones recibe lista vacia', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->get(route('user.subscriptions', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/subscriptions')
            ->where('suscripciones', []));
});

test('cliente ve sus suscripciones desde la base de datos', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['nombre' => 'Historia única panel', 'estado' => 'activo']);

    $sub = Suscripcion::factory()->for($user)->for($historia)->create([
        'estado' => 'activa',
        'tipo' => 'Mensual',
    ]);

    $this->actingAs($user)
        ->get(route('user.subscriptions', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/subscriptions')
            ->has('suscripciones', 1)
            ->where('suscripciones.0.id', '#'.$sub->id)
            ->where('suscripciones.0.suscripcion_id', $sub->id)
            ->where('suscripciones.0.historia', 'Historia única panel')
            ->where('suscripciones.0.estado', 'Activo')
            ->where('suscripciones.0.es_activa', true));
});

test('cliente no ve suscripciones de otro usuario', function (): void {
    $a = User::factory()->create(['role' => 'cliente']);
    $b = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    Suscripcion::factory()->for($b)->for($historia)->create(['estado' => 'activa']);

    $this->actingAs($a)
        ->get(route('user.subscriptions', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/subscriptions')
            ->where('suscripciones', []));
});
