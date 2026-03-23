<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class OrdenController extends Controller
{
    public function index(): Response
    {
        if (auth()->user() && auth()->user()->isAdmin()) {
            $ordenesAdmin = [
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Laura Pérez',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Completado',
                    'estado_color' => 'success',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Samuel Carroll',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Rechazado',
                    'estado_color' => 'danger',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Laura Pérez',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Completado',
                    'estado_color' => 'success',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Laura Pérez',
                    'direccion' => 'Zapopan, Jalisco',
                    'estado' => 'Completado',
                    'estado_color' => 'success',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Samuel Carroll',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Rechazado',
                    'estado_color' => 'danger',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Laura Pérez',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Completado',
                    'estado_color' => 'success',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Samuel Carroll',
                    'direccion' => 'Zapopan, Jalisco',
                    'estado' => 'Rechazado',
                    'estado_color' => 'danger',
                ],
                [
                    'id' => '#1018',
                    'producto' => 'Kit de Lacre Real',
                    'cantidad' => '01',
                    'precio' => '$124.95',
                    'cliente' => 'Laura Pérez',
                    'direccion' => 'C.P. 12345, México, D.F.',
                    'estado' => 'Rechazado',
                    'estado_color' => 'danger',
                ],
            ];

            return Inertia::render('admin/orders', [
                'ordenes' => $ordenesAdmin,
            ]);
        }

        $ordenes = [
            [
                'id' => '#1045',
                'fecha' => '2025-04-01',
                'producto' => 'Kit de Lacre Real',
                'imagen' => '/images/products/product-1.png',
                'precio' => '$24,90',
                'cantidad' => 1,
                'estado' => 'Completado',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1046',
                'fecha' => '2025-04-10',
                'producto' => 'Pluma Estilográfica Vintage',
                'imagen' => '/images/products/product-2.png',
                'precio' => '$24,90',
                'cantidad' => 2,
                'estado' => 'Rechazado',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1047',
                'fecha' => '2025-04-13',
                'producto' => 'Abrecartas de Bronce',
                'imagen' => '/images/products/product-3.png',
                'precio' => '$24,90',
                'cantidad' => 2,
                'estado' => 'Completado',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1048',
                'fecha' => '2025-04-15',
                'producto' => 'Kit de Lacre Real',
                'imagen' => '/images/products/product-1.png',
                'precio' => '$24,90',
                'cantidad' => 1,
                'estado' => 'Completado',
                'estado_color' => 'success',
            ],
            [
                'id' => '#1049',
                'fecha' => '2025-04-17',
                'producto' => 'Pluma Estilográfica Vintage',
                'imagen' => '/images/products/product-2.png',
                'precio' => '$24,90',
                'cantidad' => 2,
                'estado' => 'Rechazado',
                'estado_color' => 'danger',
            ],
            [
                'id' => '#1050',
                'fecha' => '2025-04-20',
                'producto' => 'Tinta Negra Premium',
                'imagen' => '/images/products/product-3.png',
                'precio' => '$15,00',
                'cantidad' => 1,
                'estado' => 'Completado',
                'estado_color' => 'success',
            ],
        ];

        return Inertia::render('user/orders', [
            'ordenes' => $ordenes,
        ]);
    }
}
