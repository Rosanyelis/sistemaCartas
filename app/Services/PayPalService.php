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
}
