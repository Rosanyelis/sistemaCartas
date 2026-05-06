<?php

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

beforeEach(function (): void {
    Mail::fake();
    Config::set([
        'paypal.client_id' => 'test_client_id',
        'paypal.client_secret' => 'test_client_secret',
        'paypal.currency' => 'USD',
        'paypal.mode' => 'sandbox',
        'paypal.enabled' => true,
    ]);
});

test('invitado no puede crear borrador de suscripción paypal', function (): void {
    Http::fake();

    $historia = Historia::factory()->create(['estado' => 'activo']);

    $this->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ])->assertUnauthorized();

    Http::assertNothingSent();
});

test('usuario verificado crea borrador de suscripción paypal', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/catalogs/products' => Http::response([
            'id' => 'PROD-TEST-1',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans' => Http::response([
            'id' => 'P-PLAN-TEST-1',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans/*/activate' => Http::response(null, 204),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions' => Http::response([
            'id' => 'I-SUB-DRAFT-1',
            'status' => 'APPROVAL_PENDING',
        ], 201),
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $historia = Historia::factory()->create([
        'estado' => 'activo',
        'duracion_meses' => 1,
        'precio_base' => 9.99,
        'precio_promocional' => null,
    ]);

    $response = $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ]);

    $response->assertOk()
        ->assertJson([
            'subscriptionID' => 'I-SUB-DRAFT-1',
        ]);

    $this->assertDatabaseHas('suscripciones', [
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'paypal_subscription_id' => 'I-SUB-DRAFT-1',
        'estado' => 'pendiente',
    ]);

    $historia->refresh();
    expect($historia->paypal_plan_id)->toBe('P-PLAN-TEST-1');
});

test('no permite segunda suscripción activa a la misma historia', function (): void {
    Http::fake();

    $user = User::factory()->create(['email_verified_at' => now()]);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'estado' => 'activa',
    ]);

    $response = $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ]);

    $response->assertStatus(422);
    Http::assertNothingSent();
});
