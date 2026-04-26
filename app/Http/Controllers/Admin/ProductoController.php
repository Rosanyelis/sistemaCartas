<?php

namespace App\Http\Controllers\Admin;

use App\Exports\Admin\ProductosExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AjustarStockRequest;
use App\Http\Requests\Admin\StoreProductoRequest;
use App\Http\Requests\Admin\UpdateProductoRequest;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Services\Admin\ExportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Producto::query()->with(['productoCategoria', 'productoSubcategoria']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhereHas('productoSubcategoria', fn ($s) => $s->where('nombre', 'like', "%{$search}%"))
                    ->orWhereHas('productoCategoria', fn ($c) => $c->where('nombre', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('categoria_id')) {
            $query->where('producto_categoria_id', $request->integer('categoria_id'));
        }

        $productos = $query->latest()->paginate(10)->withQueryString()->through(function (Producto $p) {
            return [
                'id' => $p->id,
                'nombre' => $p->nombre,
                'slug' => $p->slug,
                'codigo' => $p->codigo,
                'imagen' => $p->imagen,
                'categoria' => $p->productoCategoria?->nombre ?? '',
                'subcategoria' => $p->productoSubcategoria?->nombre,
                'precio' => $p->precio,
                'stock' => $p->stock,
                'estado' => $p->estado,
            ];
        });

        $categorias = ProductoCategoria::query()->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('admin/products', [
            'productos' => $productos,
            'categorias' => $categorias,
            'filters' => $request->only(['search', 'categoria_id']),
        ]);
    }

    public function formulario(Producto $producto): JsonResponse
    {
        return response()->json([
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'descripcion_corta' => $producto->descripcion_corta,
            'descripcion_larga' => $producto->descripcion_larga,
            'detalle' => $producto->detalle ?? '',
            'producto_categoria_id' => $producto->producto_categoria_id,
            'producto_subcategoria_id' => $producto->producto_subcategoria_id,
            'precio_base' => (string) $producto->precio_base,
            'precio_promocional' => $producto->precio_promocional !== null ? (string) $producto->precio_promocional : '',
            'impuesto' => $producto->impuesto !== null ? (string) $producto->impuesto : '',
            'codigo' => $producto->codigo,
            'stock' => $producto->stock,
            'imagen' => $producto->imagen ?? '',
            'peso' => $producto->peso ?? '',
            'dimensiones' => $producto->dimensiones ?? '',
            'estado' => $producto->estado,
            'variantes' => $producto->variantes,
            'galeria' => $producto->galeria,
        ]);
    }

    public function store(StoreProductoRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['slug'] = Str::slug($data['nombre']).'-'.Str::random(5);

            Producto::query()->create($data);

            return redirect()->route('admin.productos')->with('success', 'Producto creado exitosamente.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo crear el producto. Inténtalo de nuevo.');
        }
    }

    public function update(UpdateProductoRequest $request, Producto $producto): RedirectResponse
    {
        try {
            $producto->update($request->validated());

            return redirect()->route('admin.productos')->with('success', 'Producto actualizado exitosamente.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo actualizar el producto. Inténtalo de nuevo.');
        }
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        try {
            $producto->delete();

            return redirect()->route('admin.productos')->with('success', 'Producto eliminado exitosamente.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo eliminar el producto. Inténtalo de nuevo.');
        }
    }

    public function duplicate(Producto $producto): RedirectResponse
    {
        try {
            $copy = $producto->replicate();
            $copy->nombre = $producto->nombre.' (Copia)';
            $copy->slug = Str::slug($copy->nombre).'-'.Str::random(5);
            $copy->codigo = $producto->codigo.'-'.Str::random(4);
            $copy->estado = 'pausado';
            $copy->save();

            return redirect()->route('admin.productos')->with('success', 'Producto duplicado exitosamente.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo duplicar el producto. Inténtalo de nuevo.');
        }
    }

    public function toggleStatus(Producto $producto): RedirectResponse
    {
        try {
            $producto->update([
                'estado' => $producto->estado === 'activo' ? 'pausado' : 'activo',
            ]);

            return redirect()->route('admin.productos')->with('success', 'Estado actualizado.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo actualizar el estado.');
        }
    }

    public function ajustarStock(AjustarStockRequest $request, Producto $producto): RedirectResponse
    {
        try {
            $producto->update(['stock' => $request->validated('stock')]);

            return redirect()->route('admin.productos')->with('success', 'Stock actualizado.');
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo actualizar el stock.');
        }
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        $filters = $request->only(['search', 'categoria_id']);
        $fileName = 'productos_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(ProductosExport::class, $filters, $fileName);
    }
}
