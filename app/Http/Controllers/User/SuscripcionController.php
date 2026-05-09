<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Suscripcion;
use App\Services\PayPalService;
use App\Support\SuscripcionUsuarioListaSerializer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class SuscripcionController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();
        $suscripciones = Suscripcion::query()
            ->where('user_id', $userId)
            ->with(['historia' => fn ($q) => $q->select('id', 'nombre')])
            ->latest('fecha_adquisicion')
            ->latest('id')
            ->get()
            ->map(fn (Suscripcion $s) => SuscripcionUsuarioListaSerializer::fila($s))
            ->values()
            ->all();

        return Inertia::render('user/subscriptions', [
            'suscripciones' => $suscripciones,
        ]);
    }

    /**
     * Cancela una suscripción activa del usuario (PayPal en remoto si aplica).
     */
    public function cancel(Request $request, Suscripcion $suscripcion, PayPalService $payPal): RedirectResponse
    {
        abort_unless($suscripcion->user_id === $request->user()?->id, 403);

        if ($suscripcion->estado !== 'activa') {
            return back()->withErrors([
                'subscription' => 'Esta suscripción no se puede dar de baja en su estado actual.',
            ]);
        }

        $tipo = (string) $suscripcion->tipo;
        $paypalSubId = $suscripcion->paypal_subscription_id;

        if ($tipo === 'PayPal') {
            if (! is_string($paypalSubId) || $paypalSubId === '') {
                return back()->withErrors([
                    'subscription' => 'Esta suscripción PayPal no tiene identificador remoto; contacta soporte.',
                ]);
            }

            if (! config('paypal.enabled')) {
                return back()->withErrors([
                    'subscription' => 'PayPal no está configurado en este momento.',
                ]);
            }

            try {
                DB::transaction(function () use ($suscripcion, $payPal, $paypalSubId): void {
                    $payPal->cancelBillingSubscription($paypalSubId);
                    $prev = $suscripcion->paypal_last_payload;
                    $base = is_array($prev) ? $prev : [];
                    $suscripcion->update([
                        'estado' => 'inactiva',
                        'paypal_last_payload' => array_merge($base, [
                            'cancelled_at_client' => now()->toIso8601String(),
                        ]),
                    ]);
                });
            } catch (RequestException $e) {
                report($e);

                return back()->withErrors([
                    'subscription' => 'PayPal no pudo cancelar la suscripción. Inténtalo más tarde o revisa tu cuenta PayPal.',
                ]);
            } catch (Throwable $e) {
                report($e);

                return back()->withErrors([
                    'subscription' => 'No se pudo completar la baja de la suscripción.',
                ]);
            }
        } else {
            $suscripcion->update(['estado' => 'inactiva']);
        }

        return redirect()->route('user.subscriptions')->with('success', 'Suscripción dada de baja correctamente.');
    }
}
