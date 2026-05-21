@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Tu código de acceso para restablecer tu contraseña (caduca en {{ $expiresInMinutes }} minutos)
@endsection

@section('title')
    Código de acceso generado
@endsection

@section('status_strip')
    Hola, {{ $recipientName ?? 'viajero' }}, 👋 Abajo encontrarás el código para restablecimiento
@endsection

@section('content')
    <p style="margin:0 0 12px 0;">
        Parece que has extraviado la llave de tu escritorio personal. No te preocupes, hemos preparado un salvoconducto para que recuperes el acceso a tus historias y pedidos de inmediato.
    </p>
    <p style="margin:0 0 12px 0;">
        Utiliza el siguiente código secreto en nuestra página web para crear una nueva contraseña:
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:16px auto;">
        <tr>
            <td style="background-color:#ebe4d8;border:2px dashed #1B3D6D;border-radius:8px;padding:16px 32px;text-align:center;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:28px;font-weight:700;letter-spacing:0.25em;color:#1B3D6D;">
                {{ $otp }}
            </td>
        </tr>
    </table>
    <p style="margin:12px 0 16px 0;font-size:14px;color:#555555;">
        (Este código expirará en {{ $expiresInMinutes }} minutos por motivos de seguridad).
    </p>
    <p style="margin:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:19px;font-weight:600;color:#1B3D6D;">
        Instrucciones rápidas
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0;">
        <tr>
            <td valign="top" width="20" style="padding:0 8px 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">1.</td>
            <td style="padding:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                Copia el código de arriba.
            </td>
        </tr>
        <tr>
            <td valign="top" width="20" style="padding:0 8px 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">2.</td>
            <td style="padding:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                Pégalo en la casilla de verificación en nuestro sitio web.
            </td>
        </tr>
        <tr>
            <td valign="top" width="20" style="padding:0 8px 0 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">3.</td>
            <td style="padding:0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                Elige una nueva contraseña que solo tú conozcas.
            </td>
        </tr>
    </table>
@endsection

@section('secondary_notice')
    <strong>¿No has solicitado este código?</strong> Si no fuiste tú quien pidió restablecer la contraseña, puedes ignorar este mensaje con total tranquilidad. Tu cuenta sigue protegida bajo nuestro lacre de seguridad.
@endsection
