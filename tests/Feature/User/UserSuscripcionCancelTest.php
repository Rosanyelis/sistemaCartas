<?php

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;

beforeEach(function (): void {
    Config::set([
        'paypal.client_id' => 'test_client_id',
        'paypal.client_secret' => 'test_client_secret',
        'paypal.currency' => 'USD',
        'paypal.mode' => 'sandbox',
        'paypal.enabled' => true,
    ]);
});

test('cliente puede dar de baja suscripción paypal activa', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions/I-SUB-CANCEL/cancel' => Http::response(null, 204),
    ]);

    $user = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    $sub = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'estado' => 'activa',
        'paypal_subscription_id' => 'I-SUB-CANCEL',
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PR-1',
    ]);

    $this->actingAs($user)
        ->post(route('user.subscriptions.cancel', $sub))
        ->assertRedirect(route('user.subscriptions'));

    $sub->refresh();
    expect($sub->estado)->toBe('inactiva');

    Http::assertSent(function ($request): bool {
        return str_contains($request->url(), '/v1/billing/subscriptions/I-SUB-CANCEL/cancel')
            && $request->method() === 'POST';
    });
});

test('cliente puede dar de baja suscripción no paypal solo en local', function (): void {
    Http::fake();

    $user = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    $sub = Suscripcion::factory()->for($user)->for($historia)->create([
        'estado' => 'activa',
        'tipo' => 'Mensual',
        'paypal_subscription_id' => null,
    ]);

    $this->actingAs($user)
        ->post(route('user.subscriptions.cancel', $sub))
        ->assertRedirect(route('user.subscriptions'));

    $sub->refresh();
    expect($sub->estado)->toBe('inactiva');

    Http::assertNothingSent();
});

test('usuario no puede dar de baja suscripción de otro cliente', function (): void {
    Http::fake();

    $a = User::factory()->create(['role' => 'cliente']);
    $b = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    $sub = Suscripcion::factory()->for($b)->for($historia)->create([
        'estado' => 'activa',
        'tipo' => 'Mensual',
    ]);

    $this->actingAs($a)
        ->post(route('user.subscriptions.cancel', $sub))
        ->assertForbidden();
});

test('no se puede dar de baja suscripción que no está activa', function (): void {
    Http::fake();

    $user = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    $sub = Suscripcion::factory()->for($user)->for($historia)->pendiente()->create();

    $response = $this->actingAs($user)
        ->from(route('user.subscriptions'))
        ->post(route('user.subscriptions.cancel', $sub));

    $response->assertRedirect(route('user.subscriptions'))
        ->assertSessionHasErrors('subscription');
});

test('paypal paypal_subscription_id vacío rechaza baja', function (): void {
    Http::fake();

    $user = User::factory()->create(['role' => 'cliente']);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    $sub = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'estado' => 'activa',
        'paypal_subscription_id' => null,
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PR-1',
    ]);

    $response = $this->actingAs($user)
        ->from(route('user.subscriptions'))
        ->post(route('user.subscriptions.cancel', $sub));

    $response->assertRedirect(route('user.subscriptions'))
        ->assertSessionHasErrors('subscription');
});
