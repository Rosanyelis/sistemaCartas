<x-mail::message>
# Renovación registrada

Se ha registrado un cobro recurrente para tu suscripción a **{{ $suscripcion->historia->nombre ?? 'historia' }}**.

@if($suscripcion->proximo_cobro)
Próximo cobro previsto: **{{ $suscripcion->proximo_cobro->format('d/m/Y') }}**
@endif

{{ config('app.name') }}
</x-mail::message>
