<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Historia;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoriaController extends Controller
{
    /**
     * Listado paginado de historias activas para la tienda + destacadas para el carrusel.
     */
    public function index(Request $request): Response
    {
        $perPage = max(1, (int) config('historias.tienda_per_page', 6));
        $maxDestacadas = max(1, (int) config('historias.tienda_destacadas_max', 10));

        $listado = $this->baseTienda($request)
            ->latest('fecha_publicacion')
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();

        $listado->setCollection(
            $listado->getCollection()->map(fn (Historia $h) => HistoriaCatalogoSerializer::tarjeta($h)),
        );

        $destacadas = $this->baseTienda($request)
            ->where('destacada', 'si')
            ->latest('fecha_publicacion')
            ->latest('id')
            ->limit($maxDestacadas)
            ->get()
            ->map(fn (Historia $h) => HistoriaCatalogoSerializer::tarjeta($h))
            ->values()
            ->all();

        return Inertia::render('user/historias', [
            'historias' => $listado,
            'destacadas' => $destacadas,
            'categorias' => $this->categoriasParaFiltro(),
            'filters' => [
                'categoria' => $request->query('categoria', 'Todas'),
                'search' => $request->string('search')->toString(),
            ],
        ]);
    }

    /**
     * Ficha pública de una historia activa.
     */
    public function show(string $slug): Response
    {
        $historia = Historia::query()
            ->where('slug', $slug)
            ->where('estado', 'activo')
            ->with([
                'galeria' => fn ($q) => $q->orderBy('id'),
                'variantes' => fn ($q) => $q->orderBy('id'),
            ])
            ->firstOrFail();

        return Inertia::render('user/detalles-historia', [
            'historia' => HistoriaCatalogoSerializer::detallePublico($historia),
        ]);
    }

    /**
     * Historias visibles en tienda: activas y no eliminadas (SoftDeletes).
     *
     * @return Builder<Historia>
     */
    private function baseTienda(Request $request): Builder
    {
        $query = Historia::query()->where('estado', 'activo');

        $categoria = $request->query('categoria');
        if (is_string($categoria) && $categoria !== '' && $categoria !== 'Todas') {
            $query->where('categoria', $categoria);
        }

        if ($request->filled('search')) {
            $raw = $request->string('search')->toString();
            $term = '%'.addcslashes($raw, '%_\\').'%';
            $query->where(function (Builder $q) use ($term): void {
                $q->where('nombre', 'like', $term)
                    ->orWhere('descripcion_corta', 'like', $term);
            });
        }

        return $query;
    }

    /**
     * @return list<string>
     */
    private function categoriasParaFiltro(): array
    {
        $existentes = Historia::query()
            ->where('estado', 'activo')
            ->distinct()
            ->orderBy('categoria')
            ->pluck('categoria')
            ->filter(fn ($c) => is_string($c) && $c !== '')
            ->values()
            ->all();

        return array_values(array_unique(array_merge(['Todas'], $existentes)));
    }
}
