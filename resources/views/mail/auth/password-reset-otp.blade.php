@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Tu código de recuperación (caduca en {{ $expiresInMinutes }} minutos)
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'lock'])
@endsection

@section('title')
    Recuperación de contraseña
@endsection

@section('status_strip')
    Tu código de recuperación
@endsection

@section('content')
    <p style="margin:0 0 12px 0;">Usa este código <strong>solo en nuestra web</strong> para recuperar tu contraseña. No compartas este mensaje.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:16px auto;">
        <tr>
            <td style="background-color:#ebe4d8;border:2px dashed #1B3D6D;border-radius:8px;padding:16px 32px;text-align:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:0.25em;color:#1B3D6D;">
                {{ $otp }}
            </td>
        </tr>
    </table>
    <p style="margin:12px 0 0 0;font-size:14px;color:#555555;">
        El código caduca en {{ $expiresInMinutes }} minutos. Si no solicitaste recuperar tu contraseña, ignora este correo.
    </p>
@endsection

@section('secondary_notice')
    Historias por Correo nunca te pedirá este código por teléfono ni enlaces a sitios distintos de los oficiales.
@endsection
