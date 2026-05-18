<?php

use App\Mail\Checkout\SubscriptionActivatedMail;
use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

beforeEach(function (): void {
    Mail::fake();
    Config::set([
        'app.timezone' => 'UTC',
        'paypal.client_id' => 'test_client_id',
        'paypal.client_secret' => 'test_client_secret',
        'paypal.currency' => 'USD',
        'paypal.mode' => 'sandbox',
        'paypal.enabled' => true,
    ]);
});

test('sync activa suscripción y rellena fechas tras onApprove', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions/I-SUB-SYNC-99' => Http::response([
            'id' => 'I-SUB-SYNC-99',
            'status' => 'ACTIVE',
            'start_time' => '2026-04-10T00:00:00Z',
            'billing_info' => [
                'next_billing_time' => '2026-05-10T00:00:00Z',
            ],
        ], 200),
    ]);

    $user = User::factory()->create([
        'email' => 'sync@example.test',
        'email_verified_at' => now(),
    ]);
    $historia = Historia::factory()->create(['estado' => 'activo', 'duracion_meses' => 1]);

    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'meses_entrega_total' => 2,
        'fecha_adquisicion' => '2020-01-01',
        'fecha_finalizacion' => null,
        'proximo_cobro' => null,
        'estado' => 'pendiente',
        'paypal_subscription_id' => 'I-SUB-SYNC-99',
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PR-1',
    ]);

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.sync'), [
        'subscription_id' => 'I-SUB-SYNC-99',
    ])->assertOk()->assertJson(['status' => 'ok', 'estado' => 'activa']);

    $suscripcion->refresh();
    expect($suscripcion->estado)->toBe('activa');
    expect($suscripcion->fecha_adquisicion->format('Y-m-d'))->toBe('2026-04-10');
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe('2026-05-10');
    expect($suscripcion->fecha_finalizacion->format('Y-m-d'))->toBe('2026-06-10');

    Mail::assertSent(SubscriptionActivatedMail::class);
});

test('sync responde 404 si la suscripción no es del usuario', function (): void {
    Http::fake();

    $a = User::factory()->create(['email_verified_at' => now()]);
    $b = User::factory()->create(['email_verified_at' => now()]);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    Suscripcion::query()->create([
        'user_id' => $b->id,
        'historia_id' => $historia->id,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'estado' => 'pendiente',
        'paypal_subscription_id' => 'I-OTHER',
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PR-1',
    ]);

    $this->actingAs($a)->postJson(route('checkout.paypal.subscription.sync'), [
        'subscription_id' => 'I-OTHER',
    ])->assertNotFound();

    Http::assertNothingSent();
});

test('sync responde 422 si paypal devuelve estado distinto de ACTIVE', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions/I-PENDING' => Http::response([
            'id' => 'I-PENDING',
            'status' => 'APPROVAL_PENDING',
        ], 200),
    ]);

    $user = User::factory()->create(['email_verified_at' => now()]);
    $historia = Historia::factory()->create(['estado' => 'activo']);

    Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'estado' => 'pendiente',
        'paypal_subscription_id' => 'I-PENDING',
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PR-1',
    ]);

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.sync'), [
        'subscription_id' => 'I-PENDING',
    ])->assertStatus(422);

    Mail::assertNothingSent();
});
