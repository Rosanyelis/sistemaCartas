<?php

namespace App\Http\Controllers\Admin;

use App\Enums\HistoriaVarianteTipo;
use App\Exceptions\MediaCompressionException;
use App\Exports\Admin\HistoriasExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHistoriaRequest;
use App\Http\Requests\Admin\UpdateHistoriaRequest;
use App\Models\Historia;
use App\Models\HistoriaCategoria;
use App\Services\Admin\ExportService;
use App\Services\Media\HistoriaVideoStorageService;
use App\Services\Media\WebpImageStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class HistoriaController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Historia::class);

        $filters = $request->only(['search', 'categoria_id', 'start_date', 'end_date']);

        $historias = Historia::query()
            ->adminFilters($filters)
            ->latest()
            ->with(['galeria', 'variantes', 'historiaCategoria'])
            ->paginate(10)
            ->withQueryString()
            ->through(function (Historia $historia) {
                return array_merge($historia->toArray(), [
                    'categoria' => $historia->historiaCategoria?->nombre ?? '',
                    'historia_categoria_id' => $historia->historia_categoria_id,
                ]);
            });

        $categorias = HistoriaCategoria::query()->orderBy('nombre')->get(['id', 'nombre']);

        return Inertia::render('admin/stories', [
            'historias' => $historias,
            'categorias' => $categorias,
            'filters' => $filters,
        ]);
    }

    public function store(
        StoreHistoriaRequest $request,
        WebpImageStorageService $webpStorage,
        HistoriaVideoStorageService $videoStorage,
    ): RedirectResponse {
        Gate::authorize('create', Historia::class);

        try {
            return DB::transaction(function () use ($request, $webpStorage, $videoStorage) {
                $data = $request->validated();
                unset($data['galeria']);
                $data['slug'] = Str::slug($data['nombre']).'-'.Str::random(5);

                if (empty($data['fecha_publicacion'])) {
                    $data['fecha_publicacion'] = now();
                }

                if ($request->hasFile('imagen')) {
                    $data['imagen'] = $webpStorage->store($request->file('imagen'), 'historias/imagenes');
                }

                if ($request->hasFile('video')) {
                    $data['video'] = $videoStorage->store($request->file('video'), 'historias/videos');
                }

                $historia = Historia::query()->create($data);

                if (! empty($data['variantes'])) {
                    foreach ($data['variantes'] as $variante) {
                        if (! is_array($variante)) {
                            continue;
                        }
                        $historia->variantes()->create($this->normalizarVarianteHistoria($variante));
                    }
                }

                if ($request->hasFile('galeria')) {
                    foreach ($request->file('galeria') as $imageFile) {
                        $pt = $webpStorage->store($imageFile, 'historias/galeria');
                        $historia->galeria()->create([
                            'path' => $pt,
                            'tipo' => 'imagen',
                            'es_principal' => false,
                        ]);
                    }
                }

                if (isset($data['imagen'])) {
                    $historia->galeria()->create([
                        'path' => $data['imagen'],
                        'tipo' => 'imagen',
                        'es_principal' => true,
                    ]);
                }

                return redirect()->route('admin.historias')->with('success', 'Historia creada exitosamente.');
            });
        } catch (MediaCompressionException $e) {
            return back()->withErrors($this->mediaCompressionErrors($request, $e))->withInput();
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route('admin.historias')->with('error', 'No se pudo crear la historia. Inténtalo de nuevo.');
        }
    }

    public function update(
        UpdateHistoriaRequest $request,
        Historia $historia,
        WebpImageStorageService $webpStorage,
        HistoriaVideoStorageService $videoStorage,
    ): RedirectResponse {
        Gate::authorize('update', $historia);

        try {
            return DB::transaction(function () use ($request, $historia, $webpStorage, $videoStorage) {
                $data = $request->validated();
                $syncGallery = $request->boolean('historia_gallery_sync');
                $keepIds = collect($data['galeria_keep_ids'] ?? [])
                    ->map(fn ($id) => (int) $id)
                    ->unique()
                    ->values()
                    ->all();

                unset($data['galeria'], $data['galeria_keep_ids'], $data['historia_gallery_sync']);

                if ($request->hasFile('imagen')) {
                    if ($historia->imagen) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $historia->imagen));
                    }
                    $data['imagen'] = $webpStorage->store($request->file('imagen'), 'historias/imagenes');
                }

                if ($request->hasFile('video')) {
                    if ($historia->video) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $historia->video));
                    }
                    $data['video'] = $videoStorage->store($request->file('video'), 'historias/videos');
                }

                // Sin archivo nuevo: no pisar columnas (multipart suele mandar `imagen`/`video` como null validados).
                if (! $request->hasFile('imagen')) {
                    unset($data['imagen']);
                }
                if (! $request->hasFile('video')) {
                    unset($data['video']);
                }

                $historia->update($data);

                // Sincronizar variantes (Simple: borrar y crear nuevas)
                if ($request->has('variantes')) {
                    $historia->variantes()->delete();
                    if (! empty($data['variantes'])) {
                        foreach ($data['variantes'] as $variante) {
                            if (! is_array($variante)) {
                                continue;
                            }
                            $historia->variantes()->create($this->normalizarVarianteHistoria($variante));
                        }
                    }
                }

                // Galería adicional: conservar por id o reemplazo legacy (solo archivos nuevos sin bandera)
                if ($syncGallery) {
                    foreach ($historia->galeria()->where('es_principal', false)->whereNotIn('id', $keepIds)->get() as $old) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $old->path));
                        $old->delete();
                    }
                } elseif ($request->hasFile('galeria')) {
                    $oldImages = $historia->galeria()->where('es_principal', false)->get();
                    foreach ($oldImages as $old) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $old->path));
                    }
                    $historia->galeria()->where('es_principal', false)->delete();
                }

                if ($request->hasFile('galeria')) {
                    foreach ($request->file('galeria') as $imageFile) {
                        $pt = $webpStorage->store($imageFile, 'historias/galeria');
                        $historia->galeria()->create([
                            'path' => $pt,
                            'tipo' => 'imagen',
                            'es_principal' => false,
                        ]);
                    }
                }

                // Si cambió la imagen principal, actualizar el registro 'es_principal' en la galería
                if ($request->hasFile('imagen')) {
                    $historia->galeria()->where('es_principal', true)->delete();
                    $historia->galeria()->create([
                        'path' => $data['imagen'], // El path ya se calculó arriba
                        'tipo' => 'imagen',
                        'es_principal' => true,
                    ]);
                }

                return redirect()->route('admin.historias')->with('success', 'Historia actualizada exitosamente.');
            });
        } catch (MediaCompressionException $e) {
            return back()->withErrors($this->mediaCompressionErrors($request, $e))->withInput();
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route('admin.historias')->with('error', 'No se pudo actualizar la historia. Inténtalo de nuevo.');
        }
    }

    public function destroy(Historia $historia): RedirectResponse
    {
        Gate::authorize('delete', $historia);

        try {
            $historia->delete();

            return redirect()->route('admin.historias')->with('success', 'Historia eliminada exitosamente.');
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route('admin.historias')->with('error', 'No se pudo eliminar la historia. Inténtalo de nuevo.');
        }
    }

    public function duplicate(Historia $historia): RedirectResponse
    {
        Gate::authorize('duplicate', $historia);

        try {
            return DB::transaction(function () use ($historia) {
                $historia->load([
                    'galeria' => fn ($q) => $q->orderBy('id'),
                    'variantes',
                ]);

                $copy = $historia->replicate();
                $copy->nombre = $historia->nombre.' (Copia)';
                $copy->slug = Str::slug($copy->nombre).'-'.Str::random(5);
                $copy->codigo = $historia->codigo.'-'.Str::random(4);
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

                if ($historia->imagen) {
                    $copy->imagen = $resolverRuta($historia->imagen) ?? $historia->imagen;
                }
                if ($historia->video) {
                    $copy->video = $resolverRuta($historia->video) ?? $historia->video;
                }
                $copy->save();

                foreach ($historia->galeria as $item) {
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

                foreach ($historia->variantes as $variante) {
                    $copy->variantes()->create([
                        'tipo' => $variante->tipo,
                        'valor' => $variante->valor,
                    ]);
                }

                return redirect()->route('admin.historias')->with('success', 'Historia duplicada exitosamente.');
            });
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route('admin.historias')->with('error', 'No se pudo duplicar la historia. Inténtalo de nuevo.');
        }
    }

    /**
     * @param  array<string, mixed>  $variante
     * @return array<string, mixed>
     */
    private function normalizarVarianteHistoria(array $variante): array
    {
        $rawTipo = strtolower(trim((string) ($variante['tipo'] ?? '')));
        $tipo = HistoriaVarianteTipo::tryFrom($rawTipo) ?? HistoriaVarianteTipo::Papel;
        $valor = trim((string) ($variante['valor'] ?? ''));

        return [
            'tipo' => $tipo,
            'valor' => $valor,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function mediaCompressionErrors(Request $request, MediaCompressionException $exception): array
    {
        $errors = [];

        if ($request->hasFile('video')) {
            $errors['video'] = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : 'No se pudo procesar el video. Usa MP4 o MOV válido.';
        }

        if ($request->hasFile('imagen') || $request->hasFile('galeria')) {
            $errors['imagen'] = 'No se pudo procesar la imagen.';
        }

        if ($errors === []) {
            $errors['imagen'] = $exception->getMessage() !== ''
                ? $exception->getMessage()
                : 'No se pudo procesar el archivo multimedia.';
        }

        return $errors;
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

    public function toggleStatus(Historia $historia): RedirectResponse
    {
        Gate::authorize('toggleStatus', $historia);

        $historia->update([
            'estado' => $historia->estado === 'activo' ? 'pausado' : 'activo',
        ]);

        return redirect()->route('admin.historias')->with('success', 'Estado actualizado.');
    }

    public function export(Request $request, ExportService $exportService): BinaryFileResponse
    {
        Gate::authorize('viewAny', Historia::class);

        $filters = $request->only(['search', 'categoria_id', 'start_date', 'end_date']);
        $fileName = 'historias_'.now()->format('Y_m_d_His').'.xlsx';

        return $exportService->export(HistoriasExport::class, $filters, $fileName);
    }
}
