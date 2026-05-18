<?php

namespace App\Mail\Checkout;

use App\Models\Suscripcion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionRenewalReminderMail extends Mailable
{
    use SerializesModels;

    public function __construct(
        public Suscripcion $suscripcion,
        public int $daysBefore,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recordatorio: próximo cobro de tu suscripción | Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->suscripcion->user?->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.checkout.subscription-renewal-reminder',
            with: [
                'suscripcion' => $this->suscripcion,
                'daysBefore' => $this->daysBefore,
                'recipientName' => $recipientName,
                'emailTitle' => 'Próximo cobro de suscripción',
                'ctaUrl' => route('user.subscriptions', [], true),
                'ctaLabel' => 'Revisa fechas y estado en tu panel.',
                'ctaText' => 'Ver mis suscripciones',
            ],
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
