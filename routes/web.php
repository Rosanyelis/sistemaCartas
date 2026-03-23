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

use App\Http\Controllers\User\OrdenController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\SuscripcionController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        if ($request->user()->isAdmin()) {
            return Inertia::render('admin/dashboard');
        }

        return redirect()->route('user.orders');
    })->name('dashboard');

    Route::get('orders', [OrdenController::class, 'index'])->name('user.orders');
    Route::get('subscriptions', [SuscripcionController::class, 'index'])->name('user.subscriptions');
    Route::get('profile', [ProfileController::class, 'index'])->name('user.profile');
    Route::post('profile', [ProfileController::class, 'update'])->name('user.profile.update');
    Route::post('profile/avatar', [ProfileController::class, 'updateAvatar'])->name('user.profile.avatar');
    Route::post('profile/payment-methods', [ProfileController::class, 'storePaymentMethod'])->name('user.profile.payment-methods.store');
    Route::delete('profile/payment-methods/{metodo}', [ProfileController::class, 'destroyPaymentMethod'])->name('user.profile.payment-methods.destroy');
    Route::patch('profile/payment-methods/{metodo}/default', [ProfileController::class, 'setDefaultPaymentMethod'])->name('user.profile.payment-methods.set-default');

    // Admin Routes
    Route::middleware('can:admin')->group(function () {
        Route::get('clients', function () {
            return Inertia::render('admin/clients');
        })->name('admin.clients');

        Route::get('admin/stories', function () {
            return Inertia::render('admin/stories');
        })->name('admin.stories');

        Route::get('admin/products', function () {
            return Inertia::render('admin/products');
        })->name('admin.products');
    });
});

require __DIR__.'/settings.php';
