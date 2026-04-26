<?php

namespace App\Http\Requests\Admin\Concerns;

trait PreparesHistoriaDetalleJson
{
    /**
     * Normaliza `detalle` enviado como JSON (multipart) o como array (JSON body).
     */
    protected function mergeHistoriaDetalleFromRequest(): void
    {
        if (! $this->has('detalle')) {
            return;
        }

        $raw = $this->input('detalle');

        if (is_array($raw)) {
            return;
        }

        if (! is_string($raw)) {
            $this->merge(['detalle' => []]);

            return;
        }

        $trim = trim($raw);
        if ($trim === '' || $trim === '[]') {
            $this->merge(['detalle' => []]);

            return;
        }

        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $this->merge(['detalle' => $decoded]);
        } else {
            $this->merge(['detalle' => []]);
        }
    }
}
