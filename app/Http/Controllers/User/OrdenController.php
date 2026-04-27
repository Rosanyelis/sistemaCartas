<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Support\Store\ClientePedidoLinea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrdenController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = StoreOrderItem::query()
            ->select('store_order_items.*')
            ->join('store_orders', 'store_order_items.store_order_id', '=', 'store_orders.id')
            ->where('store_orders.user_id', $user->id)
            // Solo resultados con pago concluido o intento fallido; no intenciones aún en PayPal.
            ->whereIn('store_orders.status', [
                StoreOrder::STATUS_PAID,
                StoreOrder::STATUS_CAPTURE_FAILED,
            ])
            ->with(['storeOrder']);

        if ($request->filled('search')) {
            $s = $request->string('search')->trim();
            if ($s !== '') {
                $query->where(function ($q) use ($s) {
                    $q->where('store_order_items.product_name', 'like', "%{$s}%");
                    if (is_numeric($s)) {
                        $q->orWhere('store_orders.id', (int) $s);
                    }
                    $raw = ltrim($s, '#');
                    if ($raw !== '' && ctype_digit($raw)) {
                        $q->orWhere('store_orders.id', (int) $raw);
                    }
                });
            }
        }

        if ($request->filled('start_date')) {
            $query->whereDate('store_orders.created_at', '>=', $request->date('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('store_orders.created_at', '<=', $request->date('end_date'));
        }

        $paginator = $query
            ->orderByDesc('store_orders.created_at')
            ->orderByDesc('store_order_items.id')
            ->paginate(10)
            ->withQueryString();

        $slugs = $paginator->getCollection()
            ->pluck('product_slug')
            ->unique()
            ->filter()
            ->values();

        $imagenesPorSlug = $slugs->isEmpty()
            ? collect()
            : Producto::query()
                ->whereIn('slug', $slugs->all())
                ->pluck('imagen', 'slug');

        $paginator->getCollection()->transform(
            function (StoreOrderItem $item) use ($imagenesPorSlug) {
                $img = $imagenesPorSlug->get($item->product_slug);

                return ClientePedidoLinea::toArray($item, is_string($img) ? $img : null);
            }
        );

        return Inertia::render('user/orders', [
            'ordenes' => $paginator,
            'filters' => [
                'search' => $request->input('search') ? (string) $request->input('search') : null,
                'start_date' => $request->input('start_date') ? (string) $request->input('start_date') : null,
                'end_date' => $request->input('end_date') ? (string) $request->input('end_date') : null,
            ],
        ]);
    }
}
