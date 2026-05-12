<?php

use App\Models\User;
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
