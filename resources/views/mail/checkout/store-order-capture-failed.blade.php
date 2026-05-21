@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Pago no completado — pedido #{{ $order->id }}
@endsection

@section('title')
    No hemos podido completar el pago
@endsection

@section('status_strip')
    Tu pedido sigue pendiente de pago
@endsection

@section('content')
    <p style="margin:0 0 12px 0;"><strong>Detalles del pedido</strong></p>
    <p style="margin:0 0 8px 0;">Número de orden: <strong>#{{ $order->id }}</strong></p>
    <p style="margin:0 0 8px 0;">Total: <strong>{{ $order->currency }} {{ number_format((float) $order->total, 2, ',', '.') }}</strong></p>
    @if ($order->relationLoaded('items') && $order->items->isNotEmpty())
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;margin-top:8px;">
            @foreach ($order->items as $item)
                <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;">
                        {{ $item->product_name }} × {{ $item->quantity }}
                    </td>
                    <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:right;white-space:nowrap;">
                        {{ $order->currency }} {{ number_format((float) $item->line_total, 2, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </table>
    @endif
    <p style="margin:16px 0 0 0;"><strong>Motivo</strong></p>
    <p style="margin:4px 0 0 0;">{{ $motivoUsuario }}</p>
    @if ($paypalErrorCode)
        <p style="margin:8px 0 0 0;font-size:13px;color:#666666;">Código PayPal: {{ $paypalErrorCode }}</p>
    @endif
    @if ($detallePaypal)
        <p style="margin:4px 0 0 0;font-size:13px;color:#666666;">{{ $detallePaypal }}</p>
    @endif
    <p style="margin:16px 0 0 0;font-size:14px;line-height:1.6;">
        <a href="{{ route('user.profile', [], true) }}" style="color:#1B3D6D;font-weight:600;">Métodos de pago en tu perfil</a>
        &nbsp;·&nbsp;
        <a href="{{ route('user.orders', [], true) }}" style="color:#1B3D6D;font-weight:600;">Mis pedidos</a>
    </p>
@endsection

@section('secondary_notice')
    Puedes volver al catálogo, revisar tus métodos de pago en el perfil o intentar de nuevo con PayPal. Ningún cargo se ha aplicado a esta orden.
@endsection
