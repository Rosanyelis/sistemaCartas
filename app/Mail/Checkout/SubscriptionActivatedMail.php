<?php

namespace App\Mail\Checkout;

use App\Models\Suscripcion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionActivatedMail extends Mailable
{
    use SerializesModels;

    public function __construct(public Suscripcion $suscripcion) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Suscripción activada — Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->suscripcion->user?->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.checkout.subscription-activated',
            with: [
                'suscripcion' => $this->suscripcion,
                'recipientName' => $recipientName,
                'emailTitle' => 'Suscripción activada',
                'ctaUrl' => route('user.subscriptions', [], true),
                'ctaLabel' => 'Gestiona tus suscripciones y próximas fechas.',
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
