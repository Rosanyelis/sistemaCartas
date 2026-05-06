<?php

use App\Models\Historia;
use App\Models\PasarelaEvento;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

beforeEach(function (): void {
    Mail::fake();
    Config::set([
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
            'billing_info' => [
                'next_billing_time' => now()->addMonth()->toIso8601String(),
            ],
        ],
    ];

    $response = $this->postJson(route('webhooks.paypal'), $payload);

    $response->assertOk()->assertJson(['status' => 'ok']);

    $suscripcion->refresh();
    expect($suscripcion->estado)->toBe('activa');

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
