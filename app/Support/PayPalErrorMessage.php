<?php

namespace App\Support;

/**
 * Mensajes legibles para códigos de error habituales de PayPal (capturas y cobros).
 */
final class PayPalErrorMessage
{
    /**
     * @return array{code: ?string, user_message: string, detail: ?string}
     */
    public static function fromParsed(?string $name, ?string $paypalMessage): array
    {
        $code = $name !== null && $name !== '' ? $name : null;
        $detail = $paypalMessage !== null && $paypalMessage !== '' ? $paypalMessage : null;

        $map = [
            'INSUFFICIENT_FUNDS' => 'Fondos insuficientes en el método de pago. Comprueba el saldo o prueba con otra tarjeta o cuenta.',
            'INSTRUMENT_DECLINED' => 'El banco o PayPal rechazó el método de pago. Prueba con otro instrumento o contacta con tu entidad.',
            'PAYER_CANNOT_PAY' => 'PayPal no permite completar el pago con esta cuenta en este momento. Revisa tu cuenta PayPal o usa otro método.',
            'PAYER_ACCOUNT_RESTRICTED' => 'La cuenta de pago tiene restricciones. Debes resolverlo en PayPal antes de volver a intentarlo.',
            'TRANSACTION_REFUSED' => 'La transacción fue rechazada. Prueba de nuevo más tarde o con otro método de pago.',
            'CARD_TYPE_NOT_SUPPORTED' => 'Este tipo de tarjeta no está soportado para esta operación.',
            'INVALID_SECURITY_CODE' => 'El código de seguridad (CVV) no es válido o no coincide.',
            'EXPIRED_CARD' => 'La tarjeta está caducada. Actualiza el método de pago en PayPal.',
            'INVALID_ACCOUNT' => 'La cuenta o tarjeta no es válida para este pago.',
            'DUPLICATE_INVOICE_ID' => 'Se detectó un posible duplicado de pedido. Si el cargo ya se realizó, revisa tu historial; si no, vuelve a intentarlo.',
            'COMPLIANCE_VIOLATION' => 'PayPal bloqueó la operación por motivos de cumplimiento o riesgo.',
            'MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED' => 'Se superó el número de intentos permitidos. Espera unos minutos o cambia el método de pago.',
            'ORDER_ALREADY_CAPTURED' => 'Este pedido ya fue cobrado anteriormente.',
        ];

        if ($code !== null && isset($map[$code])) {
            return [
                'code' => $code,
                'user_message' => $map[$code],
                'detail' => $detail,
            ];
        }

        $lower = strtolower((string) $detail);
        if ($lower !== '' && (str_contains($lower, 'insufficient') || str_contains($lower, 'fondos'))) {
            return [
                'code' => $code,
                'user_message' => $map['INSUFFICIENT_FUNDS'],
                'detail' => $detail,
            ];
        }

        $fallback = 'No se pudo completar el pago con PayPal.';
        if ($detail !== null) {
            $fallback .= ' Detalle: '.$detail;
        } elseif ($code !== null) {
            $fallback .= ' Código: '.$code;
        }

        return [
            'code' => $code,
            'user_message' => $fallback,
            'detail' => $detail,
        ];
    }
}
