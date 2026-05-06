# Tareas pendientes (seguimiento por consultas)

Este archivo resume **lo ya abordado** en el código y **lo que sigue pendiente** según los hilos de conversación con el asistente. Actualízalo cuando cierres una tarea o añadas un nuevo requisito.

---

## Completado recientemente

| Área | Descripción |
|------|-------------|
| Dashboard admin | `DashboardMetricasService`: suscripciones por historia con columna `estado` = `activa`; ventas del mes con `StoreOrder::STATUS_PAID`; gráfico de ventas usando `store_order_items` + slugs en `historias` / `productos` (sin `buyable_type`). Tests en `tests/Feature/Admin/DashboardMetricasServiceTest.php`. |
| Suscripciones cliente | `/user/subscriptions`: datos reales desde `suscripciones` del usuario autenticado, con `historia` cargada; lista vacía si no hay filas. Serializador `App\Support\SuscripcionUsuarioListaSerializer`. UI: fechas opcionales con `—`, mensajes vacío vs filtros. Tests en `tests/Feature/User/SubscriptionsIndexTest.php`. |
| Correos unificados | Plantilla `resources/views/mail/layouts/historias-por-correo.blade.php` (tablas + inline, iconos SVG en `resources/views/mail/partials/hero-icon.blade.php`). Mailables: `StoreOrderPaidMail`, `StoreOrderCaptureFailedMail`, `SubscriptionActivatedMail`, `SubscriptionRenewedMail`, `PaymentFailedMail` (suscripción), `EmailVerifiedWelcomeMail`; notificación `VerifyEmailOtp` con vista `mail.auth.verify-email-otp`. Helper `App\Support\PayPalErrorMessage`. Enganche captura fallida: `PayPalCheckoutController::capture`; webhook: `PayPalWebhookController::handleSubscriptionPaymentFailed`; bienvenida: `EmailVerificationOtpController` tras verificar. Tests: `tests/Feature/Mail/HistoriasPorCorreoMailViewsTest.php`, ampliaciones en `PayPalCheckoutTest` y `PayPalSubscriptionWebhookTest`. |

---

## Pendiente / por definir

Prioriza según negocio. Las viñetas refieren temas mencionados en consultas previas que **aún no están cerrados** en código o solo están parcialmente planteados.

### Checkout y PayPal

- [ ] Flujo **carrito mixto** (productos + suscripción historia) con dos vías PayPal: **Orders** (pago único) y **Subscriptions** (recurrente), persistencia en `store_orders` / `store_order_items` y `suscripciones`.
- [ ] **Webhooks** PayPal: verificación con `PAYPAL_WEBHOOK_ID`, eventos de suscripción (`BILLING.SUBSCRIPTION.*`, `PAYMENT.SALE.*` según doc actual), idempotencia y tabla `pasarela_eventos` / sincronización de estados.
- [ ] Tras login/registro: **retorno a tienda** con carrito persistido y drawer abierto (si aplica al flujo actual).
- [ ] Mostrar **métodos de pago guardados** (`metodos_pago_usuario`) en checkout con opción “otro método”.

### Tienda pública y datos

- [ ] **Welcome**: slider de historias desde BD (destacadas o criterio acordado) si no está ya enlazado al 100%.
- [ ] Revisión/evaluación formal del flujo de compra PayPal + suscripciones (checklist QA y pruebas con simulador de webhook).

### Panel cliente / correos

- [ ] **Órdenes de productos** (`/user/orders`): confirmar que todo el listado sea BD real (similar a lo hecho en suscripciones) y tipografía en `UserLayout` si falta.
- [x] **Correos unificados**: layout compartido para compra, suscripción, fallo de pasarela (órden + suscripción), OTP de verificación y bienvenida posverificación (Fortify OTP del proyecto). Pendiente aparte: recuperación de contraseña Fortify si se personaliza más adelante.

### Productos / historias admin

- [ ] Alinear **crear producto** con historias (rich editor, detalle inclusiones JSON, multimedia, vídeo/galería) y quitar variantes / tipo envío si aún hay restos en UI.
- [ ] **Catálogo productos** en tienda: paginación y detalle desde BD (si no está completo en todas las rutas).

### Recordatorios de suscripción (negocio)

- [ ] Job / correo en `proximo_cobro` (recordatorio o cobro automático según decisión con PayPal Subscriptions en producción).

---

## Cómo actualizar este documento

1. Al **terminar** una viñeta, márcala con `[x]` y muévela a la sección **Completado** con una línea breve y referencia a archivos o PR.
2. Al **nueva consulta** del usuario, si implica trabajo futuro, añade una viñeta en **Pendiente**.
3. Evita duplicar lo que ya está en `README` o issues del repo; aquí solo el **seguimiento** de este hilo de consultas.

---

*Última actualización: correos transaccionales unificados «Historias por Correo» + seguimiento de pendientes.*
