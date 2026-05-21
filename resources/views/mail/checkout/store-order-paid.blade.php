@extends('mail.layouts.historias-por-correo')

@section('preheader')
    Pedido #{{ $order->id }} pagado correctamente — {{ $order->currency }} {{ number_format((float) $order->total, 2, ',', '.') }}
@endsection

@section('title')
    ¡Gracias por tu compra!
@endsection

@section('status_strip')
    Hemos registrado tu orden
@endsection

@section('content')
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
        @forelse ($order->relationLoaded('items') ? $order->items : collect() as $item)
            <tr>
                <td style="padding:8px 0 0 0;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:16px;font-weight:600;color:#1B3D6D;vertical-align:top;">
                    Producto{{ $loop->count > 1 ? ' '.$loop->iteration : '' }}:
                </td>
                <td style="padding:8px 0 0 0;text-align:right;font-family:Roboto,Inter,system-ui,sans-serif;font-size:13px;line-height:15px;font-weight:700;color:#1B3D6D;vertical-align:top;">
                    {{ $item->product_name }}@if ($item->quantity > 1) <span style="font-weight:600;color:#7B7B7B;">×{{ $item->quantity }}</span>@endif
                    <br />
                    <span style="font-size:12px;font-weight:600;color:#7B7B7B;">{{ $order->currency }} {{ number_format((float) $item->line_total, 2, ',', '.') }}</span>
                </td>
            </tr>
        @empty
            <tr>
                <td style="padding:8px 0 0 0;font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:16px;font-weight:600;color:#1B3D6D;">
                    Producto:
                </td>
                <td style="padding:8px 0 0 0;text-align:right;font-family:Roboto,Inter,system-ui,sans-serif;font-size:13px;line-height:15px;font-weight:700;color:#1B3D6D;">
                    —
                </td>
            </tr>
        @endforelse
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
