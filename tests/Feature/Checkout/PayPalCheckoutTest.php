<?php

use App\Mail\Checkout\StoreOrderCaptureFailedMail;
use App\Models\PasarelaEvento;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
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
        'total' => 28.88,
    ]);

    $this->assertDatabaseHas('store_order_items', [
        'product_slug' => 'producto-paypal-demo',
        'product_name' => 'Producto demo PayPal',
        'quantity' => 2,
        'unit_price' => 12.45,
        'line_total' => 24.90,
    ]);

    $orderId = StoreOrder::query()->where('paypal_order_id', 'PAYPAL-ORDER-DEMO-1')->value('id');
    expect($orderId)->not->toBeNull();
    $this->assertDatabaseHas('pasarela_eventos', [
        'store_order_id' => $orderId,
        'event_type' => 'CHECKOUT_ORDER_CREATED',
        'estado' => PasarelaEvento::ESTADO_PENDIENTE,
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
    $producto = Producto::factory()->create([
        'slug' => 'captura-producto-x',
        'nombre' => 'Producto captura X',
        'stock' => 20,
        'precio_base' => 12.45,
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => null,
        'paypal_order_id' => 'PAYPAL-ORDER-X',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 24.90,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 2,
        'unit_price' => 12.45,
        'line_total' => 24.90,
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

    $producto->refresh();
    expect($producto->stock)->toBe(18);
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

test('captura paypal rechazada con usuario registrado envía correo de aviso', function (): void {
    Mail::fake();

    Producto::factory()->create([
        'slug' => 'item-x',
        'nombre' => 'Producto X',
        'stock' => 50,
        'estado' => 'activo',
    ]);

    $user = User::factory()->create(['email' => 'payer@example.test']);
    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'PAYPAL-ORDER-FAIL',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 10.00,
    ]);
    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => 'item-x',
        'product_name' => 'Producto X',
        'quantity' => 1,
        'unit_price' => 10.00,
        'line_total' => 10.00,
    ]);

    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v2/checkout/orders/PAYPAL-ORDER-FAIL/capture' => Http::response([
            'name' => 'INSTRUMENT_DECLINED',
            'message' => 'The instrument presented was either declined by the processor or bank, or it can\'t be used for this payment.',
        ], 422),
    ]);

    $response = $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-ORDER-FAIL',
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('paypal_error', 'INSTRUMENT_DECLINED');

    $this->assertDatabaseHas('store_orders', [
        'paypal_order_id' => 'PAYPAL-ORDER-FAIL',
        'status' => StoreOrder::STATUS_CAPTURE_FAILED,
    ]);

    Mail::assertSent(StoreOrderCaptureFailedMail::class, function (StoreOrderCaptureFailedMail $mail): bool {
        return $mail->paypalErrorCode === 'INSTRUMENT_DECLINED'
            && str_contains($mail->motivoUsuario, 'rechazó');
    });

    expect(Producto::query()->where('slug', 'item-x')->value('stock'))->toBe(50);
});

test('captura exitosa descuenta stock agregado cuando hay varias líneas del mismo slug', function (): void {
    $producto = Producto::factory()->create([
        'slug' => 'multi-line-paypal',
        'stock' => 15,
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => null,
        'paypal_order_id' => 'PAYPAL-MULTI-SLUG',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 30.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 2,
        'unit_price' => 10.00,
        'line_total' => 20.00,
    ]);
    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 3,
        'unit_price' => 10.00,
        'line_total' => 30.00,
    ]);

    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v2/checkout/orders/PAYPAL-MULTI-SLUG/capture' => Http::response([
            'status' => 'COMPLETED',
            'purchase_units' => [
                [
                    'payments' => [
                        'captures' => [
                            [
                                'id' => 'CAPTURE-MULTI',
                                'status' => 'COMPLETED',
                            ],
                        ],
                    ],
                ],
            ],
        ], 201),
    ]);

    $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-MULTI-SLUG',
    ])->assertOk();

    $producto->refresh();
    expect($producto->stock)->toBe(10);
});

test('captura con stock insuficiente no llama a PayPal y deja la orden pendiente', function (): void {
    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
    ]);

    $producto = Producto::factory()->create([
        'slug' => 'stock-bajo-capture',
        'nombre' => 'Producto stock bajo',
        'stock' => 1,
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => null,
        'paypal_order_id' => 'PAYPAL-STOCK-BAJO',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 10.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 4,
        'unit_price' => 10.00,
        'line_total' => 40.00,
    ]);

    $response = $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-STOCK-BAJO',
    ]);

    $response->assertStatus(422)
        ->assertJsonPath('message', 'Stock insuficiente para completar el pago («'.$producto->nombre.'»).');

    Http::assertNotSent(fn ($req): bool => str_contains($req->url(), '/capture'));

    $this->assertDatabaseHas('store_orders', [
        'paypal_order_id' => 'PAYPAL-STOCK-BAJO',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
    ]);

    $producto->refresh();
    expect($producto->stock)->toBe(1);
});

test('segunda captura idempotente no vuelve a descontar stock', function (): void {
    $producto = Producto::factory()->create([
        'slug' => 'idempotente-paypal',
        'stock' => 10,
        'estado' => 'activo',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => null,
        'paypal_order_id' => 'PAYPAL-IDEMP',
        'status' => StoreOrder::STATUS_PENDING_PAYMENT,
        'currency' => 'USD',
        'total' => 10.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 2,
        'unit_price' => 5.00,
        'line_total' => 10.00,
    ]);

    Http::fake([
        'api-m.sandbox.paypal.com/v1/oauth2/token' => Http::response([
            'access_token' => 'fake-access-token',
            'token_type' => 'Bearer',
        ], 200),
        'api-m.sandbox.paypal.com/v2/checkout/orders/PAYPAL-IDEMP/capture' => Http::response([
            'status' => 'COMPLETED',
            'purchase_units' => [
                [
                    'payments' => [
                        'captures' => [
                            [
                                'id' => 'CAPTURE-IDEMP',
                                'status' => 'COMPLETED',
                            ],
                        ],
                    ],
                ],
            ],
        ], 201),
    ]);

    $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-IDEMP',
    ])->assertOk();

    $producto->refresh();
    expect($producto->stock)->toBe(8);

    Http::fake();

    $this->postJson(route('checkout.paypal.capture'), [
        'order_id' => 'PAYPAL-IDEMP',
    ])->assertOk()->assertJsonPath('status', 'completed');

    $producto->refresh();
    expect($producto->stock)->toBe(8);
});
