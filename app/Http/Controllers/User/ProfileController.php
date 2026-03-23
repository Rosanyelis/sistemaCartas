<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $resumenActivities = [
            'suscripciones_historias' => 4,
            'productos_adquiridos' => 10,
        ];

        $paymentMethods = [
            [
                'id' => 1,
                'type' => 'Paypal',
                'icon' => 'paypal',
                'owner' => 'Juan Pérez',
                'details' => 'Nº 0033564******',
                'is_default' => true,
            ],
            [
                'id' => 2,
                'type' => 'Cuenta de banco',
                'icon' => 'bank',
                'owner' => 'Juan Pérez',
                'details' => 'Nº 0033564******',
                'is_default' => false,
            ],
            [
                'id' => 3,
                'type' => 'Mercado pago',
                'icon' => 'wallet',
                'owner' => 'Juan Pérez',
                'details' => 'Nº 0033564******',
                'is_default' => false,
            ],
        ];

        return Inertia::render('user/profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ?? null,
                'direction' => '123 av. principal, ciudad de Mexico, Mexico', // Mock
                'zip_code' => '01234', // Mock
                'phone' => '709.588.7566', // Mock
            ],
            'resumenActivities' => $resumenActivities,
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
