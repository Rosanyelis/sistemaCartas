<?php

use App\Models\Historia;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\TipoMetodoPago;
use App\Models\User;
use App\Notifications\VerifyEmailOtp;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

test('la pagina de perfil expone resumen de actividad y opciones de tipo de pago', function (): void {
    TipoMetodoPago::query()->create(['nombre' => 'Paypal', 'icono' => 'paypal']);

    $user = User::factory()->create([
        'role' => 'cliente',
        'direction' => 'Calle Perfil 1',
        'zip_code' => '28001',
        'phone' => '600000000',
    ]);

    $historia = Historia::factory()->create(['estado' => 'activo']);

    Suscripcion::factory()->for($user)->for($historia)->activa()->create();
    Suscripcion::factory()->for($user)->for($historia)->pendiente()->create();
    Suscripcion::factory()->for($user)->for($historia)->inactiva()->create();

    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'paypal-test-'.uniqid('', true),
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'EUR',
        'total' => '20.00',
    ]);

    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => 'demo',
        'product_name' => 'Demo',
        'quantity' => 3,
        'unit_price' => '5.00',
        'line_total' => '15.00',
    ]);

    $this->actingAs($user)
        ->get(route('user.profile', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/profile')
            ->where('activitySummary.activeSubscriptions', 2)
            ->where('activitySummary.acquiredProducts', 3)
            ->has('paymentTypeOptions', 1)
            ->where('paymentTypeOptions.0.nombre', 'Paypal')
            ->where('paypal.enabled', false)
            ->where('paypal.clientId', ''));
});

test('actualizar el email del perfil invalida la verificacion y envia otp', function (): void {
    Notification::fake();

    TipoMetodoPago::query()->create(['nombre' => 'Paypal', 'icono' => 'paypal']);

    $user = User::factory()->create([
        'role' => 'cliente',
        'email' => 'viejo@example.test',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('user.profile.update', absolute: false), [
            'name' => $user->name,
            'email' => 'nuevo@example.test',
            'direction' => null,
            'zip_code' => null,
            'phone' => null,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    expect($user->email)->toBe('nuevo@example.test');
    expect($user->email_verified_at)->toBeNull();
    Notification::assertSentTo($user, VerifyEmailOtp::class);
});

test('rechaza alta de metodo de pago con tipo no permitido', function (): void {
    $paypal = TipoMetodoPago::query()->create(['nombre' => 'Paypal', 'icono' => 'paypal']);
    $otro = TipoMetodoPago::query()->create(['nombre' => 'Tarjeta Crédito', 'icono' => 'credit-card']);

    $user = User::factory()->create(['role' => 'cliente']);

    $this->actingAs($user)
        ->post(route('user.profile.payment-methods.store', absolute: false), [
            'tipo_id' => $otro->id,
            'titular' => 'Test',
            'detalles' => '1234',
            'is_default' => false,
        ])
        ->assertSessionHasErrors('tipo_id');

    $this->actingAs($user)
        ->post(route('user.profile.payment-methods.store', absolute: false), [
            'tipo_id' => $paypal->id,
            'titular' => 'Titular PayPal',
            'detalles' => 'cuenta@paypal.test',
            'is_default' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($user->metodosPago()->count())->toBe(1);
});

test('la portada comparte datos de envio del usuario autenticado', function (): void {
    $user = User::factory()->create([
        'role' => 'cliente',
        'direction' => 'Av. Compartida 10',
        'zip_code' => '41013',
        'phone' => '611222333',
    ]);

    $this->actingAs($user)
        ->get(route('home', absolute: false))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.direction', 'Av. Compartida 10')
            ->where('auth.user.zip_code', '41013')
            ->where('auth.user.phone', '611222333'));
});
