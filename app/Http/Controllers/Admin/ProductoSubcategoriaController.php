<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductoSubcategoriaRequest;
use App\Models\ProductoSubcategoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoSubcategoriaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'producto_categoria_id' => ['required', 'integer', 'exists:producto_categorias,id'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:200'],
        ]);

        $perPage = max(1, min(200, (int) ($validated['per_page'] ?? 10)));

        $paginator = ProductoSubcategoria::query()
            ->where('producto_categoria_id', $validated['producto_categoria_id'])
            ->withCount('productos')
            ->orderBy('nombre')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($paginator);
    }

    public function store(StoreProductoSubcategoriaRequest $request): JsonResponse
    {
        $sub = ProductoSubcategoria::query()->create($request->validated());

        return response()->json([
            'id' => $sub->id,
            'nombre' => $sub->nombre,
            'producto_categoria_id' => $sub->producto_categoria_id,
        ], 201);
    }

    public function destroy(ProductoSubcategoria $productoSubcategoria): JsonResponse
    {
        if ($productoSubcategoria->productos()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la subcategoría porque tiene productos asociados.',
            ], 422);
        }

        $productoSubcategoria->delete();

        return response()->json(null, 204);
    }
}
