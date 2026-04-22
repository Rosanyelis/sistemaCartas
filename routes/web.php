<?php

use App\Http\Controllers\Admin\ClienteController as AdminClienteController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\HistoriaController as AdminHistoriaController;
use App\Http\Controllers\Admin\OrdenController as AdminOrdenController;
use App\Http\Controllers\Admin\ProductoController as AdminProductoController;
use App\Http\Controllers\Admin\SuscripcionController as AdminSuscripcionController;
use App\Http\Controllers\Auth\EmailVerificationOtpController;
use App\Http\Controllers\Checkout\PayPalCheckoutController;
use App\Http\Controllers\User\HistoriaController;
use App\Http\Controllers\User\OrdenController;
use App\Http\Controllers\User\ProductoController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\SuscripcionController;
use App\Support\Store\ProductCatalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'user/welcome', [
    'canRegister' => Features::enabled(Features::registration()),
    'products' => array_slice(ProductCatalog::forCatalog(), 0, 3),
])->name('home');

Route::get('/historias', [HistoriaController::class, 'index'])->name('historias');
Route::get('/historias/{slug}', [HistoriaController::class, 'show'])->name('historias.show');
Route::get('/productos', [ProductoController::class, 'index'])->name('productos');
Route::get('/productos/ejemplo', [ProductoController::class, 'showReference'])
    ->name('productos.ejemplo');
Route::get('/productos/{slug}', [ProductoController::class, 'show'])->name('productos.show');

Route::post('/checkout/paypal/order', [PayPalCheckoutController::class, 'createOrder'])
    ->name('checkout.paypal.order');
Route::post('/checkout/paypal/capture', [PayPalCheckoutController::class, 'capture'])
    ->name('checkout.paypal.capture');

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
    Route::get('dashboard', function (Request $request) {
        if ($request->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('user.orders');
    })->name('dashboard');

    Route::prefix('user')->name('user.')->group(function () {
        Route::get('orders', [OrdenController::class, 'index'])->name('orders');
        Route::get('subscriptions', [SuscripcionController::class, 'index'])->name('subscriptions');
        Route::get('profile', [ProfileController::class, 'index'])->name('profile');
        Route::post('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::post('profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
        Route::post('profile/payment-methods', [ProfileController::class, 'storePaymentMethod'])->name('profile.payment-methods.store');
        Route::delete('profile/payment-methods/{metodo}', [ProfileController::class, 'destroyPaymentMethod'])->name('profile.payment-methods.destroy');
        Route::patch('profile/payment-methods/{metodo}/default', [ProfileController::class, 'setDefaultPaymentMethod'])->name('profile.payment-methods.set-default');
    });

    // Admin Routes
    Route::middleware('can:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Órdenes
        Route::get('ordenes', [AdminOrdenController::class, 'index'])->name('ordenes');
        Route::get('ordenes/export', [AdminOrdenController::class, 'export'])->name('ordenes.export');

        // Suscripciones
        Route::get('suscripciones', [AdminSuscripcionController::class, 'index'])->name('suscripciones');
        Route::get('suscripciones/export', [AdminSuscripcionController::class, 'export'])->name('suscripciones.export');

        // Clientes
        Route::get('clientes', [AdminClienteController::class, 'index'])->name('clientes');
        Route::get('clientes/export', [AdminClienteController::class, 'export'])->name('clientes.export');

        // Historias
        Route::get('historias', [AdminHistoriaController::class, 'index'])->name('historias');
        Route::get('historias/export', [AdminHistoriaController::class, 'export'])->name('historias.export');
        Route::post('historias', [AdminHistoriaController::class, 'store'])->name('historias.store');
        Route::patch('historias/{historia}', [AdminHistoriaController::class, 'update'])->name('historias.update');
        Route::delete('historias/{historia}', [AdminHistoriaController::class, 'destroy'])->name('historias.destroy');
        Route::post('historias/{historia}/duplicate', [AdminHistoriaController::class, 'duplicate'])->name('historias.duplicate');
        Route::patch('historias/{historia}/toggle-status', [AdminHistoriaController::class, 'toggleStatus'])->name('historias.toggle-status');

        // Productos
        Route::get('productos', [AdminProductoController::class, 'index'])->name('productos');
        Route::get('productos/export', [AdminProductoController::class, 'export'])->name('productos.export');
        Route::post('productos', [AdminProductoController::class, 'store'])->name('productos.store');
        Route::patch('productos/{producto}', [AdminProductoController::class, 'update'])->name('productos.update');
        Route::delete('productos/{producto}', [AdminProductoController::class, 'destroy'])->name('productos.destroy');
        Route::post('productos/{producto}/duplicate', [AdminProductoController::class, 'duplicate'])->name('productos.duplicate');
        Route::patch('productos/{producto}/toggle-status', [AdminProductoController::class, 'toggleStatus'])->name('productos.toggle-status');
        Route::patch('productos/{producto}/stock', [AdminProductoController::class, 'ajustarStock'])->name('productos.stock');

        // Legacy route aliases (backward compatibility with existing sidebar links)
        Route::get('orders', fn (Request $request) => redirect()->route('admin.ordenes', $request->query()))->name('orders');
        Route::get('subscriptions', fn (Request $request) => redirect()->route('admin.suscripciones', $request->query()))->name('subscriptions');
        Route::get('clients', fn (Request $request) => redirect()->route('admin.clientes', $request->query()))->name('clients');
        Route::get('stories', fn (Request $request) => redirect()->route('admin.historias', $request->query()))->name('stories');
        Route::get('products', fn (Request $request) => redirect()->route('admin.productos', $request->query()))->name('products');
    });
});

require __DIR__.'/settings.php';
