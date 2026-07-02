<?php

use App\Models\Suscripcion;
use App\Models\User;
use App\Policies\AudioPolicy;
use App\Policies\HistoriaPolicy;
use App\Policies\ProductoPolicy;
use App\Policies\StoreOrderPolicy;
use App\Policies\SuscripcionPolicy;

test('HistoriaPolicy concede solo a administradores', function (): void {
    $admin = new User(['role' => 'admin']);
    $cliente = new User(['role' => 'cliente']);
    $policy = new HistoriaPolicy;

    expect($policy->before($admin, 'viewAny'))->toBeTrue()
        ->and($policy->before($cliente, 'viewAny'))->toBeFalse();
});

test('AudioPolicy concede solo a administradores', function (): void {
    $admin = new User(['role' => 'admin']);
    $cliente = new User(['role' => 'cliente']);
    $policy = new AudioPolicy;

    expect($policy->before($admin, 'viewAny'))->toBeTrue()
        ->and($policy->before($cliente, 'viewAny'))->toBeFalse();
});

test('ProductoPolicy concede solo a administradores', function (): void {
    $admin = new User(['role' => 'admin']);
    $cliente = new User(['role' => 'cliente']);
    $policy = new ProductoPolicy;

    expect($policy->before($admin, 'update'))->toBeTrue()
        ->and($policy->before($cliente, 'update'))->toBeFalse();
});

test('StoreOrderPolicy concede solo a administradores', function (): void {
    $admin = new User(['role' => 'admin']);
    $cliente = new User(['role' => 'cliente']);
    $policy = new StoreOrderPolicy;

    expect($policy->before($admin, 'viewAny'))->toBeTrue()
        ->and($policy->before($cliente, 'viewAny'))->toBeFalse();
});

test('SuscripcionPolicy cancel solo al propietario y viewAny solo a admin', function (): void {
    $owner = new User(['role' => 'cliente']);
    $owner->forceFill(['id' => 1]);
    $other = new User(['role' => 'cliente']);
    $other->forceFill(['id' => 2]);
    $admin = new User(['role' => 'admin']);
    $admin->forceFill(['id' => 3]);

    $sub = new Suscripcion([
        'user_id' => 1,
        'historia_id' => 1,
    ]);

    $policy = new SuscripcionPolicy;

    expect($policy->before($owner, 'cancel'))->toBeNull()
        ->and($policy->cancel($owner, $sub))->toBeTrue()
        ->and($policy->cancel($other, $sub))->toBeFalse()
        ->and($policy->before($admin, 'viewAny'))->toBeTrue()
        ->and($policy->before($owner, 'viewAny'))->toBeFalse();
});
