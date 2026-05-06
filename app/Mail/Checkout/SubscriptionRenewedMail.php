<?php

namespace App\Mail\Checkout;

use App\Models\Suscripcion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionRenewedMail extends Mailable
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
            subject: 'Renovación de suscripción registrada',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.checkout.subscription-renewed',
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
