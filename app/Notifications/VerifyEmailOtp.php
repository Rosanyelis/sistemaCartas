<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailOtp extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $otp)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $name = $notifiable->name ?? null;
        $recipientName = is_string($name) && $name !== '' ? $name : null;

        return (new MailMessage)
            ->subject('Código de verificación — Historias por Correo')
            ->view('mail.auth.verify-email-otp', [
                'recipientName' => $recipientName,
                'otp' => $this->otp,
                'expiresInMinutes' => 10,
                'emailTitle' => 'Verificación de correo',
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
