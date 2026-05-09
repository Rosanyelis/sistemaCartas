<?php

use App\Support\TiendaIva;

test('calcula iva y bruto desde neto con 16 por ciento por defecto', function (): void {
    config(['tienda.iva_percentage' => 16]);

    expect(TiendaIva::amountFromNet(100))->toBe(16.0);
    expect(TiendaIva::grossFromNet(100))->toBe(116.0);
    expect(TiendaIva::grossFromNet(14))->toBe(16.24);
});

test('respeta configuración de porcentaje alternativo', function (): void {
    config(['tienda.iva_percentage' => 10]);

    expect(TiendaIva::grossFromNet(50))->toBe(55.0);
});

test('porcentajes negativos se tratan como cero', function (): void {
    config(['tienda.iva_percentage' => -5]);

    expect(TiendaIva::rate())->toBe(0.0);
    expect(TiendaIva::grossFromNet(20))->toBe(20.0);
});
