<?php

use App\Models\StoreOrder;
use App\Support\Store\ClientePedidoLinea;

test('estado meta traduce paid a pagado y color success', function (): void {
    expect(ClientePedidoLinea::estadoMeta(StoreOrder::STATUS_PAID))
        ->toMatchArray(['label' => 'Pagado', 'color' => 'success']);
});

test('estado meta traduce pending_payment a pendiente de pago', function (): void {
    expect(ClientePedidoLinea::estadoMeta(StoreOrder::STATUS_PENDING_PAYMENT))
        ->toMatchArray(['label' => 'Pendiente de pago', 'color' => 'warning']);
});

test('estado meta traduce capture_failed a pago no completado', function (): void {
    expect(ClientePedidoLinea::estadoMeta(StoreOrder::STATUS_CAPTURE_FAILED))
        ->toMatchArray(['label' => 'Pago no completado', 'color' => 'danger']);
});
