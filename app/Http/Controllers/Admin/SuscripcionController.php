<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\SuscripcionesExport;
use App\Http\Controllers\Controller;
use App\Models\Suscripcion;
use App\Services\Admin\ExportService;
use App\Support\SuscripcionUsuarioListaSerializer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SuscripcionController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Suscripcion::class);

        $query = Suscripcion::query()
            ->with(['user', 'historia']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('historia', function ($historiaQuery) use ($search) {
                        $historiaQuery->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('fecha_adquisicion', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('fecha_adquisicion', '<=', $request->input('end_date'));
        }

        $suscripciones = $query->latest()->paginate(10)->withQueryString();

        $suscripciones->through(function (Suscripcion $suscripcion): array {
            $presentacion = SuscripcionUsuarioListaSerializer::estadoPresentacion((string) $suscripcion->estado);

            return [
                'id' => $suscripcion->id,
                'user' => $suscripcion->user ? [
                    'id' => $suscripcion->user->id,
                    'name' => $suscripcion->user->name,
                    'email' => $suscripcion->user->email,
                    'direction' => $suscripcion->user->direction,
                ] : null,
                'historia' => $suscripcion->historia ? [
                    'id' => $suscripcion->historia->id,
                    'nombre' => $suscripcion->historia->nombre,
                ] : null,
                'cantidad' => $suscripcion->cantidad,
                'tipo' => (string) $suscripcion->tipo,
                'fecha_adquisicion' => $suscripcion->fecha_adquisicion?->format('Y-m-d') ?? '',
                'fecha_finalizacion' => $suscripcion->fecha_finalizacion?->format('Y-m-d') ?? '',
                'proximo_cobro' => $suscripcion->proximo_cobro?->format('Y-m-d') ?? '',
                'estado' => (string) $suscripcion->estado,
                'estado_label' => $presentacion['label'],
                'estado_color' => $presentacion['color'],
            ];
        });

        return Inertia::render('admin/subscriptions', [
            'suscripciones' => $suscripciones,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        Gate::authorize('viewAny', Suscripcion::class);

        $filters = $request->only(['search', 'start_date', 'end_date']);
        $fileName = 'suscripciones_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(SuscripcionesExport::class, $filters, $fileName);
    }
}
