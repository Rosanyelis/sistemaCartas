<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\OrdenesExport;
use App\Http\Controllers\Controller;
use App\Models\StoreOrder;
use App\Services\Admin\ExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OrdenController extends Controller
{
    public function index(Request $request): Response
    {
        $query = StoreOrder::query()
            ->with(['user', 'items']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        $ordenes = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/orders', [
            'ordenes' => $ordenes,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        $filters = $request->only(['search', 'start_date', 'end_date']);
        $fileName = 'ordenes_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(OrdenesExport::class, $filters, $fileName);
    }
}
