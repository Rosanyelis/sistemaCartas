<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductoCategoriaRequest;
use App\Models\ProductoCategoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductoCategoriaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = max(1, min(50, $request->integer('per_page', 10)));

        $paginator = ProductoCategoria::query()
            ->withCount('productos')
            ->orderBy('nombre')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($paginator);
    }

    public function store(StoreProductoCategoriaRequest $request): JsonResponse
    {
        $categoria = ProductoCategoria::query()->create($request->validated());

        return response()->json([
            'id' => $categoria->id,
            'nombre' => $categoria->nombre,
        ], 201);
    }

    public function destroy(ProductoCategoria $productoCategoria): JsonResponse
    {
        if ($productoCategoria->productos()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar la categoría porque tiene productos asociados.',
            ], 422);
        }

        $productoCategoria->delete();

        return response()->json(null, 204);
    }
}
