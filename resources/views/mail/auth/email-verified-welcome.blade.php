@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Tu primer sobre está por abrirse — bienvenido a Historias por Correo
@endsection

@section('title')
    ¡Bienvenido a nuestra familia!
@endsection

@section('status_strip')
    Hola, {{ $recipientName ?? 'viajero' }}, 👋 Bienvenido a Historias por Correo
@endsection

@section('content')
    <p style="margin:0 0 12px 0;">
        Estamos felices de que hayas decidido pausar el ruido digital para volver a vivir lo que se ha perdido… las historias que se pueden tocar.
    </p>
    <p style="margin:0 0 12px 0;">
        A partir de ahora, ya no eres un simple usuario; eres parte de una comunidad de románticos, curiosos y amantes del detalle. En Historias por Correo, creemos que un sobre cerrado contiene más magia que cualquier notificación en el móvil.
    </p>
    <p style="margin:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:19px;font-weight:600;color:#1B3D6D;">
        ¿Qué puedes esperar de nosotros?
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 0 0;">
        <tr>
            <td valign="top" width="16" style="padding:0 8px 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">•</td>
            <td style="padding:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                <strong>Historias que cobran vida:</strong> Narrativas escritas por profesionales que llegan hasta la puerta de tu casa.
            </td>
        </tr>
        <tr>
            <td valign="top" width="16" style="padding:0 8px 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">•</td>
            <td style="padding:0 0 8px 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                <strong>Tesoros físicos:</strong> Complementos que parecen sacados de otra época (lacres, abrecartas, papeles con historia).
            </td>
        </tr>
        <tr>
            <td valign="top" width="16" style="padding:0 8px 0 0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">•</td>
            <td style="padding:0;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                <strong>Secretos exclusivos:</strong> Descuentos y lanzamientos solo para los miembros de nuestro panel.
            </td>
        </tr>
    </table>
@endsection
