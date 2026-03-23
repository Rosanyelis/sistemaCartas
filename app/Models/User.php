<?php

namespace App\Models;

use App\Notifications\VerifyEmailOtp;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'password',
        'otp_code',
        'otp_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'otp_code',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'otp_expires_at' => 'datetime',
        ];
    }

    /**
     * Generate a new OTP code for the user.
     */
    public function generateOtp(): string
    {
        $otp = (string) random_int(100000, 999999);

        $this->forceFill([
            'otp_code' => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ])->save();

        return $otp;
    }

    /**
     * Clear the OTP code.
     */
    public function clearOtp(): void
    {
        $this->forceFill([
            'otp_code' => null,
            'otp_expires_at' => null,
        ])->save();
    }

    /**
     * Send the email verification notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        $otp = $this->generateOtp();
        $this->notify(new VerifyEmailOtp($otp));
    }

    /**
     * Determine if the user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
