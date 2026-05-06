<?php

namespace App\Http\Middleware;

use App\Models\MetodoPagoUsuario;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'paypal' => [
                'clientId' => config('paypal.client_id'),
                'currency' => config('paypal.currency'),
                'enabled' => (bool) config('paypal.enabled'),
            ],
            'paymentMethods' => static function () use ($request): array {
                $user = $request->user();
                if ($user === null) {
                    return [];
                }

                return $user->metodosPago()
                    ->with('tipo')
                    ->orderByDesc('is_default')
                    ->orderBy('id')
                    ->get()
                    ->map(static function (MetodoPagoUsuario $m): array {
                        return [
                            'id' => $m->id,
                            'titular' => $m->titular,
                            'detalles' => $m->detalles,
                            'is_default' => (bool) $m->is_default,
                            'tipo_nombre' => $m->relationLoaded('tipo') ? ($m->tipo?->nombre) : null,
                        ];
                    })
                    ->values()
                    ->all();
            },
            // Valores simples (no closures anidadas): Inertia resuelve bien el JSON en cada visita, p. ej. tras redirect con flash.
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
        ];
    }
}
