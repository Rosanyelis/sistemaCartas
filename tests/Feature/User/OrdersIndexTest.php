<?php

use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('invitado no puede ver ordenes de usuario', function (): void {
    $this->get(route('user.orders', absolute: false))
        ->assertRedirect(route('login', absolute: false));
});

test('cliente sin compras ve lista vacia', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->get(route('user.orders', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/orders')
            ->has('ordenes.data', 0));
});

test('cliente ve lineas de pedido pagadas desde la base de datos', function (): void {
    $user = User::factory()->create(['role' => 'cliente']);
    $producto = Producto::factory()->create([
        'slug' => 'prod-panel-test',
        'nombre' => 'Producto panel órdenes',
        'estado' => 'activo',
        'imagen' => 'https://ejemplo.test/img.jpg',
    ]);

    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'PP-ORD-TEST-1',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'USD',
        'total' => 24.50,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => $producto->slug,
        'product_name' => $producto->nombre,
        'quantity' => 2,
        'unit_price' => 12.25,
        'line_total' => 24.50,
    ]);

    $this->actingAs($user)
        ->get(route('user.orders', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/orders')
            ->has('ordenes.data', 1)
            ->where('ordenes.data.0.order_id', $order->id)
            ->where('ordenes.data.0.producto', 'Producto panel órdenes')
            ->where('ordenes.data.0.cantidad', 2)
            ->where('ordenes.data.0.estado', 'Pagado'));
});

test('cliente no ve ordenes de otro usuario', function (): void {
    $a = User::factory()->create(['role' => 'cliente']);
    $b = User::factory()->create(['role' => 'cliente']);

    $order = StoreOrder::query()->create([
        'user_id' => $b->id,
        'paypal_order_id' => 'PP-SECRET',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'EUR',
        'total' => 10.00,
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => 'x',
        'product_name' => 'Ajeno',
        'quantity' => 1,
        'unit_price' => 10.00,
        'line_total' => 10.00,
    ]);

    $this->actingAs($a)
        ->get(route('user.orders', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/orders')
            ->has('ordenes.data', 0));
});
