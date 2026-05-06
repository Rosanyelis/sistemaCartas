<?php

namespace App\Mail\Auth;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerifiedWelcomeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cuenta activa — bienvenido a Historias por Correo',
        );
    }

    public function content(): Content
    {
        $name = $this->user->name;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return new Content(
            view: 'mail.auth.email-verified-welcome',
            with: [
                'recipientName' => $recipientName,
                'emailTitle' => 'Cuenta activa',
                'ctaUrl' => route('productos', [], true),
                'ctaLabel' => 'Explora el catálogo de historias y productos.',
                'ctaText' => 'Ir a la tienda',
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
