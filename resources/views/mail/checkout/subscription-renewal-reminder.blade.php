@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Próximo cobro de tu suscripción a {{ $suscripcion->historia->nombre ?? 'la historia' }}
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'subscription'])
@endsection

@section('title')
    Recordatorio de renovación
@endsection

@section('status_strip')
    Tu suscripción tiene un cobro programado próximamente
@endsection

@section('content')
    <p style="margin:0 0 12px 0;">
        Te recordamos que en <strong>{{ $daysBefore }} {{ $daysBefore === 1 ? 'día' : 'días' }}</strong> está previsto el siguiente cobro de tu suscripción.
    </p>
    <p style="margin:0 0 8px 0;">Historia: <strong>{{ $suscripcion->historia->nombre ?? '—' }}</strong></p>
    @if ($suscripcion->proximo_cobro)
        <p style="margin:0 0 8px 0;">Fecha prevista del cobro: <strong>{{ $suscripcion->proximo_cobro->format('d/m/Y') }}</strong></p>
    @endif
    <p style="margin:12px 0 0 0;font-size:14px;color:#555555;">
        El cobro lo procesa PayPal Subscriptions. Si necesitas actualizar tu método de pago, hazlo desde tu cuenta PayPal.
    </p>
@endsection

@section('secondary_notice')
    Si ya cancelaste la suscripción, puedes ignorar este mensaje o revisar el estado en tu panel.
@endsection
