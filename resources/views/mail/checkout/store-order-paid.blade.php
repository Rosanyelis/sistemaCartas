@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Pedido #{{ $order->id }} pagado correctamente — {{ $order->currency }} {{ number_format((float) $order->total, 2, ',', '.') }}
@endsection

@section('hero_icon')
    @include('mail.partials.hero-icon', ['variant' => 'bag'])
@endsection

@section('title')
    ¡Gracias por tu compra!
@endsection

@section('status_strip')
    Hemos registrado tu orden
@endsection

@section('content')
    @php
        $firstItem = $order->relationLoaded('items') && $order->items->isNotEmpty()
            ? $order->items->first()
            : null;
        $productLabel = $firstItem
            ? $firstItem->product_name.($order->items->count() > 1 ? ' (+' . ($order->items->count() - 1) . ')' : '')
            : '—';
    @endphp
    <p style="margin:0 0 8px 0;padding:0;font-family:Inter,system-ui,sans-serif;font-size:16px;line-height:19px;font-weight:600;color:#1B3D6D;">
        Detalles de la compra
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;margin:0 0 12px 0;">
        <tr>
            <td colspan="2" style="height:0;border-bottom:1px solid #DFE4EA;padding:0;line-height:0;font-size:0;">&nbsp;</td>
        </tr>
        <tr>
            <td style="padding:8px 0 0 0;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:16px;font-weight:600;color:#1B3D6D;">
                Número de orden
            </td>
            <td style="padding:8px 0 0 0;text-align:right;font-family:Roboto,Inter,system-ui,sans-serif;font-size:13px;line-height:15px;font-weight:700;color:#1B3D6D;">
                #{{ $order->id }}
            </td>
        </tr>
        <tr>
            <td style="padding:8px 0 0 0;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:16px;font-weight:600;color:#1B3D6D;">
                Precio total de la orden:
            </td>
            <td style="padding:8px 0 0 0;text-align:right;font-family:Roboto,Inter,system-ui,sans-serif;font-size:13px;line-height:15px;font-weight:700;color:#1B3D6D;">
                {{ $order->currency }} {{ number_format((float) $order->total, 2, ',', '.') }}
            </td>
        </tr>
        <tr>
            <td style="padding:8px 0 0 0;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:16px;font-weight:600;color:#1B3D6D;">
                Producto:
            </td>
            <td style="padding:8px 0 0 0;text-align:right;font-family:Roboto,Inter,system-ui,sans-serif;font-size:13px;line-height:15px;font-weight:700;color:#1B3D6D;">
                {{ $productLabel }}
            </td>
        </tr>
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:12px 0 0 0;background-color:#ffffff;border-radius:4px;">
        <tr>
            <td style="padding:12px;font-family:Inter,system-ui,sans-serif;font-size:10px;line-height:13px;font-weight:400;color:#1B3D6D;">
                Te informamos que recibimos tu pago y que tu producto está en camino, estará llegando a tu domicilio en las próximas <strong>48 horas</strong>; agradecemos la paciencia.
            </td>
        </tr>
    </table>
@endsection

@section('secondary_notice')
    En caso de que por error tu producto no llegue; puedes comunicarte a nuestro chat de atención al cliente dando clic en el botón de Whatsapp que tienes disponible en tu panel de usuario.
@endsection
