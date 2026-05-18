<?php

namespace App\Mail\Auth;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerifiedWelcomeMail extends Mailable
{
    use SerializesModels;

    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu primer sobre está por abrirse',
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
                'emailTitle' => 'Tu primer sobre está por abrirse',
                'suppressDefaultGreeting' => true,
                'ctaUrl' => route('productos', [], true),
                'ctaLabel' => 'Tu nueva historia te espera. Ve a la página web y descubre un mundo de emociones',
                'ctaText' => 'Descubrir historias',
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
