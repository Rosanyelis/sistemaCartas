# RESUMEN_PROYECTO_IA

> Resumen ejecutivo del proyecto `sistemaCartas` (Historias por Correo).
> Diseñado para servir como **contexto persistente** en sesiones futuras de IA.
> ~25 líneas operativas.

## Proyecto en una línea
Laravel 12 + Inertia v2 + React 19 (Tailwind v4); tienda con catálogo de productos (cobro único vía PayPal Orders v2) y suscripciones mensuales a «historias» (PayPal Subscriptions v1); panel admin con métricas y CRUD; compresión WebP + FFmpeg + QR; auth Fortify con OTP email/password y 2FA TOTP.

## Lista compacta de entidades (18 modelos)
User · Historia · HistoriaCategoria · HistoriaGaleria · HistoriaVariante · HistoriaCapitulo · Entrega · Producto · ProductoCategoria · ProductoSubcategoria · ProductoGaleria · Suscripcion · StoreOrder · StoreOrderItem · PasarelaEvento · Audio · TipoMetodoPago · MetodoPagoUsuario.

## Flujos críticos (12)
1. Checkout producto (one-shot): crea StoreOrder (status=pending), captura con PayPal → status=paid + lock productos + decrement stock + mail Paid.
2. Suscripción historia: ensureBillingPlan (idempotente, lockForUpdate) → draft PayPal → sync/webhook → aplicar fechas/estado → mail Activated.
3. Webhook idempotente: pasarela_eventos por paypal_event_id único; ACTIVATED/CANCELLED/SUSPENDED/PAYMENT.FAILED/PAYMENT.SALE.COMPLETED.
4. Recordatorio previo a próximo cobro (cron diario 09:00, N días antes, una sola vez).
5. Cancelación usuario: policy dueño + cancelBillingSubscription remoto + estado inactiva.
6. Reset password OTP: send → verify → token en cache 10 min → reset.
7. Verificación email OTP: 6 dígitos 10 min, guardado en users.otp_code.
8. Subida admin imagen (WebP) + video (FFmpeg) + audio (storage local) con QR.
9. Streaming público audio: ruta por slug con throttle 60/min y soporte Range.
10. Export Excel admin (5 entidades).
11. Demo seeder (PHP artisan demo:seed-dashboard, 1 abr–3 jun YEAR, aborta en producción).
12. Dashboard con props defer; SQLite (local) y MySQL (prod) soportados (CAST/strftime).

## Decisiones arquitectónicas clave
- **SPA monolítica:** no API REST pura. Inertia comparte props vía `HandleInertiaRequests` (auth, paypal, tienda, paymentMethods, flash).
- **PayPal client_credentials manual** vía `Illuminate\Support\Facades\Http` (sin SDK oficial); OAuth cacheado por petición.
- **Plan PayPal por historia cacheado** (`paypal_plan_id`, `paypal_plan_amount`, `paypal_plan_interval_meses`); se regenera sólo si cambia precio o intervalo (`HistoriaPayPalPlanService`).
- **IVA configurable** (`config('tienda.iva_percentage')`); se suma en checkout y cargos de suscripción.
- **Carrito polimórfico discriminado** (`kind: 'product' | 'historia_suscripcion'`, modo derivado); sessionStorage `v2`.
- **WebP universal** para todas las imágenes admin (intervention/image v3, GD fallback).
- **FFmpeg del sistema** (no composer). Symfony Process con reintentos CRF.
- **Políticas admin = trait** `GrantsAllAbilitiesToAdmins` + Gate `admin` (regla: cualquier policy admin debe tener stubs `view/viewAny/create/update/delete/duplicate/toggleStatus` además del `before`).
- **CSRF except** sólo en `/webhooks/paypal`; toda escritura admin/user exige auth.
- **Wayfinder** auto-genera TS (no commitear acciones/routes). Vite plugin `formVariants`.
- **shadcn UI (`new-york`, lucide)** + Radix + Headless. Sin antd/material.
- **Pest 4 + RefreshDatabase**; SQLite :memory: en phpunit.xml.
- **Demo runtime** auto-excluido en producción (`RuntimeException`).

## Reglas que la IA debe respetar (no negociables)
1. **No añadir comentarios** al código (el proyecto no los usa; sólo PHPDoc blocks).
2. **No introducir dependencias nuevas** sin aprobación explícita.
3. **No regenerar migraciones existentes**; añadir nueva migración aditiva.
4. **No saltarse serializadores** (`app/Support/*Serializer`): exponen el shape TS.
5. **Toda nueva ruta** lleva `->name(...)` y disparo `php artisan wayfinder:generate`.
6. **Toda feature admin** debe incluir `Gate::policy(...)` en `AppServiceProvider::boot` si añade Policy.
7. **Toda subida/admin con archivos** debe pasar por `WebpImageStorageService`, `HistoriaVideoStorageService` o `AudioStorageService` según corresponda.
8. **Toda operación PayPal** transaccional (`DB::transaction` + `lockForUpdate`) antes de tocar el API externo.
9. **Toda escritura desde webhook** vía `PasarelaEventoRecorder` para idempotencia.
10. **Validación de UI/mensajes**: español; nunca inglés.
11. **Tests**: Pest + factories. Cobertura mínima: happy path + 1 negativo por nueva ruta.
12. **Lint/format**: `vendor/bin/pint --dirty --format agent`, `npm run format`, `npm run lint:check`, `npm run types:check` antes de cerrar.
13. **No hardcodear URLs**: usar `route()` en Laravel y `Wayfinder` en React.
14. **No tocar `app/Policies/HistoriaPolicy.php`, `AudioPolicy.php`, etc.** sin actualizar `AppServiceProvider::boot` ni el trait `GrantsAllAbilitiesToAdmins`.
15. **No inventar textos PayPal**: usar `App\Support\PayPalErrorMessage`.
