<?php

use App\Mail\Auth\EmailVerifiedWelcomeMail;
use App\Mail\Checkout\PaymentFailedMail;
use App\Mail\Checkout\StoreOrderCaptureFailedMail;
use App\Mail\Checkout\StoreOrderPaidMail;
use App\Mail\Checkout\SubscriptionActivatedMail;
use App\Mail\Checkout\SubscriptionRenewedMail;
use App\Models\Historia;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use App\Notifications\VerifyEmailOtp;

test('vistas de correo se renderizan sin excepción', function (): void {
    $user = User::factory()->create(['name' => 'Ana Prueba']);
    $order = StoreOrder::query()->create([
        'user_id' => $user->id,
        'paypal_order_id' => 'PAYPAL-VIEW-1',
        'status' => StoreOrder::STATUS_PAID,
        'currency' => 'EUR',
        'total' => 19.99,
    ]);
    StoreOrderItem::query()->create([
        'store_order_id' => $order->id,
        'product_slug' => 'libro-demo',
        'product_name' => 'Libro demo',
        'quantity' => 1,
        'unit_price' => 19.99,
        'line_total' => 19.99,
    ]);
    $order->load(['user', 'items']);

    $htmlPaid = (new StoreOrderPaidMail($order))->render();
    expect($htmlPaid)->toContain('Compra confirmada')->toContain('#'.$order->id);

    $htmlFail = (new StoreOrderCaptureFailedMail(
        $order,
        'Ana',
        'INSTRUMENT_DECLINED',
        'Mensaje de prueba',
        'Detalle técnico',
    ))->render();
    expect($htmlFail)->toContain('No hemos podido completar el pago');

    $historia = Historia::factory()->create(['nombre' => 'Historia demo']);
    $suscripcion = Suscripcion::query()->create([
        'user_id' => $user->id,
        'historia_id' => $historia->id,
        'store_order_id' => null,
        'tipo' => 'PayPal',
        'cantidad' => 1,
        'fecha_adquisicion' => now()->toDateString(),
        'fecha_finalizacion' => null,
        'proximo_cobro' => now()->addMonth()->toDateString(),
        'estado' => 'activa',
        'paypal_subscription_id' => 'I-SUB-V',
        'paypal_plan_id' => 'P-1',
        'paypal_product_id' => 'PROD-1',
        'paypal_last_payload' => [],
    ]);
    $suscripcion->load(['historia', 'user']);

    $htmlSub = (new SubscriptionActivatedMail($suscripcion))->render();
    expect($htmlSub)->toContain('Suscripción activada');

    $htmlRenew = (new SubscriptionRenewedMail($suscripcion, ['id' => 'SALE-1']))->render();
    expect($htmlRenew)->toContain('Renovación registrada');

    $htmlPayFail = (new PaymentFailedMail(
        $suscripcion,
        'INSUFFICIENT_FUNDS',
        'Sin fondos',
        null,
        'USD 5,00',
    ))->render();
    expect($htmlPayFail)->toContain('suscripción');

    $htmlWelcome = (new EmailVerifiedWelcomeMail($user))->render();
    expect($htmlWelcome)->toContain('Correo verificado');

    $notif = new VerifyEmailOtp('123456');
    $mailMessage = $notif->toMail($user);
    expect($mailMessage->view)->toBe('mail.auth.verify-email-otp');
    $otpHtml = view($mailMessage->view, $mailMessage->viewData)->render();
    expect($otpHtml)->toContain('123456')->toContain('Verificación');
});
