<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Suscripcion;
use App\Support\SuscripcionUsuarioListaSerializer;
use Inertia\Inertia;
use Inertia\Response;

class SuscripcionController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();
        $suscripciones = Suscripcion::query()
            ->where('user_id', $userId)
            ->with(['historia' => fn ($q) => $q->select('id', 'nombre')])
            ->latest('fecha_adquisicion')
            ->latest('id')
            ->get()
            ->map(fn (Suscripcion $s) => SuscripcionUsuarioListaSerializer::fila($s))
            ->values()
            ->all();

        return Inertia::render('user/subscriptions', [
            'suscripciones' => $suscripciones,
        ]);
    }
}
