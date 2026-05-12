<?php

use App\Models\User;
use App\Notifications\PasswordResetOtp;
use Illuminate\Support\Facades\Notification;

test('send otp delivers notification to existing user', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'test@example.com']);

    $this->postJson('/password/send-otp', ['email' => 'test@example.com'])
        ->assertSuccessful()
        ->assertJson(['sent' => true]);

    Notification::assertSentTo($user, PasswordResetOtp::class);
    expect($user->fresh()->otp_code)->not->toBeNull();
});

test('send otp rejects non-existent email', function () {
    $this->postJson('/password/send-otp', ['email' => 'nobody@example.com'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('verify otp with correct code returns reset token', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $otp = $user->generateOtp();

    $response = $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => $otp,
    ]);

    $response->assertSuccessful()
        ->assertJsonStructure(['verified', 'reset_token']);

    expect($response->json('verified'))->toBeTrue();
    expect($response->json('reset_token'))->not->toBeEmpty();

    // OTP should be cleared after verification
    expect($user->fresh()->otp_code)->toBeNull();
});

test('verify otp rejects invalid code', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $user->generateOtp();

    $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => '000000',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('otp');
});

test('verify otp rejects expired code', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $user->generateOtp();

    // Force expire the OTP
    $user->forceFill(['otp_expires_at' => now()->subMinute()])->save();

    $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => $user->otp_code,
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('otp');
});

test('reset password with valid token updates the password', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $otp = $user->generateOtp();

    // Step 1: verify OTP to get reset token
    $verifyResponse = $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => $otp,
    ]);

    $resetToken = $verifyResponse->json('reset_token');

    // Step 2: reset password
    $this->postJson('/password/reset-with-otp', [
        'email' => 'test@example.com',
        'reset_token' => $resetToken,
        'password' => 'NewP@ssw0rd!',
        'password_confirmation' => 'NewP@ssw0rd!',
    ])
        ->assertSuccessful()
        ->assertJson(['reset' => true]);

    // Verify user can login with new password
    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'NewP@ssw0rd!',
    ])->assertRedirect();
});

test('reset password rejects invalid token', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->postJson('/password/reset-with-otp', [
        'email' => 'test@example.com',
        'reset_token' => 'invalid-token',
        'password' => 'NewP@ssw0rd!',
        'password_confirmation' => 'NewP@ssw0rd!',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('reset_token');
});

test('reset password rejects mismatched confirmation', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $otp = $user->generateOtp();

    $verifyResponse = $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => $otp,
    ]);

    $resetToken = $verifyResponse->json('reset_token');

    $this->postJson('/password/reset-with-otp', [
        'email' => 'test@example.com',
        'reset_token' => $resetToken,
        'password' => 'NewP@ssw0rd!',
        'password_confirmation' => 'DifferentPassword!',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});

test('reset token is consumed after use', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $otp = $user->generateOtp();

    $verifyResponse = $this->postJson('/password/verify-otp', [
        'email' => 'test@example.com',
        'otp' => $otp,
    ]);

    $resetToken = $verifyResponse->json('reset_token');

    // First reset should succeed
    $this->postJson('/password/reset-with-otp', [
        'email' => 'test@example.com',
        'reset_token' => $resetToken,
        'password' => 'NewP@ssw0rd!',
        'password_confirmation' => 'NewP@ssw0rd!',
    ])->assertSuccessful();

    // Second reset with same token should fail
    $this->postJson('/password/reset-with-otp', [
        'email' => 'test@example.com',
        'reset_token' => $resetToken,
        'password' => 'AnotherP@ss1',
        'password_confirmation' => 'AnotherP@ss1',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('reset_token');
});
