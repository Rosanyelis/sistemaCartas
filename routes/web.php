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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
