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
- $suppressDefaultGreeting (bool) — Si es true, no se muestra el saludo automático (p. ej. bienvenida con subtítulo propio).

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
    $suppressDefaultGreeting = (bool) ($suppressDefaultGreeting ?? false);
@endphp
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $emailTitle ?? $brand }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1B3D6D;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;padding:24px 12px;">
    <tr>
        <td align="center">
            <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ffffff;">
                @yield('preheader')
            </div>
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:8px 8px 16px rgba(0,0,0,0.02);border-collapse:separate;">
                {{-- Cabecera: logo --}}
                <tr>
                    <td style="padding:16px 24px 0 24px;text-align:center;background-color:#ffffff;">
                        <img src="{{ $logoUrl }}" alt="{{ $brand }}" width="160" height="92" style="display:block;width:160px;max-width:160px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;" />
                    </td>
                </tr>
                {{-- Separador 2px --}}
                <tr>
                    <td style="height:2px;line-height:2px;font-size:2px;background-color:#DEE2E6;padding:0;">&nbsp;</td>
                </tr>
                {{-- Icono hero en círculo + título + saludo --}}
                <tr>
                    <td style="padding:16px 24px 8px 24px;text-align:center;background-color:#ffffff;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 12px auto;">
                            <tr>
                                <td align="center" style="width:64px;height:64px;background-color:#F2F2F2;border-radius:50%;vertical-align:middle;text-align:center;">
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                                        <tr>
                                            <td style="padding:10px 0 0 0;" align="center">
                                                @yield('hero_icon')
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <h1 style="margin:0 0 8px 0;padding:0;font-family:'Playfair Display',Georgia,'Times New Roman',Times,serif;font-size:32px;line-height:1.15;font-weight:700;color:#1B3D6D;text-align:center;letter-spacing:-1px;">
                            @yield('title')
                        </h1>
                        @if (!empty($recipientName) && ! $suppressDefaultGreeting)
                            <p style="margin:0 0 8px 0;padding:0;font-family:Inter,system-ui,sans-serif;font-size:25px;line-height:30px;font-weight:600;color:#1B3D6D;text-align:center;">
                                ¡Hola, {{ $recipientName }}! 👋
                            </p>
                        @endif
                    </td>
                </tr>
                {{-- Franja estado --}}
                <tr>
                    <td style="padding:10px 24px;background-color:#FFFCF4;text-align:center;">
                        <p style="margin:0;padding:0;font-family:'Playfair Display',Georgia,serif;font-size:25px;line-height:33px;font-weight:600;color:#1B3D6D;">
                            @yield('status_strip')
                        </p>
                    </td>
                </tr>
                {{-- Cuerpo: tarjeta contenido + aviso + CTA --}}
                <tr>
                    <td style="padding:24px;background-color:#ffffff;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border:1px solid #F2F2F2;border-radius:6px;border-collapse:separate;">
                            <tr>
                                <td style="padding:24px;font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.55;color:#1B3D6D;">
                                    @yield('content')
                                </td>
                            </tr>
                        </table>
                        @hasSection('secondary_notice')
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;background-color:#F5F5FF;border:1px solid #E8E8F4;border-radius:4px;border-collapse:separate;">
                                <tr>
                                    <td style="padding:12px;font-family:Inter,system-ui,sans-serif;font-size:10px;line-height:13px;color:#1B3D6D;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="32" valign="top" style="padding-right:4px;">
                                                    @include('mail.partials.hero-icon', ['variant' => 'shield'])
                                                </td>
                                                <td valign="top" style="padding-top:2px;">
                                                    @yield('secondary_notice')
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        @endif
                        @if (!empty($ctaUrl))
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;">
                                <tr>
                                    <td style="height:2px;line-height:2px;font-size:2px;background-color:#DEE2E6;padding:0;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:16px 0 0 0;">
                                        @if (!empty($ctaLabel))
                                            <p style="margin:0 0 16px 0;padding:0;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:22px;font-weight:400;color:#1B3D6D;text-align:center;">
                                                {{ $ctaLabel }}
                                            </p>
                                        @endif
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                                            <tr>
                                                <td align="center" style="background-color:#1B3D6D;border:1px solid #1B3D6D;border-radius:2px;">
                                                    <a href="{{ $ctaUrl }}" style="display:inline-block;padding:14px 20px;font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:19px;font-weight:600;color:#ffffff;text-decoration:none;min-width:180px;text-align:center;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                                                            <tr>
                                                                <td valign="middle" style="padding-right:8px;">
                                                                    {{-- Icono monitor (inline SVG) --}}
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="display:block;vertical-align:middle;">
                                                                        <path fill="#ffffff" d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5zm2 0v10h12V5H6zm4 14h4v2H8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2h-2v-2z"/>
                                                                    </svg>
                                                                </td>
                                                                <td valign="middle" style="color:#ffffff;font-size:16px;font-weight:600;">
                                                                    {{ $ctaText ?? 'Continuar' }}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        @endif
                    </td>
                </tr>
                {{-- Pie barra azul --}}
                <tr>
                    <td style="padding:8px 10px;background-color:#1B3D6D;text-align:center;height:38px;vertical-align:middle;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                            <tr>
                                <td style="font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:22px;font-weight:400;color:#ffffff;white-space:nowrap;">
                                    © Historias por correo
                                </td>
                                <td style="width:1px;padding:0 10px;" valign="middle">
                                    <span style="display:inline-block;width:1px;height:14px;background-color:#ffffff;line-height:14px;font-size:0;">&nbsp;</span>
                                </td>
                                <td style="font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:22px;font-weight:400;color:#ffffff;white-space:nowrap;">
                                    {{ $year }} Derechos reservados
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
