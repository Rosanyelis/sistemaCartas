<?php

use App\Mail\Checkout\SubscriptionRenewalReminderMail;
use App\Models\Historia;
use App\Models\Suscripcion;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

test('comando de recordatorio envía correo para suscripciones con proximo_cobro en la fecha objetivo', function (): void {
    Mail::fake();

    $daysBefore = (int) config('tienda.renewal_reminder_days_before', 3);
    $targetDate = now()->addDays($daysBefore)->toDateString();

    $user = User::factory()->create();
    $historia = Historia::factory()->create();

    $suscripcion = Suscripcion::factory()->for($user)->for($historia)->create([
        'estado' => 'activa',
        'proximo_cobro' => $targetDate,
        'renewal_reminder_sent_at' => null,
    ]);

    Artisan::call('subscriptions:send-renewal-reminders');

    Mail::assertSent(SubscriptionRenewalReminderMail::class, function (SubscriptionRenewalReminderMail $mail) use ($suscripcion): bool {
        return $mail->suscripcion->is($suscripcion->fresh());
    });

    expect($suscripcion->fresh()->renewal_reminder_sent_at)->not->toBeNull();
});

test('comando no reenvía si ya se marcó renewal_reminder_sent_at', function (): void {
    Mail::fake();

    $daysBefore = (int) config('tienda.renewal_reminder_days_before', 3);
    $targetDate = now()->addDays($daysBefore)->toDateString();

    Suscripcion::factory()->create([
        'estado' => 'activa',
        'proximo_cobro' => $targetDate,
        'renewal_reminder_sent_at' => now(),
    ]);

    Artisan::call('subscriptions:send-renewal-reminders');

    Mail::assertNothingSent();
});

test('comando ignora suscripciones inactivas', function (): void {
    Mail::fake();

    $daysBefore = (int) config('tienda.renewal_reminder_days_before', 3);
    $targetDate = now()->addDays($daysBefore)->toDateString();

    Suscripcion::factory()->create([
        'estado' => 'inactiva',
        'proximo_cobro' => $targetDate,
        'renewal_reminder_sent_at' => null,
    ]);

    Artisan::call('subscriptions:send-renewal-reminders');

    Mail::assertNothingSent();
});
