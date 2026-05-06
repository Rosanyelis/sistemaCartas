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

/**
 * Cobro recurrente de suscripción rechazado (p. ej. webhook BILLING.SUBSCRIPTION.PAYMENT.FAILED).
 */
class PaymentFailedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Suscripcion $suscripcion,
        public ?string $paypalReasonCode,
        public string $motivoUsuario,
        public ?string $detallePaypal,
        public ?string $importeFormateado,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cobro de suscripción no completado | Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->suscripcion->user?->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.checkout.subscription-payment-failed',
            with: [
                'suscripcion' => $this->suscripcion,
                'paypalReasonCode' => $this->paypalReasonCode,
                'motivoUsuario' => $this->motivoUsuario,
                'detallePaypal' => $this->detallePaypal,
                'importeFormateado' => $this->importeFormateado,
                'recipientName' => $recipientName,
                'emailTitle' => 'Cobro no completado',
                'ctaUrl' => route('user.subscriptions', [], true),
                'ctaLabel' => 'Actualiza el pago en PayPal y revisa el estado aquí.',
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
