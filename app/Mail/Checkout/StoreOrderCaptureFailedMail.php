<?php

namespace App\Mail\Checkout;

use App\Models\StoreOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StoreOrderCaptureFailedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public StoreOrder $order,
        public string $recipientName,
        public ?string $paypalErrorCode,
        public string $motivoUsuario,
        public ?string $detallePaypal,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pago no completado — pedido #'.$this->order->id.' | Historias por Correo',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.checkout.store-order-capture-failed',
            with: [
                'order' => $this->order,
                'recipientName' => $this->recipientName,
                'paypalErrorCode' => $this->paypalErrorCode,
                'motivoUsuario' => $this->motivoUsuario,
                'detallePaypal' => $this->detallePaypal,
                'emailTitle' => 'Pago no completado',
                'ctaUrl' => route('productos', [], true),
                'ctaLabel' => 'Puedes volver al catálogo y reintentar el pago con PayPal.',
                'ctaText' => 'Volver al catálogo',
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
