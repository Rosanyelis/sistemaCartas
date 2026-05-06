@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Tu suscripción a {{ $suscripcion->historia->nombre ?? 'la historia' }} está activa
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'subscription'])
@endsection

@section('title')
    Suscripción activada
@endsection

@section('status_strip')
    Hemos activado tu acceso recurrente
@endsection

@section('content')
    <p style="margin:0 0 12px 0;"><strong>Detalles de la suscripción</strong></p>
    <p style="margin:0 0 8px 0;">Historia: <strong>{{ $suscripcion->historia->nombre ?? '—' }}</strong></p>
    <p style="margin:0 0 8px 0;">Modalidad: <strong>{{ $suscripcion->tipo }}</strong>@if ($suscripcion->cantidad > 1) (cantidad: {{ $suscripcion->cantidad }})@endif</p>
    @if ($suscripcion->proximo_cobro)
        <p style="margin:0 0 8px 0;">Próximo cobro previsto: <strong>{{ $suscripcion->proximo_cobro->format('d/m/Y') }}</strong></p>
    @endif
    <p style="margin:12px 0 0 0;font-size:14px;color:#555555;">
        El cobro recurrente lo gestiona PayPal Subscriptions; los métodos guardados en tu perfil no sustituyen a PayPal para esta suscripción.
    </p>
@endsection

@section('secondary_notice')
    Puedes revisar el estado y las fechas desde tu panel de suscripciones.
@endsection
