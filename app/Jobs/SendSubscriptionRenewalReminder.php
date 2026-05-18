<?php

namespace App\Jobs;

use App\Mail\Checkout\SubscriptionRenewalReminderMail;
use App\Models\Suscripcion;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

/**
 * Envía el recordatorio previo a proximo_cobro. Se ejecuta vía dispatchSync desde el comando programado
 * (no requiere queue:work; el scheduler de Laravel dispara el comando).
 */
class SendSubscriptionRenewalReminder
{
    use Dispatchable;

    public function __construct(public int $suscripcionId) {}

    public function handle(): void
    {
        $suscripcion = Suscripcion::query()
            ->with(['user', 'historia'])
            ->find($this->suscripcionId);

        if ($suscripcion === null) {
            return;
        }

        if ($suscripcion->estado !== 'activa') {
            return;
        }

        if ($suscripcion->renewal_reminder_sent_at !== null) {
            return;
        }

        $user = $suscripcion->user;
        $email = $user?->email;
        if (! is_string($email) || $email === '') {
            return;
        }

        $daysBefore = max(1, (int) config('tienda.renewal_reminder_days_before', 3));

        Mail::to($email)->send(new SubscriptionRenewalReminderMail($suscripcion, $daysBefore));

        $suscripcion->update(['renewal_reminder_sent_at' => now()]);
    }
}
