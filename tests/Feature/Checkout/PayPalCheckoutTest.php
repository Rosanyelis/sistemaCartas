<?php

use App\Models\Producto;
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

test('invitado puede crear orden paypal con ítems válidos de productos activos', function (): void {
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

    $producto = Producto::factory()->create([
        'slug' => 'producto-paypal-demo',
        'nombre' => 'Producto demo PayPal',
        'stock' => 50,
        'precio_base' => 12.45,
        'precio_promocional' => null,
        'estado' => 'activo',
    ]);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => $producto->slug, 'quantity' => 2],
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
        'product_slug' => 'producto-paypal-demo',
        'product_name' => 'Producto demo PayPal',
        'quantity' => 2,
        'unit_price' => 12.45,
        'line_total' => 24.90,
    ]);
});

test('crear orden paypal rechaza slug desconocido', function (): void {
    Http::fake();

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => 'producto-inexistente', 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['items.0.slug']);

    $errors = $response->json('errors') ?? [];
    expect($errors['items.0.slug'] ?? [])->toContain('Hay un producto no válido en el carrito.');
    Http::assertNothingSent();
});

test('crear orden paypal rechaza producto en estado pausado', function (): void {
    Http::fake();

    $producto = Producto::factory()->pausado()->create([
        'slug' => 'producto-pausado-paypal',
        'stock' => 10,
    ]);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => $producto->slug, 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['items.0.slug']);
    Http::assertNothingSent();
});

test('crear orden paypal rechaza cantidad mayor al stock', function (): void {
    Http::fake();

    $producto = Producto::factory()->create([
        'slug' => 'producto-sin-stock-paypal',
        'stock' => 2,
        'estado' => 'activo',
    ]);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => $producto->slug, 'quantity' => 5],
        ],
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('message', 'Stock insuficiente para «'.$producto->nombre.'».');
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

    $producto = Producto::factory()->create([
        'stock' => 10,
        'estado' => 'activo',
    ]);

    $response = $this->postJson(route('checkout.paypal.order'), [
        'items' => [
            ['slug' => $producto->slug, 'quantity' => 1],
        ],
    ]);

    $response->assertStatus(503);
});
