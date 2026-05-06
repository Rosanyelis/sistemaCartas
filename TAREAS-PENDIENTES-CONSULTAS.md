# Tareas pendientes (seguimiento por consultas)

Este archivo resume **lo ya abordado** en el código y **lo que sigue pendiente** según los hilos de conversación con el asistente. Actualízalo cuando cierres una tarea o añadas un nuevo requisito.

---

## Completado recientemente

| Área | Descripción |
|------|-------------|
| Dashboard admin | `DashboardMetricasService`: suscripciones por historia con columna `estado` = `activa`; ventas del mes con `StoreOrder::STATUS_PAID`; gráfico de ventas usando `store_order_items` + slugs en `historias` / `productos` (sin `buyable_type`). Tests en `tests/Feature/Admin/DashboardMetricasServiceTest.php`. |
| Suscripciones cliente | `/user/subscriptions`: datos desde `suscripciones` del usuario con `historia` cargada; serializador `App\Support\SuscripcionUsuarioListaSerializer`. Tests en `tests/Feature/User/SubscriptionsIndexTest.php`. |
| Órdenes cliente | `/user/orders`: listado desde BD (`store_orders` + `store_order_items` del usuario, estados pagado / captura fallida); serialización `App\Support\Store\ClientePedidoLinea`. Tipografía alineada con la página de suscripciones (`Inter`). Tests en `tests/Feature/User/OrdersIndexTest.php`. |
| Tienda inicio | Ruta `/`: slider de historias **desde BD** (`destacada` = sí, `activo`) y bloque de productos activos; respaldo en front solo si faltan props. Ver `routes/web.php` (nombre `home`). |
| Catálogo productos tienda | `/productos`: listado paginado (`paginate(12)`), filtros por categoría; `/productos/{slug}` desde BD. |
| Webhooks PayPal (base) | `PayPalWebhookController`: eventos suscripción y venta, idempotencia por `paypal_event_id` en `pasarela_eventos`, verificación de firma cuando `paypal.webhook_verify` y `PAYPAL_WEBHOOK_ID` están configurados. |
| Correos unificados | Plantilla `resources/views/mail/layouts/historias-por-correo.blade.php`; Mailables checkout + OTP + bienvenida; `App\Support\PayPalErrorMessage`; tests en `tests/Feature/Mail/HistoriasPorCorreoMailViewsTest.php` y PayPal. |
| Carrito tienda (no mixto) | Modo derivado del contenido (`resources/js/lib/cart-mode.ts`: `getDerivedCartMode`, `normalizeCartItemsHomogeneous`). `CartProvider`: `addItem` / `addHistoriaSuscripcion` devuelven `boolean` y admiten `replaceOtherKind`. Persistencia normalizada en `cart-storage.ts`. Checkout: solo PayPal Orders **o** solo Subscriptions (`CartDrawer.tsx`). Modal `CartConflictModal.tsx`; entradas en `detalles-producto.tsx`, `detalles-historia.tsx`, `GridProductsSection.tsx`. Suscripción: flujo UI → `PayPalSubscriptionButtons` + `checkout.paypal.subscription.draft` (backend ya existente). |

---

## Pendiente / por definir

Prioriza según negocio. Las viñetas son trabajo **no cerrado** o que requiere decisión de negocio / alcance mayor.

### Checkout y PayPal

- [ ] **Política actual:** carrito **no mixto** (productos XOR suscripciones). Un carrito mixto en un solo cobro PayPal no está previsto salvo cambio de negocio.
- [ ] Tras login/registro: **retorno a tienda** con carrito persistido y drawer abierto (si aplica al flujo actual).
- [ ] Mostrar **métodos de pago guardados** (`metodos_pago_usuario`) en checkout con opción «otro método».

### Tienda pública y QA

- [ ] Revisión formal **QA** del flujo compra PayPal + suscripciones (checklist y simulador de webhooks en sandbox/producción).

### Panel cliente / correos

- [ ] Personalizar correo de **recuperación de contraseña** Fortify con la misma plantilla base de correos (opcional).

### Productos / historias admin

- [ ] Alinear **crear/editar producto** con historias (rich editor, inclusiones JSON, multimedia) y eliminar restos de variantes / tipo envío en UI si aún existen.

### Recordatorios de suscripción (negocio)

- [ ] Job / correo previo a `proximo_cobro` (recordatorio al usuario; el cobro lo sigue gestionando PayPal Subscriptions).

---

## Cómo actualizar este documento

1. Al **terminar** una viñeta, márcala con `[x]` y muévela a la sección **Completado** con una línea breve y referencia a archivos o PR.
2. Si una **nueva consulta** implica trabajo futuro, añade una viñeta en **Pendiente**.
3. Evita duplicar README u issues; aquí solo el **seguimiento** de este hilo.

---

*Última actualización: carrito tienda sin mezcla productos/suscripciones + checkout y vista suscripción alineados al backend PayPal.*
