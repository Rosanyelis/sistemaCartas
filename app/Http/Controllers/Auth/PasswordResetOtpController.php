<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\PasswordResetOtp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetOtpController extends Controller
{
    /**
     * Send a password reset OTP to the user's email.
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No encontramos una cuenta con ese correo electrónico.'],
            ]);
        }

        $otp = $user->generateOtp();
        $user->notify(new PasswordResetOtp($otp));

        return response()->json(['sent' => true]);
    }

    /**
     * Verify the OTP code and issue a temporary reset token.
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No encontramos una cuenta con ese correo electrónico.'],
            ]);
        }

        if ($user->otp_code !== $request->otp || now()->isAfter($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp' => ['El código OTP es inválido o ha expirado.'],
            ]);
        }

        $user->clearOtp();

        $resetToken = Str::uuid()->toString();
        Cache::put("password_reset_otp:{$resetToken}", $user->email, now()->addMinutes(10));

        return response()->json([
            'verified' => true,
            'reset_token' => $resetToken,
        ]);
    }

    /**
     * Reset the user's password using the temporary token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'reset_token' => ['required', 'string'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        $cachedEmail = Cache::get("password_reset_otp:{$request->reset_token}");

        if (! $cachedEmail || $cachedEmail !== $request->email) {
            throw ValidationException::withMessages([
                'reset_token' => ['El token de recuperación es inválido o ha expirado.'],
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['No encontramos una cuenta con ese correo electrónico.'],
            ]);
        }

        $user->forceFill([
            'password' => $request->password,
        ])->save();

        Cache::forget("password_reset_otp:{$request->reset_token}");

        return response()->json(['reset' => true]);
    }
}
