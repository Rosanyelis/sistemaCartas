<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class PayPalService
{
    public function baseUrl(): string
    {
        return config('paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    protected function http()
    {
        return Http::timeout((int) config('paypal.timeout', 45))
            ->connectTimeout(15);
    }

    /**
     * @throws RequestException
     */
    public function getAccessToken(): string
    {
        $response = $this->http()
            ->asForm()
            ->withBasicAuth(config('paypal.client_id'), config('paypal.client_secret'))
            ->post($this->baseUrl().'/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ])
            ->throw();

        $token = $response->json('access_token');
        if (! is_string($token) || $token === '') {
            throw new RuntimeException('PayPal no devolvió access_token.');
        }

        return $token;
    }

    /**
     * Crea una orden de captura única (importe total ya validado en servidor).
     *
     * @throws RequestException
     */
    public function createOrder(string $amount, string $currencyCode): string
    {
        $token = $this->getAccessToken();

        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($this->baseUrl().'/v2/checkout/orders', [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => 'tienda_historias_correo',
                        'description' => 'Pedido catálogo — Historias por Correo',
                        'amount' => [
                            'currency_code' => strtoupper($currencyCode),
                            'value' => $amount,
                        ],
                    ],
                ],
            ])
            ->throw();

        $id = $response->json('id');
        if (! is_string($id) || $id === '') {
            throw new RuntimeException('PayPal no devolvió id de orden.');
        }

        return $id;
    }

    /**
     * PayPal exige POST con cuerpo JSON `{}` (objeto vacío), no `[]`.
     *
     * @return array<string, mixed>
     *
     * @throws RequestException
     */
    public function captureOrder(string $orderId): array
    {
        $token = $this->getAccessToken();
        $pathId = rawurlencode($orderId);
        $url = $this->baseUrl().'/v2/checkout/orders/'.$pathId.'/capture';

        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($url, (object) []);

        if ($response->failed()) {
            Log::warning('PayPal capture HTTP error', [
                'order_id' => $orderId,
                'status' => $response->status(),
                'body' => $response->json() ?? $response->body(),
            ]);
            $response->throw();
        }

        /** @var array<string, mixed> */
        $json = $response->json();

        return $json;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    public static function extractCaptureMeta(array $payload): array
    {
        $captureId = null;
        $captureStatus = $payload['status'] ?? null;
        $units = $payload['purchase_units'] ?? [];
        if (is_array($units) && $units !== []) {
            $first = $units[0];
            if (is_array($first)) {
                $captures = $first['payments']['captures'] ?? [];
                if (is_array($captures) && $captures !== []) {
                    $cap = $captures[0];
                    if (is_array($cap)) {
                        $captureId = $cap['id'] ?? $captureId;
                        $captureStatus = $cap['status'] ?? $captureStatus;
                    }
                }
            }
        }

        return [
            'capture_id' => is_string($captureId) ? $captureId : null,
            'capture_status' => is_string($captureStatus) ? $captureStatus : null,
        ];
    }

    /**
     * @return array{name: string, message?: string}|null
     */
    public static function parseErrorFromThrowable(Throwable $e): ?array
    {
        if (! $e instanceof RequestException) {
            return null;
        }

        $response = $e->response;
        if ($response === null) {
            return null;
        }

        $json = $response->json();
        if (! is_array($json)) {
            return null;
        }

        $name = $json['name'] ?? $json['error'] ?? 'REQUEST_FAILED';
        $message = $json['message'] ?? ($json['details'][0]['description'] ?? null);

        return [
            'name' => is_string($name) ? $name : 'REQUEST_FAILED',
            'message' => is_string($message) ? $message : null,
        ];
    }

    /**
     * Catálogo de productos (Subscriptions API).
     *
     * @throws RequestException
     */
    public function createCatalogProduct(string $name, string $description = ''): string
    {
        $token = $this->getAccessToken();
        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($this->baseUrl().'/v1/catalogs/products', [
                'name' => $name,
                'description' => $description !== '' ? $description : $name,
                'type' => 'SERVICE',
                'category' => 'SOFTWARE',
            ])
            ->throw();

        $id = $response->json('id');
        if (! is_string($id) || $id === '') {
            throw new RuntimeException('PayPal no devolvió id de producto de catálogo.');
        }

        return $id;
    }

    /**
     * Crea y activa un plan de facturación recurrente.
     *
     * @throws RequestException
     */
    public function createAndActivateBillingPlan(
        string $productId,
        string $planName,
        string $description,
        float $amount,
        string $currency,
        int $intervalMonths,
    ): string {
        $token = $this->getAccessToken();
        $currencyCode = strtoupper($currency);
        $value = number_format(round($amount, 2), 2, '.', '');

        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($this->baseUrl().'/v1/billing/plans', [
                'product_id' => $productId,
                'name' => $planName,
                'description' => $description,
                'billing_cycles' => [
                    [
                        'frequency' => [
                            'interval_unit' => 'MONTH',
                            'interval_count' => max(1, min(120, $intervalMonths)),
                        ],
                        'tenure_type' => 'REGULAR',
                        'sequence' => 1,
                        'total_cycles' => 0,
                        'pricing_scheme' => [
                            'fixed_price' => [
                                'value' => $value,
                                'currency_code' => $currencyCode,
                            ],
                        ],
                    ],
                ],
                'payment_preferences' => [
                    'auto_bill_outstanding' => true,
                    'setup_fee_failure_action' => 'CONTINUE',
                    'payment_failure_threshold' => 3,
                ],
            ])
            ->throw();

        $planId = $response->json('id');
        if (! is_string($planId) || $planId === '') {
            throw new RuntimeException('PayPal no devolvió id de plan.');
        }

        $this->activateBillingPlan($planId);

        return $planId;
    }

    /**
     * @throws RequestException
     */
    public function activateBillingPlan(string $planId): void
    {
        $token = $this->getAccessToken();
        $enc = rawurlencode($planId);
        $this->http()
            ->withToken($token)
            ->asJson()
            ->post($this->baseUrl().'/v1/billing/plans/'.$enc.'/activate', (object) [])
            ->throw();
    }

    /**
     * Crea una suscripción en estado APPROVAL_PENDING (Smart Payment Buttons la aprueba en el cliente).
     *
     * @return array{id: string, raw: array<string, mixed>}
     *
     * @throws RequestException
     */
    public function createSubscriptionDraft(
        string $planId,
        string $customId,
        string $brandName,
        string $returnUrl,
        string $cancelUrl,
    ): array {
        $token = $this->getAccessToken();

        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($this->baseUrl().'/v1/billing/subscriptions', [
                'plan_id' => $planId,
                'custom_id' => $customId,
                'application_context' => [
                    'brand_name' => $brandName,
                    'locale' => 'es-ES',
                    'shipping_preference' => 'NO_SHIPPING',
                    'user_action' => 'SUBSCRIBE_NOW',
                    'return_url' => $returnUrl,
                    'cancel_url' => $cancelUrl,
                ],
            ])
            ->throw();

        /** @var array<string, mixed> $json */
        $json = $response->json();
        $id = $json['id'] ?? null;
        if (! is_string($id) || $id === '') {
            throw new RuntimeException('PayPal no devolvió id de suscripción.');
        }

        return ['id' => $id, 'raw' => $json];
    }

    /**
     * @return array<string, mixed>
     *
     * @throws RequestException
     */
    public function getSubscription(string $subscriptionId): array
    {
        $token = $this->getAccessToken();
        $enc = rawurlencode($subscriptionId);
        $response = $this->http()
            ->withToken($token)
            ->acceptJson()
            ->get($this->baseUrl().'/v1/billing/subscriptions/'.$enc)
            ->throw();

        /** @var array<string, mixed> */
        return $response->json();
    }

    /**
     * @param  array<string, mixed>  $webhookEvent
     */
    public function verifyWebhookSignature(
        string $webhookId,
        array $webhookEvent,
        ?string $transmissionId,
        ?string $transmissionTime,
        ?string $certUrl,
        ?string $authAlgo,
        ?string $transmissionSig,
    ): bool {
        if ($webhookId === '' || $transmissionId === null || $transmissionTime === null
            || $certUrl === null || $authAlgo === null || $transmissionSig === null) {
            return false;
        }

        $token = $this->getAccessToken();
        $response = $this->http()
            ->withToken($token)
            ->asJson()
            ->acceptJson()
            ->post($this->baseUrl().'/v1/notifications/verify-webhook-signature', [
                'auth_algo' => $authAlgo,
                'cert_url' => $certUrl,
                'transmission_id' => $transmissionId,
                'transmission_sig' => $transmissionSig,
                'transmission_time' => $transmissionTime,
                'webhook_id' => $webhookId,
                'webhook_event' => $webhookEvent,
            ]);

        if ($response->failed()) {
            Log::warning('PayPal verificación de webhook falló HTTP', [
                'status' => $response->status(),
                'body' => $response->json() ?? $response->body(),
            ]);

            return false;
        }

        return $response->json('verification_status') === 'SUCCESS';
    }
}
