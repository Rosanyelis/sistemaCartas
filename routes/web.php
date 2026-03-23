<?php

use App\Http\Controllers\Clientes\HistoriaController;
use App\Http\Controllers\Clientes\ProductoController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'clientes/welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/historias', [HistoriaController::class, 'index'])->name('historias');
Route::get('/historias/{slug}', [HistoriaController::class, 'show'])->name('historias.show');
Route::get('/productos', [ProductoController::class, 'index'])->name('productos');
Route::get('/productos/{slug}', [ProductoController::class, 'show'])->name('productos.show');

use App\Http\Controllers\Auth\EmailVerificationOtpController;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Override Fortify's default verify-email prompt to prevent auto-redirecting when we want to show success
    Route::get('/email/verify', function (Request $request) {
        return $request->user()->hasVerifiedEmail() && ! session('show_success')
            ? redirect()->intended(config('fortify.home'))
            : Inertia::render('auth/verify-email', [
                'status' => session('status'),
                'showSuccess' => session('show_success', false),
            ]);
    })->name('verification.notice');

    Route::post('/email/verification-otp', [EmailVerificationOtpController::class, 'verify'])
        ->name('verification.otp');
    Route::post('/email/verification-otp/resend', [EmailVerificationOtpController::class, 'resend'])
        ->name('verification.otp.resend');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
