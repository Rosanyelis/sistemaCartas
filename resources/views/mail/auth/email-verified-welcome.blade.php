@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Tu cuenta está activa — explora historias y productos
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'welcome'])
@endsection

@section('title')
    ¡Correo verificado!
@endsection

@section('status_strip')
    Tu cuenta ya está activa
@endsection

@section('content')
    <p style="margin:0 0 12px 0;">Gracias por confirmar tu correo. Ya puedes acceder a todas las funciones de tu cuenta, incluidas compras y suscripciones.</p>
    <p style="margin:0 0 12px 0;font-size:14px;color:#555555;">
        Te esperamos en la tienda y en tu panel personal.
    </p>
    <p style="margin:0;font-size:14px;">
        <a href="{{ route('user.orders', [], true) }}" style="color:#1B3D6D;font-weight:600;">Ir a mis pedidos</a>
    </p>
@endsection

@section('secondary_notice')
    Si tienes dudas sobre pedidos o suscripciones, escríbenos respondiendo a este mensaje.
@endsection
