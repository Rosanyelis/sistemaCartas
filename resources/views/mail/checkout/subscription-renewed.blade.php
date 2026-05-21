@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Renovación registrada — {{ $suscripcion->historia->nombre ?? 'tu historia' }}
@endsection

@section('title')
    Renovación registrada
@endsection

@section('status_strip')
    Hemos registrado un cobro recurrente correcto
@endsection

@section('content')
    <p style="margin:0 0 12px 0;"><strong>Detalles</strong></p>
    <p style="margin:0 0 8px 0;">Suscripción a: <strong>{{ $suscripcion->historia->nombre ?? '—' }}</strong></p>
    @if ($suscripcion->proximo_cobro)
        <p style="margin:0 0 8px 0;">Próximo cobro previsto: <strong>{{ $suscripcion->proximo_cobro->format('d/m/Y') }}</strong></p>
    @endif
    <p style="margin:12px 0 0 0;font-size:14px;color:#555555;">
        Gracias por seguir disfrutando de Historias por Correo.
    </p>
@endsection
