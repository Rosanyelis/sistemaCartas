<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAudioRequest;
use App\Http\Requests\Admin\UpdateAudioRequest;
use App\Models\Audio;
use App\Models\Historia;
use App\Services\Audio\AudioQrGeneratorService;
use App\Services\Audio\AudioStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class AudioController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Audio::class);

        $filters = $request->only(['search']);

        $audios = Audio::query()
            ->adminFilters($filters)
            ->with('historia:id,nombre')
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (Audio $audio) {
                return [
                    'id' => $audio->id,
                    'titulo' => $audio->titulo,
                    'slug' => $audio->slug,
                    'codigo' => $audio->codigo,
                    'historia_id' => $audio->historia_id,
                    'historia_nombre' => $audio->historia?->nombre ?? '',
                    'estado' => $audio->estado,
                    'qr_path' => $audio->qr_path,
                    'public_url' => $audio->publicUrl(),
                    'created_at' => $audio->created_at?->format('d/m/Y'),
                ];
            });

        $historias = Historia::query()
            ->where('estado', 'activo')
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'imagen', 'codigo', 'descripcion_corta', 'estado']);

        return Inertia::render('admin/audios', [
            'audios' => $audios,
            'historias' => $historias,
            'filters' => $filters,
        ]);
    }

    public function store(
        StoreAudioRequest $request,
        AudioStorageService $audioStorage,
        AudioQrGeneratorService $qrGenerator,
    ): RedirectResponse {
        Gate::authorize('create', Audio::class);

        try {
            return DB::transaction(function () use ($request, $audioStorage, $qrGenerator) {
                $data = $request->validated();
                unset($data['audio']);

                $data['slug'] = Str::slug($data['titulo']).'-'.Str::random(6);

                $audio = Audio::query()->create($data);

                $stored = $audioStorage->store($request->file('audio'), $audio);

                $audio->update([
                    'audio_path' => $stored['path'],
                    'mime_type' => $stored['mime_type'],
                    'tamano_bytes' => $stored['tamano_bytes'],
                ]);

                $qrPath = $qrGenerator->generate($audio);
                $audio->update(['qr_path' => $qrPath]);

                return redirect()
                    ->route('admin.audios')
                    ->with('success', 'Audio creado correctamente.');
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo crear el audio. Inténtalo de nuevo.');
        }
    }

    public function update(
        UpdateAudioRequest $request,
        Audio $audio,
        AudioStorageService $audioStorage,
        AudioQrGeneratorService $qrGenerator,
    ): RedirectResponse {
        Gate::authorize('update', $audio);

        try {
            return DB::transaction(function () use ($request, $audio, $audioStorage, $qrGenerator) {
                $data = $request->validated();
                $oldSlug = $audio->slug;
                $oldQrPath = $audio->qr_path;

                if ($request->hasFile('audio')) {
                    $audioStorage->delete($audio->audio_path);
                    $stored = $audioStorage->store($request->file('audio'), $audio);
                    $data['audio_path'] = $stored['path'];
                    $data['mime_type'] = $stored['mime_type'];
                    $data['tamano_bytes'] = $stored['tamano_bytes'];
                }

                unset($data['audio']);

                $audio->update($data);

                if ($oldSlug !== $audio->slug || $oldQrPath === null) {
                    $qrGenerator->delete($oldQrPath);
                    $qrPath = $qrGenerator->generate($audio);
                    $audio->update(['qr_path' => $qrPath]);
                }

                return redirect()
                    ->route('admin.audios')
                    ->with('success', 'Audio actualizado correctamente.');
            });
        } catch (Throwable $e) {
            report($e);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'No se pudo actualizar el audio. Inténtalo de nuevo.');
        }
    }

    public function destroy(
        Audio $audio,
        AudioStorageService $audioStorage,
        AudioQrGeneratorService $qrGenerator,
    ): RedirectResponse {
        Gate::authorize('delete', $audio);

        $audioStorage->delete($audio->audio_path);
        $qrGenerator->delete($audio->qr_path);
        $audio->delete();

        return redirect()
            ->route('admin.audios')
            ->with('success', 'Audio eliminado correctamente.');
    }

    public function downloadQr(Audio $audio): StreamedResponse
    {
        Gate::authorize('view', $audio);

        if ($audio->qr_path === null) {
            abort(404);
        }

        $relative = str_replace('/storage/', '', $audio->qr_path);

        if (! Storage::disk('public')->exists($relative)) {
            abort(404);
        }

        return Storage::disk('public')->download(
            $relative,
            'qr-'.$audio->slug.'.png',
            ['Content-Type' => 'image/png'],
        );
    }
}
