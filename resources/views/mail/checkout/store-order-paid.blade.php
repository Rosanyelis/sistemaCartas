<x-mail::message>
# Compra confirmada

Tu pedido **#{{ $order->id }}** se ha pagado correctamente.

**Total:** {{ $order->currency }} {{ number_format((float) $order->total, 2, ',', '.') }}

@if($order->user)
Gracias por confiar en nosotros, {{ $order->user->name }}.
@else
Gracias por tu compra.
@endif

<x-mail::button :url="url('/user/orders')">
Ver mis órdenes
</x-mail::button>

Saludos,<br>
{{ config('app.name') }}
</x-mail::message>
