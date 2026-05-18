<?php

namespace App\Console\Commands;

use App\Jobs\SendSubscriptionRenewalReminder;
use App\Models\Suscripcion;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SendSubscriptionRenewalReminders extends Command
{
    protected $signature = 'subscriptions:send-renewal-reminders';

    protected $description = 'Envía recordatorios de próximo cobro para suscripciones activas';

    public function handle(): int
    {
        $daysBefore = max(1, (int) config('tienda.renewal_reminder_days_before', 3));
        $targetDate = Carbon::today()->addDays($daysBefore)->toDateString();

        $ids = Suscripcion::query()
            ->where('estado', 'activa')
            ->whereDate('proximo_cobro', $targetDate)
            ->whereNull('renewal_reminder_sent_at')
            ->pluck('id');

        $sent = 0;

        foreach ($ids as $id) {
            SendSubscriptionRenewalReminder::dispatchSync($id);
            $sent++;
        }

        $this->info("Recordatorios procesados: {$sent} (fecha objetivo de cobro: {$targetDate}).");

        return self::SUCCESS;
    }
}
