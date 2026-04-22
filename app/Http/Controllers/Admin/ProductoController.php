<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\ProductosExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AjustarStockRequest;
use App\Http\Requests\Admin\StoreProductoRequest;
use App\Http\Requests\Admin\UpdateProductoRequest;
use App\Models\Producto;
use App\Services\Admin\ExportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Producto::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('subcategoria', 'like', "%{$search}%");
            });
        }

        if ($request->filled('categoria')) {
            $query->where('categoria', $request->input('categoria'));
        }

        $productos = $query->latest()->paginate(10)->withQueryString();
        $categorias = Producto::query()->distinct()->pluck('categoria')->toArray();

        return Inertia::render('admin/products', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria']),
        ]);
    }

    public function store(StoreProductoRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['nombre']).'-'.Str::random(5);

        Producto::query()->create($data);

        return redirect()->route('admin.productos')->with('success', 'Producto creado exitosamente.');
    }

    public function update(UpdateProductoRequest $request, Producto $producto): RedirectResponse
    {
        $producto->update($request->validated());

        return redirect()->route('admin.productos')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        $producto->delete();

        return redirect()->route('admin.productos')->with('success', 'Producto eliminado exitosamente.');
    }

    public function duplicate(Producto $producto): RedirectResponse
    {
        $copy = $producto->replicate();
        $copy->nombre = $producto->nombre.' (Copia)';
        $copy->slug = Str::slug($copy->nombre).'-'.Str::random(5);
        $copy->codigo = $producto->codigo.'-'.Str::random(4);
        $copy->estado = 'pausado';
        $copy->save();

        return redirect()->route('admin.productos')->with('success', 'Producto duplicado exitosamente.');
    }

    public function toggleStatus(Producto $producto): RedirectResponse
    {
        $producto->update([
            'estado' => $producto->estado === 'activo' ? 'pausado' : 'activo',
        ]);

        return redirect()->route('admin.productos')->with('success', 'Estado actualizado.');
    }

    public function ajustarStock(AjustarStockRequest $request, Producto $producto): RedirectResponse
    {
        $producto->update(['stock' => $request->validated('stock')]);

        return redirect()->route('admin.productos')->with('success', 'Stock actualizado.');
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        $filters = $request->only(['search', 'categoria']);
        $fileName = 'productos_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(ProductosExport::class, $filters, $fileName);
    }
}
