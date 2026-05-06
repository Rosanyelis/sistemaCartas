<?php

namespace App\Mail\Checkout;

use App\Models\Suscripcion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionRenewedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, mixed>  $saleResource
     */
    public function __construct(
        public Suscripcion $suscripcion,
        public array $saleResource,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Renovación de suscripción registrada | Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->suscripcion->user?->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.checkout.subscription-renewed',
            with: [
                'suscripcion' => $this->suscripcion,
                'saleResource' => $this->saleResource,
                'recipientName' => $recipientName,
                'emailTitle' => 'Renovación registrada',
                'ctaUrl' => route('user.subscriptions', [], true),
                'ctaLabel' => 'Revisa el estado de tu suscripción.',
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
