<?php

namespace App\Mail\Checkout;

use App\Models\StoreOrder;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StoreOrderPaidMail extends Mailable
{
    use SerializesModels;

    public function __construct(public StoreOrder $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Gracias por tu compra! — pedido #'.$this->order->id.' | Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->order->user?->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.checkout.store-order-paid',
            with: [
                'order' => $this->order,
                'recipientName' => $recipientName,
                'emailTitle' => '¡Gracias por tu compra!',
                'ctaUrl' => route('user.orders', [], true),
                'ctaLabel' => 'Si deseas validar tu compra ingresa a tu panel de usuario.',
                'ctaText' => 'Ir a panel de usuario',
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
