<?php

use App\Models\User;
use App\Support\ValidPublicStoreRedirect;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Fortify\Features;

test('ValidPublicStoreRedirect acepta home con query de carrito', function (): void {
    $request = Request::create('https://sistema.test/', 'GET');

    expect(ValidPublicStoreRedirect::validate('/?openCart=1&checkout=1', $request))
        ->toBe('/?openCart=1&checkout=1');
});

test('ValidPublicStoreRedirect rechaza URLs de administración o externas', function (): void {
    $request = Request::create('https://sistema.test/', 'GET');

    expect(ValidPublicStoreRedirect::validate('https://evil.test/hook', $request))->toBeNull();
    expect(ValidPublicStoreRedirect::validate('//evil.test/', $request))->toBeNull();
    expect(ValidPublicStoreRedirect::validate('/admin', $request))->toBeNull();
    expect(ValidPublicStoreRedirect::validate('/dashboard/orders', $request))->toBeNull();
    expect(ValidPublicStoreRedirect::validate('/email/verify', $request))->toBeNull();
});

test('login con redirect a tienda redirige a la ruta pública si el correo está verificado', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => '/?openCart=1&checkout=1',
    ])->assertRedirect('/?openCart=1&checkout=1');
});

test('login con redirect a tienda envía a verificar correo si aún no está verificado', function (): void {
    $user = User::factory()->unverified()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => '/?openCart=1&checkout=1',
    ])
        ->assertRedirect(route('verification.notice'))
        ->assertSessionHas('storefront_redirect_after_verify', '/?openCart=1&checkout=1');
});

test('login ignora redirect no permitido', function (): void {
    $user = User::factory()->create();

    $this->from('/login')
        ->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
            'redirect' => 'https://malicioso.test/',
        ])->assertRedirect(route('dashboard', absolute: false));
});

test('otp de verificación conserva redirect de checkout para la vista de éxito', function (): void {
    $this->skipUnlessFortifyFeature(Features::emailVerification());

    $user = User::factory()->unverified()->create();
    $otp = $user->generateOtp();

    $this->actingAs($user)
        ->withSession(['storefront_redirect_after_verify' => '/?openCart=1&checkout=1'])
        ->from(route('verification.notice'))
        ->post(route('verification.otp'), ['otp' => $otp])
        ->assertRedirect(route('verification.notice'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();

    $this->actingAs($user)
        ->get(route('verification.notice'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/verify-email')
            ->where('redirectAfterVerify', '/?openCart=1&checkout=1')
            ->where('showSuccess', true));
});

test('registro con redirect a tienda envía primero a verificar el correo', function (): void {
    $this->skipUnlessFortifyFeature(Features::registration());
    $this->skipUnlessFortifyFeature(Features::emailVerification());

    $this->post(route('register.store'), [
        'name' => 'Cliente Tienda',
        'email' => 'cliente-tienda-'.uniqid().'@test.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'redirect' => '/?openCart=1&checkout=1',
    ])
        ->assertRedirect(route('verification.notice'))
        ->assertSessionHas('storefront_redirect_after_verify', '/?openCart=1&checkout=1');
});
