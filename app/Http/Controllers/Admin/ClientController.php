<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        $clients = [];

        $nombres = ['Santiago Zuares', 'Jorge Carroll', 'Santiago Zuares', 'Santiago Zuares', 'Santiago Zuares', 'Jorge Carroll', 'Jorge Carroll', 'Santiago Zuares', 'Laura Pérez', 'Carlos Gómez', 'Ana Martínez', 'Luis Rodríguez'];
        $correos = ['szuares@gmail.com', 'jorgecarroll@gmail.com', 'szuares@gmail.com', 'szuares@gmail.com', 'szuares@gmail.com', 'jorgecarroll@gmail.com', 'jorgecarroll@gmail.com', 'szuares@gmail.com', 'lperez@gmail.com', 'cgomez@gmail.com', 'amartinez@gmail.com', 'lrodriguez@gmail.com'];
        $direcciones = ['Zapopan, Jalisco', 'C.P. 12345, México, D.F.', 'Zapopan, Jalisco', 'Zapopan, Jalisco', 'Zapopan, Jalisco', 'C.P. 12345, México, D.F.', 'C.P. 12345, México, D.F.', 'Zapopan, Jalisco', 'Monterrey, N.L.', 'Guadalajara, Jalisco', 'Mérida, Yucatán', 'Puebla, Puebla'];
        $suscripciones = ['Si', 'No', 'Si', 'Si', 'Si', 'No', 'No', 'Si', 'Si', 'No', 'Si', 'No'];

        for ($i = 0; $i < 12; $i++) {
            $clients[] = [
                'id' => '#10'.(18 + $i),
                'nombre' => $nombres[$i],
                'correo' => $correos[$i],
                'direccion' => $direcciones[$i],
                'telefono' => '+52 1555 123 4567',
                'tiene_suscripcion' => $suscripciones[$i],
            ];
        }

        return Inertia::render('admin/clients', [
            'clients' => $clients,
        ]);
    }
}
