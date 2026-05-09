<?php

use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use App\Support\HistoriaSuscripcionPrecio;
use Carbon\Carbon;
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

test('borrador envía return_url y cancel_url en https cuando APP_URL es http en dominio público', function (): void {
    Config::set([
        'app.url' => 'http://historias-por-correo.rossdigital.dev',
    ]);

    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/catalogs/products' => Http::response([
            'id' => 'PROD-TEST-HTTPS',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans' => Http::response([
            'id' => 'P-PLAN-TEST-HTTPS',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans/*/activate' => Http::response(null, 204),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions' => Http::response([
            'id' => 'I-SUB-HTTPS-1',
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

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ])->assertOk();

    Http::assertSent(function ($request): bool {
        if (! str_contains($request->url(), '/v1/billing/subscriptions') || $request->method() !== 'POST') {
            return true;
        }

        /** @var array<string, mixed> $data */
        $data = $request->data();
        $ctx = $data['application_context'] ?? [];

        return str_starts_with((string) ($ctx['return_url'] ?? ''), 'https://historias-por-correo.rossdigital.dev')
            && str_contains((string) ($ctx['return_url'] ?? ''), 'subscription=return')
            && str_starts_with((string) ($ctx['cancel_url'] ?? ''), 'https://historias-por-correo.rossdigital.dev')
            && str_contains((string) ($ctx['cancel_url'] ?? ''), 'subscription=cancel');
    });
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
        'meses_entrega_total' => 1,
    ]);

    $historia->refresh();
    expect($historia->paypal_plan_id)->toBe('P-PLAN-TEST-1');

    $suscripcion = Suscripcion::query()
        ->where('user_id', $user->id)
        ->where('historia_id', $historia->id)
        ->latest('id')
        ->first();
    expect($suscripcion)->not->toBeNull();
    $meses = HistoriaSuscripcionPrecio::mesesEntregaTotal($historia);
    $cadaMeses = HistoriaSuscripcionPrecio::intervaloFacturacionMeses($historia);
    expect($suscripcion->fecha_adquisicion->format('Y-m-d'))->toBe(now()->toDateString());
    expect($suscripcion->fecha_finalizacion->format('Y-m-d'))->toBe(
        Carbon::parse($suscripcion->fecha_adquisicion)->addMonthsNoOverflow((int) $meses)->toDateString(),
    );
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe(
        Carbon::parse($suscripcion->fecha_adquisicion)->addMonthsNoOverflow($cadaMeses)->toDateString(),
    );
    expect($suscripcion->meses_entrega_total)->toBe($meses);
});

test('borrador usa cobro mensual aunque el arco de la historia sea mayor', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/catalogs/products' => Http::response([
            'id' => 'PROD-ARC-8',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans' => Http::response([
            'id' => 'P-PLAN-MENSUAL-8',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans/*/activate' => Http::response(null, 204),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions' => Http::response([
            'id' => 'I-SUB-ARC-8',
            'status' => 'APPROVAL_PENDING',
        ], 201),
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $historia = Historia::factory()->create([
        'estado' => 'activo',
        'duracion_meses' => 8,
        'precio_base' => 19.99,
        'precio_promocional' => null,
    ]);

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ])->assertOk();

    $suscripcion = Suscripcion::query()
        ->where('user_id', $user->id)
        ->where('historia_id', $historia->id)
        ->latest('id')
        ->first();

    expect($suscripcion)->not->toBeNull();
    expect($suscripcion->meses_entrega_total)->toBe(8);
    expect($suscripcion->proximo_cobro->format('Y-m-d'))->toBe(
        Carbon::parse($suscripcion->fecha_adquisicion)->addMonthsNoOverflow(1)->toDateString(),
    );
    expect($suscripcion->fecha_finalizacion?->format('Y-m-d'))->toBe(
        Carbon::parse($suscripcion->fecha_adquisicion)->addMonthsNoOverflow(8)->toDateString(),
    );

    Http::assertSent(function ($request): bool {
        if (! str_contains($request->url(), '/v1/billing/plans') || $request->method() !== 'POST') {
            return true;
        }

        /** @var array<string, mixed> $data */
        $data = $request->data();
        $cycles = $data['billing_cycles'] ?? [];
        $freq = is_array($cycles[0] ?? null) ? ($cycles[0]['frequency'] ?? []) : [];

        return ($freq['interval_unit'] ?? null) === 'MONTH'
            && (int) ($freq['interval_count'] ?? 0) === 1;
    });
});

test('borrador tolera 422 en activate cuando el plan ya está ACTIVE en PayPal', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/catalogs/products' => Http::response([
            'id' => 'PROD-422-ACTIVATE',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans' => Http::response([
            'id' => 'P-422-ACTIVATE',
            'status' => 'CREATED',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans/P-422-ACTIVATE/activate' => Http::response([
            'name' => 'UNPROCESSABLE_ENTITY',
            'message' => 'The requested action could not be performed.',
        ], 422),
        'api-m.sandbox.paypal.com/v1/billing/plans/P-422-ACTIVATE' => Http::response([
            'id' => 'P-422-ACTIVATE',
            'status' => 'ACTIVE',
        ], 200),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions' => Http::response([
            'id' => 'I-SUB-AFTER-422-ACTIVATE',
            'status' => 'APPROVAL_PENDING',
        ], 201),
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $historia = Historia::factory()->create([
        'estado' => 'activo',
        'duracion_meses' => 1,
        'precio_base' => 12.5,
        'precio_promocional' => null,
        'paypal_plan_id' => null,
        'paypal_product_id' => null,
    ]);

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ])->assertOk()->assertJson([
        'subscriptionID' => 'I-SUB-AFTER-422-ACTIVATE',
    ]);
});

test('borrador omite activate si el plan se crea ya en estado ACTIVE', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v1/catalogs/products' => Http::response([
            'id' => 'PROD-ALREADY-ACTIVE-PLAN',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/plans' => Http::response([
            'id' => 'P-ALREADY-ACTIVE',
            'status' => 'ACTIVE',
        ], 201),
        'api-m.sandbox.paypal.com/v1/billing/subscriptions' => Http::response([
            'id' => 'I-SUB-SKIP-ACTIVATE',
            'status' => 'APPROVAL_PENDING',
        ], 201),
    ]);

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $historia = Historia::factory()->create([
        'estado' => 'activo',
        'duracion_meses' => 1,
        'precio_base' => 15,
        'precio_promocional' => null,
        'paypal_plan_id' => null,
        'paypal_product_id' => null,
    ]);

    $this->actingAs($user)->postJson(route('checkout.paypal.subscription.draft'), [
        'historia_slug' => $historia->slug,
    ])->assertOk()->assertJson([
        'subscriptionID' => 'I-SUB-SKIP-ACTIVATE',
    ]);

    Http::assertNotSent(function ($request): bool {
        return str_contains($request->url(), '/activate');
    });
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
