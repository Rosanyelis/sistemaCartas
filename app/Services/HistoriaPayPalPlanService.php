<?php

namespace App\Services;

use App\Models\Historia;
use App\Support\HistoriaSuscripcionPrecio;
use Illuminate\Support\Facades\DB;

final class HistoriaPayPalPlanService
{
    public function __construct(private PayPalService $payPal) {}

    /**
     * Devuelve un `plan_id` de PayPal activo coherente con precio e intervalo de la historia.
     */
    public function ensureBillingPlanForHistoria(Historia $historia): string
    {
        $amount = HistoriaSuscripcionPrecio::montoPorCiclo($historia);
        $interval = HistoriaSuscripcionPrecio::intervaloMeses($historia);
        $currency = strtoupper((string) config('paypal.currency'));

        if (
            $historia->paypal_plan_id !== null
            && $historia->paypal_plan_id !== ''
            && $historia->paypal_plan_amount !== null
            && $historia->paypal_plan_interval_meses !== null
            && round((float) $historia->paypal_plan_amount, 2) === $amount
            && (int) $historia->paypal_plan_interval_meses === $interval
        ) {
            return (string) $historia->paypal_plan_id;
        }

        return DB::transaction(function () use ($historia, $currency): string {
            /** @var Historia $locked */
            $locked = Historia::query()->whereKey($historia->id)->lockForUpdate()->firstOrFail();

            $amountLocked = HistoriaSuscripcionPrecio::montoPorCiclo($locked);
            $intervalLocked = HistoriaSuscripcionPrecio::intervaloMeses($locked);

            if (
                $locked->paypal_plan_id !== null
                && $locked->paypal_plan_id !== ''
                && $locked->paypal_plan_amount !== null
                && $locked->paypal_plan_interval_meses !== null
                && round((float) $locked->paypal_plan_amount, 2) === $amountLocked
                && (int) $locked->paypal_plan_interval_meses === $intervalLocked
            ) {
                return (string) $locked->paypal_plan_id;
            }

            $productId = $locked->paypal_product_id;
            if (! is_string($productId) || $productId === '') {
                $productId = $this->payPal->createCatalogProduct(
                    'Suscripción: '.$locked->nombre,
                    'Historia por correo — '.$locked->slug,
                );
            }

            $planName = 'Plan '.$locked->slug.' — '.$intervalLocked.'m';
            $planId = $this->payPal->createAndActivateBillingPlan(
                $productId,
                $planName,
                'Facturación cada '.$intervalLocked.' mes(es)',
                $amountLocked,
                $currency,
                $intervalLocked,
            );

            $locked->update([
                'paypal_product_id' => $productId,
                'paypal_plan_id' => $planId,
                'paypal_plan_amount' => $amountLocked,
                'paypal_plan_interval_meses' => $intervalLocked,
            ]);

            return $planId;
        });
    }
}
