<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class SuscripcionController extends Controller
{
    public function index(): Response
    {
        $suscripciones = [
            [
                'id' => '#1045',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Completa',
                'fecha_adquisicion' => '2026-03-16',
                'fecha_finalizacion' => '2027-03-16',
                'proximo_cobro' => '2027-03-16',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1046',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '2026-03-16',
                'fecha_finalizacion' => '2027-03-16',
                'proximo_cobro' => '2027-03-16',
                'estado' => 'Inactiva',
                'estado_color' => 'warning',
            ],
            [
                'id' => '#1047',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '2026-03-16',
                'fecha_finalizacion' => '2027-03-16',
                'proximo_cobro' => '2027-03-16',
                'estado' => 'Incompleta',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1048',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Completa',
                'fecha_adquisicion' => '2026-03-16',
                'fecha_finalizacion' => '2027-03-16',
                'proximo_cobro' => '2027-03-16',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1049',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '2026-03-16',
                'fecha_finalizacion' => '2027-03-16',
                'proximo_cobro' => '2027-03-16',
                'estado' => 'Inactiva',
                'estado_color' => 'warning',
            ],
            [
                'id' => '#1050',
                'historia' => 'Historia Londres',
                'cantidad' => 2,
                'tipo' => 'Completa',
                'fecha_adquisicion' => '2026-03-10',
                'fecha_finalizacion' => '2027-03-10',
                'proximo_cobro' => '2027-03-10',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1051',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '2026-03-05',
                'fecha_finalizacion' => '2027-03-05',
                'proximo_cobro' => '2027-03-05',
                'estado' => 'Incompleta',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1052',
                'historia' => 'Historia Londres',
                'cantidad' => 1,
                'tipo' => 'Mensual',
                'fecha_adquisicion' => '2026-03-01',
                'fecha_finalizacion' => '2027-03-01',
                'proximo_cobro' => '2027-03-01',
                'estado' => 'Activa',
                'estado_color' => 'success',
            ],
        ];

        return Inertia::render('user/subscriptions', [
            'suscripciones' => $suscripciones,
        ]);
    }
}
