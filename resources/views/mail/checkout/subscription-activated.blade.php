<x-mail::message>
# Suscripción activa

Tu suscripción PayPal a la historia **{{ $suscripcion->historia->nombre ?? 'historia' }}** ya está activa.

@if($suscripcion->proximo_cobro)
Próximo cobro previsto: **{{ $suscripcion->proximo_cobro->format('d/m/Y') }}**
@endif

**Nota:** el cobro recurrente lo gestiona PayPal Subscriptions; los métodos de pago guardados en tu perfil no sustituyen a PayPal para esta suscripción.

<x-mail::button :url="url('/user/subscriptions')">
Ver mis suscripciones
</x-mail::button>

{{ config('app.name') }}
</x-mail::message>
