@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Cobro de suscripción no completado — actualiza tu pago en PayPal
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'cart-warning'])
@endsection

@section('title')
    Problema con el cobro de tu suscripción
@endsection

@section('status_strip')
    Tu cobro recurrente no se ha podido completar
@endsection

@section('content')
    <p style="margin:0 0 12px 0;"><strong>Detalles</strong></p>
    <p style="margin:0 0 8px 0;">Historia: <strong>{{ $suscripcion->historia->nombre ?? '—' }}</strong></p>
    @if ($importeFormateado)
        <p style="margin:0 0 8px 0;">Importe intentado: <strong>{{ $importeFormateado }}</strong></p>
    @endif
    <p style="margin:0 0 12px 0;">{{ $motivoUsuario }}</p>
    @if ($detallePaypal)
        <p style="margin:0;font-size:13px;color:#666666;">Información técnica: {{ $detallePaypal }}</p>
    @endif
    @if ($paypalReasonCode)
        <p style="margin:8px 0 0 0;font-size:13px;color:#666666;">Código: {{ $paypalReasonCode }}</p>
    @endif
@endsection

@section('secondary_notice')
    Actualiza el método de pago o el saldo en tu cuenta PayPal para evitar la suspensión del acceso. Si necesitas ayuda, responde a este correo.
@endsection
