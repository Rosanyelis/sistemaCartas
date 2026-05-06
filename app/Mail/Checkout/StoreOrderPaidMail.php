<?php

namespace App\Mail\Checkout;

use App\Models\StoreOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StoreOrderPaidMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public StoreOrder $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Compra confirmada — pedido #'.$this->order->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.checkout.store-order-paid',
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
