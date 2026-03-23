<?php

use App\Models\StoreOrder;
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

test('invitado puede crear orden paypal con ítems válidos del catálogo', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v2/checkout/orders' => Http::response([
            'id' => 'PAYPAL-ORDER-DEMO-1',
            'status' => 'CREATED',
        ], 201),
    ]);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => 'kit-lacre-real', 'quantity' => 2],
        ],
    ]);

    $response->assertOk()
        ->assertJson(['orderId' => 'PAYPAL-ORDER-DEMO-1']);

    $this->assertDatabaseHas('store_orders', [
        'paypal_order_id' => 'PAYPAL-ORDER-DEMO-1',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
    ]);

    $this->assertDatabaseHas('store_order_items', [
        'product_slug' => 'kit-lacre-real',
        'quantity' => 2,
    ]);
});

test('crear orden paypal rechaza slug desconocido', function (): void {
    Http::fake();

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => 'producto-inexistente', 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(422);
    Http::assertNothingSent();
});

test('invitado puede capturar orden paypal', function (): void {
    StoreOrder::query()->create([
        'user_id' => null,
        'paypal_order_id' => 'PAYPAL-ORDER-X',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 24.90,
    ]);

    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v2/checkout/orders/PAYPAL-ORDER-X/capture' => Http::response([
            'status' => 'COMPLETED',
            'purchase_units' => [
                [
                    'payments' => [
                        'captures' => [
                            [
                                'id' => 'CAPTURE-1',
                                'status' => 'COMPLETED',
                            ],
                        ],
                    ],
                ],
            ],
        ], 201),
    ]);

    $response = $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-ORDER-X',
    ]);

    $response->assertOk()
        ->assertJsonPath('status', 'completed')
        ->assertJsonPath('paypal.status', 'COMPLETED');

    $this->assertDatabaseHas('store_orders', [
        'paypal_order_id' => 'PAYPAL-ORDER-X',
        'status' => StoreOrder::STATUS_PAID,
        'paypal_capture_id' => 'CAPTURE-1',
    ]);
});

test('captura sin orden local devuelve 404', function (): void {
    Http::fake();

    $response = $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'NO-EXISTE',
    ]);

    $response->assertNotFound();
    Http::assertNothingSent();
});

test('paypal deshabilitado devuelve 503 al crear orden', function (): void {
    Config::set('paypal.enabled', false);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => 'kit-lacre-real', 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(503);
});
