<?php

use App\Models\User;
use App\Notifications\PasswordResetOtp;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

test('las rutas de restablecimiento por enlace de Fortify no están registradas', function () {
    $this->get('/forgot-password')->assertNotFound();
    $this->get('/reset-password/fake-token')->assertNotFound();
});

test('se puede solicitar un código OTP para un correo registrado', function () {
    Notification::fake();

    $user = User::factory()->create();

    $this->postJson(route('password.otp.send'), ['email' => $user->email])
        ->assertOk()
        ->assertJson(['sent' => true]);

    $user->refresh();

    expect($user->otp_code)->not->toBeNull()
        ->and(strlen((string) $user->otp_code))->toBe(6);

    Notification::assertSentTo($user, PasswordResetOtp::class, function (PasswordResetOtp $notification) use ($user): bool {
        $mail = $notification->toMail($user);

        return $mail->subject === 'Tu código de acceso para Historias por Correo';
    });
});

test('el correo OTP de recuperación incluye la copia de marca', function (): void {
    $html = view('mail.auth.password-reset-otp', [
        'recipientName' => 'María',
        'otp' => '482910',
        'expiresInMinutes' => PasswordResetOtp::EXPIRES_IN_MINUTES,
        'emailTitle' => 'Tu código de acceso para Historias por Correo',
        'suppressDefaultGreeting' => true,
    ])->render();

    expect($html)
        ->toContain('Código de acceso generado')
        ->toContain('Hola, María, 👋 Abajo encontrarás el código para restablecimiento')
        ->toContain('extraviado la llave de tu escritorio personal')
        ->toContain('482910')
        ->toContain('expirará en 10 minutos por motivos de seguridad')
        ->toContain('Instrucciones rápidas')
        ->toContain('Pégalo en la casilla de verificación')
        ->toContain('¿No has solicitado este código?')
        ->toContain('lacre de seguridad')
        ->not->toContain('¡Hola, María!');
});

test('solicitar OTP con correo inexistente devuelve error de validación', function () {
    $this->postJson(route('password.otp.send'), ['email' => 'noexiste@example.com'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('flujo completo OTP restablece la contraseña', function () {
    Notification::fake();

    $user = User::factory()->create([
        'password' => 'password',
    ]);

    $this->postJson(route('password.otp.send'), ['email' => $user->email])
        ->assertOk();

    $user->refresh();
    $otp = (string) $user->otp_code;

    $verifyResponse = $this->postJson(route('password.otp.verify'), [
        'email' => $user->email,
        'otp' => $otp,
    ]);

    $verifyResponse
        ->assertOk()
        ->assertJson(['verified' => true])
        ->assertJsonStructure(['reset_token']);

    $resetToken = $verifyResponse->json('reset_token');
    expect($resetToken)->toBeString()->not->toBeEmpty();

    $this->postJson(route('password.otp.reset'), [
        'email' => $user->email,
        'reset_token' => $resetToken,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ])
        ->assertOk()
        ->assertJson(['reset' => true]);

    $user->refresh();

    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
});
