<?php

use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('cliente con compra pagada ve filas reales en mis órdenes', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);
    $producto = Producto::factory()->create([
        'slug' => 'producto-orden-test',
        'nombre' => 'Producto de prueba orden',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'PAY-TEST-'.uniqid(),
        'status' => StoreOrder::STATUS_PAID,
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

    $this->actingAs($user)
        ->get(route('user.orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/orders')
            ->where('ordenes.data.0.producto', 'Producto de prueba orden')
            ->where('ordenes.data.0.cantidad', 2)
            ->where('ordenes.data.0.order_id', $order->id)
            ->where('ordenes.data.0.estado', 'Pagado')
            ->where('ordenes.total', 1));
});

test('cliente sin compras ve listado vacío sin error', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->get(route('user.orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/orders')
            ->where('ordenes.total', 0));
});

test('cliente no ve órdenes de otro usuario', function (): void {
    $a = User::factory()->create(['role' => 'cliente', 'email' => 'a-'.uniqid().'@test.com']);
    $b = User::factory()->create(['role' => 'cliente', 'email' => 'b-'.uniqid().'@test.com']);
    $producto = Producto::factory()->create();

    $order = StoreOrder::query()->create([
        'user_id' => $a->id,
        'paypal_order_id' => 'PAY-OTRO-'.uniqid(),
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'USD',
        'total' => 5.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => 'Sólo A',
        'quantity' => 1,
        'unit_price' => 5.00,
        'line_total' => 5.00,
    ]);

    $this->actingAs($b)
        ->get(route('user.orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('ordenes.total', 0));
});

test('intento de pago no completado se lista con estado danger', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);
    $p = Producto::factory()->create();

    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'PAY-FAIL-'.uniqid(),
        'status' => StoreOrder::STATUS_CAPTURE_FAILED,
        'currency' => 'USD',
        'total' => 1.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $p->slug,
        'product_name' => 'Item fallo',
        'quantity' => 1,
        'unit_price' => 1.00,
        'line_total' => 1.00,
    ]);

    $this->actingAs($user)
        ->get(route('user.orders'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('ordenes.data.0.estado', 'Pago no completado')
            ->where('ordenes.data.0.estado_color', 'danger'));
});
