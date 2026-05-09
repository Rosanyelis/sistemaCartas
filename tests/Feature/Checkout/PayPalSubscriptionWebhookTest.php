<?php

use App\Mail\Checkout\PaymentFailedMail;
use App\Mail\Checkout\SubscriptionRenewedMail;
use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\Suscripcion;
use App\Models\User;
use Carbon\Carbon;
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
        'paypal.webhook_id' => '',
        'paypal.webhook_verify' => true,
    ]);
});

test('webhook activa suscripción y registra pasarela_eventos', function (): void {
    $user = User::factory()->create();
    $historia = Historia::factory()->create(['estado' => 'activo', 'duracion_meses' => 1]);

    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'meses_entrega_total' => 3,
        'fecha_adquisicion' => now()->toDateString(),
        'fecha_finalizacion' => null,
        'proximo_cobro' => null,
        'estado' => 'pendiente',
        'paypal_subscription_id' => 'I-SUB-WEBHOOK-1',
        'paypal_plan_id' => 'P-PLAN-1',
        'paypal_product_id' => 'PROD-1',
    ]);

    $payload = [
        'id' => 'WH-EVT-ACTIVATE-1',
        'event_type' => 'BILLING.SUBSCRIPTION.ACTIVATED',
        'resource' => [
            'id' => 'I-SUB-WEBHOOK-1',
            'custom_id' => (string) $suscripcion->id,
            'start_time' => '2026-05-07T12:00:00Z',
            'billing_info' => [
                'next_billing_time' => '2026-06-07T12:00:00Z',
            ],
        ],
    ];

    $response = $this->postJson(route('webhooks.paypal'), $payload);

    $response->assertOk()->assertJson(['status' => 'ok']);

    $suscripcion->refresh();
    expect($suscripcion->estado)->toBe('activa');
    expect($suscripcion->fecha_adquisicion->format('Y-m-d'))->toBe('2026-05-07');
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe('2026-06-07');
    expect($suscripcion->fecha_finalizacion->format('Y-m-d'))->toBe('2026-08-07');

    $this->assertDatabaseHas('pasarela_eventos', [
        'paypal_event_id' => 'WH-EVT-ACTIVATE-1',
        'event_type' => 'BILLING.SUBSCRIPTION.ACTIVATED',
        'estado' => PasarelaEvento::ESTADO_COMPLETADO,
        'suscripcion_id' => $suscripcion->id,
    ]);

    $dup = $this->postJson(route('webhooks.paypal'), $payload);
    $dup->assertOk()->assertJson(['status' => 'duplicate']);

    expect(PasarelaEvento::query()->where('paypal_event_id', 'WH-EVT-ACTIVATE-1')->count())->toBe(1);
});

test('webhook activación rellena meses y fecha fin desde la historia si meses_entrega_total es null', function (): void {
    $user = User::factory()->create();
    $historia = Historia::factory()->create(['estado' => 'activo', 'duracion_meses' => 4]);

    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'meses_entrega_total' => null,
        'fecha_adquisicion' => now()->toDateString(),
        'fecha_finalizacion' => null,
        'proximo_cobro' => null,
        'estado' => 'pendiente',
        'paypal_subscription_id' => 'I-SUB-WEBHOOK-NO-MESES',
        'paypal_plan_id' => 'P-PLAN-2',
        'paypal_product_id' => 'PROD-2',
    ]);

    $payload = [
        'id' => 'WH-EVT-ACTIVATE-2',
        'event_type' => 'BILLING.SUBSCRIPTION.ACTIVATED',
        'resource' => [
            'id' => 'I-SUB-WEBHOOK-NO-MESES',
            'custom_id' => (string) $suscripcion->id,
            'start_time' => '2026-03-01T00:00:00Z',
            'billing_info' => [
                'next_billing_time' => '2026-04-01T00:00:00Z',
            ],
        ],
    ];

    $this->postJson(route('webhooks.paypal'), $payload)->assertOk();

    $suscripcion->refresh();
    expect($suscripcion->estado)->toBe('activa');
    expect($suscripcion->meses_entrega_total)->toBe(4);
    expect($suscripcion->fecha_adquisicion->format('Y-m-d'))->toBe('2026-03-01');
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe('2026-04-01');
    expect($suscripcion->fecha_finalizacion->format('Y-m-d'))->toBe(
        Carbon::parse('2026-03-01')->addMonths(4)->toDateString(),
    );
});

test('webhook cobro suscripción fallido envía correo al usuario', function (): void {
    $user = User::factory()->create(['email' => 'sub@example.test']);
    $historia = Historia::factory()->create(['estado' => 'activo', 'duracion_meses' => 1]);

    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'meses_entrega_total' => null,
        'fecha_adquisicion' => now()->toDateString(),
        'fecha_finalizacion' => null,
        'proximo_cobro' => null,
        'estado' => 'activa',
        'paypal_subscription_id' => 'I-SUB-FAIL-MAIL',
        'paypal_plan_id' => 'P-PLAN-F',
        'paypal_product_id' => 'PROD-F',
    ]);

    $payload = [
        'id' => 'WH-EVT-PAY-FAIL-1',
        'event_type' => 'BILLING.SUBSCRIPTION.PAYMENT.FAILED',
        'resource' => [
            'id' => 'I-SUB-FAIL-MAIL',
            'custom_id' => (string) $suscripcion->id,
            'billing_info' => [
                'last_failed_payment' => [
                    'reason_code' => 'INSUFFICIENT_FUNDS',
                    'reason_description' => 'Funds unavailable',
                    'amount' => [
                        'currency_code' => 'USD',
                        'value' => '12.50',
                    ],
                ],
            ],
        ],
    ];

    $response = $this->postJson(route('webhooks.paypal'), $payload);

    $response->assertOk()->assertJson(['status' => 'ok']);

    Mail::assertQueued(PaymentFailedMail::class, function (PaymentFailedMail $mail) use ($suscripcion): bool {
        return $mail->suscripcion->is($suscripcion)
            && $mail->paypalReasonCode === 'INSUFFICIENT_FUNDS'
            && $mail->importeFormateado === 'USD 12,50';
    });
});

test('webhook pago completado sincroniza proximo_cobro con PayPal', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions/I-SUB-SALE-RENEW' => Http::response([
            'id' => 'I-SUB-SALE-RENEW',
            'billing_info' => [
                'next_billing_time' => '2026-07-09T10:00:00Z',
            ],
        ], 200),
    ]);

    $user = User::factory()->create(['email' => 'renew@example.test']);
    $historia = Historia::factory()->create(['estado' => 'activo', 'duracion_meses' => 3]);

    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'meses_entrega_total' => 3,
        'fecha_adquisicion' => '2026-05-09',
        'fecha_finalizacion' => '2026-08-09',
        'proximo_cobro' => '2026-06-09',
        'estado' => 'activa',
        'paypal_subscription_id' => 'I-SUB-SALE-RENEW',
        'paypal_plan_id' => 'P-PLAN-R',
        'paypal_product_id' => 'PROD-R',
    ]);

    $payload = [
        'id' => 'WH-EVT-SALE-RENEW-1',
        'event_type' => 'PAYMENT.SALE.COMPLETED',
        'resource' => [
            'billing_agreement_id' => 'I-SUB-SALE-RENEW',
            'id' => 'SALE-XYZ',
        ],
    ];

    $this->postJson(route('webhooks.paypal'), $payload)->assertOk()->assertJson(['status' => 'ok']);

    $suscripcion->refresh();
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe('2026-07-09');

    Mail::assertQueued(SubscriptionRenewedMail::class);
});
