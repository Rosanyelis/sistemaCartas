<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\ClientesExport;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\ExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::query()
            ->where('role', '!=', 'admin')
            ->withExists('suscripciones');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $clientes = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/clients', [
            'clientes' => $clientes,
            'filters' => $request->only(['search']),
        ]);
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        $filters = $request->only(['search']);
        $fileName = 'clientes_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(ClientesExport::class, $filters, $fileName);
    }
}
