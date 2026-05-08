{{--
Plantilla base para correos transaccionales «Historias por Correo».

Contenido variable (preferir @section en vistas hijas o variables pasadas desde el Mailable):

- @yield('preheader') — Texto oculto para previsualización en la bandeja (mantener breve).
- @yield('hero_icon') — Bloque HTML con icono (p. ej. @include('mail.partials.hero-icon', ['variant' => 'bag'])).
- @yield('title') — Titular principal (serif vía estilos inline del layout).
- @yield('status_strip') — Texto corto de la franja beige de estado.
- @yield('content') — Cuerpo HTML dentro de la tarjeta (detalles, listas, código OTP, etc.).
- @hasSection('secondary_notice') — Bloque opcional de aviso secundario (soporte / seguridad).
- Variables opcionales para CTA (pasar desde Mailable::content()->with()):
    $ctaUrl (string https absoluta), $ctaLabel (breve encima del botón), $ctaText (texto del botón).
    Si $ctaUrl está vacío, no se muestra botón.

Variables opcionales:
- $recipientName (string|null) — Si existe, se muestra saludo «¡Hola, {nombre}!» bajo el titular.

Seguridad cliente de correo: tablas + estilos inline; sin flex/grid críticos ni JavaScript.
--}}
@php
    $year = date('Y');
    $brand = 'Historias por Correo';
    $logoAsset = (string) config('mail.brand_logo_asset', 'images/logo-principal.png');
    $logoUrl =
        isset($headerLogoUrl) && is_string($headerLogoUrl) && $headerLogoUrl !== ''
            ? $headerLogoUrl
            : asset($logoAsset);
    $ctaUrl = $ctaUrl ?? null;
    $ctaText = $ctaText ?? null;
    $ctaLabel = $ctaLabel ?? null;
    $recipientName = $recipientName ?? null;
    $emailTitle = $emailTitle ?? null;
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $emailTitle ?? $brand }}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1a1a1a;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;padding:24px 12px;">
    <tr>
        <td align="center">
            <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ffffff;">
                @yield('preheader')
            </div>
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e8e8e8;">
                <tr>
                    <td style="padding:24px 24px 16px 24px;text-align:center;background-color:#ffffff;border-bottom:1px solid #eeeeee;">
                        <img src="{{ $logoUrl }}" alt="{{ $brand }}" width="200" style="display:block;max-width:200px;width:100%;height:auto;margin:0 auto 12px auto;border:0;outline:none;text-decoration:none;" />
                        <div style="font-family:Georgia,'Times New Roman',Times,serif;font-size:16px;font-weight:700;letter-spacing:0.06em;color:#1B3D6D;text-transform:uppercase;">
                            Historias por Correo
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 24px 8px 24px;text-align:center;background-color:#ffffff;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                            <tr>
                                <td style="padding-bottom:12px;" align="center">
                                    @yield('hero_icon')
                                </td>
                            </tr>
                        </table>
                        <h1 style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',Times,serif;font-size:22px;line-height:1.3;font-weight:600;color:#1B3D6D;">
                            @yield('title')
                        </h1>
                        @if (!empty($recipientName))
                            <p style="margin:0 0 12px 0;font-size:16px;line-height:1.5;color:#333333;">
                                ¡Hola, {{ $recipientName }}!
                            </p>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px 24px;background-color:#ffffff;border-top:1px solid #f0f0f0;border-bottom:1px solid #f0f0f0;text-align:center;font-size:15px;line-height:1.45;color:#3d3d3d;font-weight:600;">
                        @yield('status_strip')
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px;background-color:#ffffff;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border:1px solid #eeeeee;border-radius:6px;">
                            <tr>
                                <td style="padding:20px 22px;font-size:15px;line-height:1.55;color:#333333;">
                                    @yield('content')
                                </td>
                            </tr>
                        </table>
                        @hasSection('secondary_notice')
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;background-color:#f0f6ff;border:1px solid #c9daf5;border-radius:6px;">
                                <tr>
                                    <td style="padding:14px 16px;font-size:14px;line-height:1.5;color:#1a3a66;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="40" valign="top" style="padding-right:8px;">
                                                    @include('mail.partials.hero-icon', ['variant' => 'shield'])
                                                </td>
                                                <td valign="top">
                                                    @yield('secondary_notice')
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        @endif
                        @if (!empty($ctaUrl))
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
                                <tr>
                                    <td align="center" style="padding-top:4px;">
                                        @if (!empty($ctaLabel))
                                            <p style="margin:0 0 10px 0;font-size:14px;color:#555555;">{{ $ctaLabel }}</p>
                                        @endif
                                        <a href="{{ $ctaUrl }}" style="display:inline-block;background-color:#1B3D6D;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:6px;mso-padding-alt:0;text-underline-color:#1B3D6D;">
                                            <span style="color:#ffffff;">{{ $ctaText ?? 'Continuar' }}</span>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="padding:16px 20px;background-color:#ffffff;border-top:1px solid #eeeeee;text-align:center;font-size:13px;line-height:1.5;color:#555555;">
                        <span style="color:#1B3D6D;font-weight:600;">Historias por Correo</span><br />
                        © {{ $year }} Derechos reservados
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
