<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public function index(): Response
    {
        $subscriptions = [
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Completa',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Inactiva',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Incompleta',
                'estado_color' => 'warning',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Completa',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Incompleta',
                'estado_color' => 'warning',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Completa',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Inactiva',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Completa',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1018',
                'historia' => 'El Enigma del...',
                'cantidad' => '01',
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '23/02/2026',
                'fecha_finalizacion' => '23/02/2027',
                'proximo_cobro' => '23/02/2027',
                'cliente_nombre' => 'Lucia Febres',
                'cliente_direccion' => 'C.P. 12345, Mé...',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
        ];

        return Inertia::render('admin/subscriptions', [
            'subscriptions' => $subscriptions,
        ]);
    }
}
