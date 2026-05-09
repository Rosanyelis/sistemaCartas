<?php

use App\Mail\Auth\EmailVerifiedWelcomeMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('otp válido marca correo verificado y envía bienvenida', function (): void {
    Mail::fake();

    $user = User::factory()->unverified()->create();
    $user->forceFill([
        'otp_code' => '918273',
        'otp_expires_at' => now()->addMinutes(10),
    ])->save();

    $this->actingAs($user)
        ->from(route('verification.notice'))
        ->post(route('verification.otp'), ['otp' => '918273'])
        ->assertRedirect(route('verification.notice'));

    $user->refresh();
    expect($user->hasVerifiedEmail())->toBeTrue()
        ->and($user->otp_code)->toBeNull();

    Mail::assertQueued(EmailVerifiedWelcomeMail::class, function (EmailVerifiedWelcomeMail $mail) use ($user): bool {
        return $mail->user->is($user);
    });
});

test('otp inválido no envía correo de bienvenida', function (): void {
    Mail::fake();

    $user = User::factory()->unverified()->create();
    $user->forceFill([
        'otp_code' => '111111',
        'otp_expires_at' => now()->addMinutes(10),
    ])->save();

    $this->actingAs($user)
        ->from(route('verification.notice'))
        ->post(route('verification.otp'), ['otp' => '999999'])
        ->assertSessionHasErrors('otp');

    Mail::assertNothingOutgoing();
});
