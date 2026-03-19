<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('clientes/productos');
    }
}
