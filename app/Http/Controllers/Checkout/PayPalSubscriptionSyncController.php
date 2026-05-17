<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Checkout\SyncPayPalSubscriptionRequest;
use App\Mail\Checkout\SubscriptionActivatedMail;
use App\Models\PasarelaEvento;
use App\Models\Suscripcion;
use App\Services\PasarelaEventoRecorder;
use App\Services\PayPalService;
use App\Support\SuscripcionPayPalActivationSync;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class PayPalSubscriptionSyncController extends Controller
{
    public function __invoke(SyncPayPalSubscriptionRequest $request, PayPalService $payPal): JsonResponse
    {
        if (! config('paypal.enabled')) {
            return response()->json([
                'message' => 'PayPal no está configurado.',
            ], 503);
        }

        $user = $request->user();
        $subscriptionId = $request->validated('subscription_id');

        $suscripcion = Suscripcion::query()
            ->where('user_id', $user->id)
            ->where('paypal_subscription_id', $subscriptionId)
            ->first();

        if ($suscripcion === null) {
            return response()->json([
                'message' => 'No encontramos esta suscripción en tu cuenta.',
            ], 404);
        }

        try {
            $remote = $payPal->getSubscription($subscriptionId);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'No se pudo consultar la suscripción en PayPal.',
                'detail' => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
            ], 502);
        }

        $status = strtoupper((string) ($remote['status'] ?? ''));
        if ($status !== 'ACTIVE') {
            return response()->json([
                'message' => 'PayPal aún no marca la suscripción como activa. Si acabas de pagar, espera unos segundos o revisa el webhook.',
                'paypal_status' => $remote['status'] ?? null,
            ], 422);
        }

        $sendMail = SuscripcionPayPalActivationSync::applyFromActivatedResource($suscripcion, $remote);

        PasarelaEventoRecorder::recordOrFetchByPayPalEventId(
            'sync-'.$subscriptionId,
            'BILLING.SUBSCRIPTION.ACTIVATED',
            PasarelaEvento::ESTADO_COMPLETADO,
            $remote,
            null,
            null,
            $suscripcion->id,
        );

        $suscripcion->refresh();

        $owner = $suscripcion->user;
        if ($sendMail && $owner !== null && $owner->email !== null && $owner->email !== '') {
            $suscripcion->loadMissing('historia');
            Mail::to($owner->email)->send(new SubscriptionActivatedMail($suscripcion));
        }

        return response()->json([
            'status' => 'ok',
            'estado' => $suscripcion->estado,
        ]);
    }
}
