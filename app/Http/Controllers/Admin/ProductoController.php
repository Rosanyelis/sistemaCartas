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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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
        $producto->load(['galeria' => fn ($q) => $q->orderBy('id')]);

        return response()->json([
            'id' => $producto->id,
            'nombre' => $producto->nombre,
            'descripcion_corta' => $producto->descripcion_corta,
            'descripcion_larga' => $producto->descripcion_larga,
            'detalle' => $producto->detalle ?? [],
            'producto_categoria_id' => $producto->producto_categoria_id,
            'producto_subcategoria_id' => $producto->producto_subcategoria_id,
            'precio_base' => (string) $producto->precio_base,
            'precio_promocional' => $producto->precio_promocional !== null ? (string) $producto->precio_promocional : '',
            'impuesto' => $producto->impuesto !== null ? (string) $producto->impuesto : '',
            'codigo' => $producto->codigo,
            'stock' => $producto->stock,
            'imagen' => $producto->imagen ?? '',
            'video' => $producto->video ?? '',
            'peso' => $producto->peso ?? '',
            'dimensiones' => $producto->dimensiones ?? '',
            'estado' => $producto->estado,
            'galeria' => $producto->galeria->map(fn ($g) => [
                'id' => $g->id,
                'path' => $g->path,
                'tipo' => $g->tipo,
                'es_principal' => $g->es_principal,
            ])->values()->all(),
        ]);
    }

    public function store(StoreProductoRequest $request): RedirectResponse
    {
        try {
            return DB::transaction(function () use ($request) {
                $data = $request->validated();
                unset($data['galeria']);
                $data['slug'] = Str::slug($data['nombre']).'-'.Str::random(5);

                if ($request->hasFile('imagen')) {
                    $data['imagen'] = '/storage/'.$request->file('imagen')->store('productos/imagenes', 'public');
                }

                if ($request->hasFile('video')) {
                    $data['video'] = '/storage/'.$request->file('video')->store('productos/videos', 'public');
                }

                $producto = Producto::query()->create($data);

                if ($request->hasFile('galeria')) {
                    foreach ($request->file('galeria') as $imageFile) {
                        $pt = '/storage/'.$imageFile->store('productos/galeria', 'public');
                        $producto->galeria()->create([
                            'path' => $pt,
                            'tipo' => 'imagen',
                            'es_principal' => false,
                        ]);
                    }
                }

                if (isset($data['imagen'])) {
                    $producto->galeria()->create([
                        'path' => $data['imagen'],
                        'tipo' => 'imagen',
                        'es_principal' => true,
                    ]);
                }

                return redirect()->route('admin.productos')->with('success', 'Producto creado exitosamente.');
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo crear el producto. Inténtalo de nuevo.');
        }
    }

    public function update(UpdateProductoRequest $request, Producto $producto): RedirectResponse
    {
        try {
            return DB::transaction(function () use ($request, $producto) {
                $data = $request->validated();
                $syncGallery = $request->boolean('producto_gallery_sync');
                $keepIds = collect($data['galeria_keep_ids'] ?? [])
                    ->map(fn ($id) => (int) $id)
                    ->unique()
                    ->values()
                    ->all();

                unset($data['galeria'], $data['galeria_keep_ids'], $data['producto_gallery_sync']);

                if ($request->hasFile('imagen')) {
                    if ($producto->imagen) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $producto->imagen));
                    }
                    $data['imagen'] = '/storage/'.$request->file('imagen')->store('productos/imagenes', 'public');
                }

                if ($request->hasFile('video')) {
                    if ($producto->video) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $producto->video));
                    }
                    $data['video'] = '/storage/'.$request->file('video')->store('productos/videos', 'public');
                }

                if (! $request->hasFile('imagen')) {
                    unset($data['imagen']);
                }
                if (! $request->hasFile('video')) {
                    unset($data['video']);
                }

                $producto->update($data);

                if ($syncGallery) {
                    foreach ($producto->galeria()->where('es_principal', false)->whereNotIn('id', $keepIds)->get() as $old) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $old->path));
                        $old->delete();
                    }
                } elseif ($request->hasFile('galeria')) {
                    $oldImages = $producto->galeria()->where('es_principal', false)->get();
                    foreach ($oldImages as $old) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $old->path));
                    }
                    $producto->galeria()->where('es_principal', false)->delete();
                }

                if ($request->hasFile('galeria')) {
                    foreach ($request->file('galeria') as $imageFile) {
                        $pt = '/storage/'.$imageFile->store('productos/galeria', 'public');
                        $producto->galeria()->create([
                            'path' => $pt,
                            'tipo' => 'imagen',
                            'es_principal' => false,
                        ]);
                    }
                }

                if ($request->hasFile('imagen')) {
                    $producto->galeria()->where('es_principal', true)->delete();
                    $producto->galeria()->create([
                        'path' => $data['imagen'],
                        'tipo' => 'imagen',
                        'es_principal' => true,
                    ]);
                }

                return redirect()->route('admin.productos')->with('success', 'Producto actualizado exitosamente.');
            });
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
            return DB::transaction(function () use ($producto) {
                $producto->load([
                    'galeria' => fn ($q) => $q->orderBy('id'),
                ]);

                $copy = $producto->replicate();
                $copy->nombre = $producto->nombre.' (Copia)';
                $copy->slug = Str::slug($copy->nombre).'-'.Str::random(5);
                $copy->codigo = $producto->codigo.'-'.Str::random(4);
                $copy->estado = 'pausado';
                $copy->save();

                /** @var array<string, ?string> $rutasPublicasAntiguasANuevas */
                $rutasPublicasAntiguasANuevas = [];
                $resolverRuta = function (?string $rutaPublica) use (&$rutasPublicasAntiguasANuevas): ?string {
                    if ($rutaPublica === null || $rutaPublica === '') {
                        return null;
                    }
                    if (array_key_exists($rutaPublica, $rutasPublicasAntiguasANuevas)) {
                        return $rutasPublicasAntiguasANuevas[$rutaPublica];
                    }
                    $nueva = $this->copiarArchivoDesdeRutaPublicaStorage($rutaPublica);
                    $rutasPublicasAntiguasANuevas[$rutaPublica] = $nueva;

                    return $nueva;
                };

                if ($producto->imagen) {
                    $copy->imagen = $resolverRuta($producto->imagen) ?? $producto->imagen;
                }
                if ($producto->video) {
                    $copy->video = $resolverRuta($producto->video) ?? $producto->video;
                }
                $copy->save();

                foreach ($producto->galeria as $item) {
                    $nuevaRuta = $resolverRuta($item->path);
                    if ($nuevaRuta === null) {
                        continue;
                    }
                    $copy->galeria()->create([
                        'path' => $nuevaRuta,
                        'tipo' => $item->tipo,
                        'es_principal' => $item->es_principal,
                    ]);
                }

                return redirect()->route('admin.productos')->with('success', 'Producto duplicado exitosamente.');
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()->route('admin.productos')->with('error', 'No se pudo duplicar el producto. Inténtalo de nuevo.');
        }
    }

    /**
     * Copia un fichero existente en el disco `public` y devuelve la nueva URL bajo `/storage/...`.
     */
    private function copiarArchivoDesdeRutaPublicaStorage(string $rutaPublica): ?string
    {
        if (! str_starts_with($rutaPublica, '/storage/')) {
            return null;
        }

        $relativo = substr($rutaPublica, strlen('/storage/'));
        $disco = Storage::disk('public');

        if (! $disco->exists($relativo)) {
            return null;
        }

        $directorio = pathinfo($relativo, PATHINFO_DIRNAME);
        $extension = pathinfo($relativo, PATHINFO_EXTENSION);
        $sufijo = $extension !== '' ? '.'.$extension : '';
        $nombreNuevo = Str::uuid().$sufijo;
        $relativoDestino = ($directorio !== '.' && $directorio !== '') ? $directorio.'/'.$nombreNuevo : $nombreNuevo;

        $disco->copy($relativo, $relativoDestino);

        return '/storage/'.$relativoDestino;
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
