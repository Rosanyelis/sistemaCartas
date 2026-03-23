<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EmailVerificationOtpController extends Controller
{
    /**
     * Verify the email address with OTP.
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        /** @var User $user */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home'));
        }

        if ($user->otp_code !== $request->otp || now()->isAfter($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp' => ['El código OTP es inválido o ha expirado.'],
            ]);
        }

        $user->markEmailAsVerified();
        $user->clearOtp();

        session()->flash('show_success', true);

        return back()->with('verified', true);
    }

    /**
     * Resend the verification OTP.
     */
    public function resend(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(config('fortify.home'));
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
