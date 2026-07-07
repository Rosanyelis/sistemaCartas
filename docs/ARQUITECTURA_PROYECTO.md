# ARQUITECTURA_PROYECTO

> Historias por Correo (`sistemaCartas`) — Levantamiento estructural completo.
> Documento estable; refleja el estado del repositorio al momento del análisis.
> Compatible con Laravel 12.x, Inertia v2, React 19, Tailwind v4.

---

## 1. Resumen ejecutivo

Plataforma **SPA monolítica** servida por Laravel 12 + Inertia v2 + React 19.
Modelo de negocio dual:
- **Catálogo de productos** (cobro único vía PayPal Orders v2).
- **Suscripciones a «historias»** (cobro recurrente mensual vía PayPal Subscriptions v1).

El proyecto **no es una API REST pura**: el backend renderiza páginas vía Inertia
(`Inertia::render(...)`) y el cliente React consume el contrato `Inertia::share`
y los endpoints JSON de checkout (`/checkout/paypal/*`, `/webhooks/paypal`,
`/admin/*`, `/user/*`).

Wayfinder genera funciones TS tipadas para rutas y acciones (`resources/js/actions/...`)
descubiertas vía `app/Http/Controllers/**/*.php`.

---

## 2. Módulos del sistema

| Módulo | Carpeta | Función |
|--------|---------|---------|
| Tienda pública | `app/Http/Controllers/Storefront/` + `resources/js/pages/user/` | Home, listado/detalle productos, listado/detalle historias, audio público, legales |
| Carrito | `resources/js/contexts/cart-context.tsx`, `lib/cart-mode.ts`, `lib/cart-storage.ts` | Estado cliente en sessionStorage `v2`; modo homogéneo `products | subscriptions` |
| Checkout | `app/Http/Controllers/Checkout/` | PayPal Orders (productos), PayPal Subscriptions (historias), Sync, Webhook |
| Panel Admin | `app/Http/Controllers/Admin/` + `resources/js/pages/admin/` | Dashboard, CRUD taxonomías, productos, historias, audios, órdenes, suscripciones, clientes |
| Cliente logueado | `app/Http/Controllers/User/` + `resources/js/pages/user/` | Pedidos, Suscripciones, Perfil, Historial de pagos |
| Auth | `app/Http/Controllers/Auth/`, `app/Actions/Fortify/` | Fortify + OTP email verification + OTP password reset + 2FA TOTP |
| Media | `app/Services/Media/` | Compresión WebP (Intervention v3) y transcodificación MP4 (FFmpeg) |
| Audio | `app/Services/Audio/`, `app/Http/Controllers/Storefront/Audio*Controller.php`, `app/Http/Controllers/Admin/AudioController.php` | Almacenamiento en disco `local`, QR con logo, streaming por rangos |
| Métricas | `app/Services/Admin/DashboardMetricasService.php` | Conteos, ventas por mes, suscripciones por historia (compatible SQLite y MySQL) |
| Exportaciones | `app/Services/Admin/ExportService.php` + `app/Exports/Admin/*` | Maatwebsite Excel para Productos, Historias, Órdenes, Suscripciones, Clientes |
| Soporte | `app/Support/` | Serializadores, helpers de IVA, validación de redirect, sincronización PayPal activación |
| Demo data | `database/seeders/DashboardDemoDataSeeder.php` + comando `demo:seed-dashboard` | 30 clientes / 30 productos / 30 historias / 50 órdenes / 45 suscripciones |

---

## 3. Capas de la aplicación

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Navegador (SPA)                            │
│ React 19 + Inertia v2 (CartProvider, history-based, deferred props)     │
│ - Pages /user, /admin, /auth, /legal, /settings                        │
│ - Wayfinder: imports de @/actions + @/routes                            │
└─────────────────────────────────────────────────────────────────────────┘
                          │ XHR (Inertia + fetch JSON)
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Laravel 12 + bootstrap/app.php                   │
│ Middleware: HandleAppearance · HandleInertiaRequests · AddLinkHeaders   │
│ CSRF except: /webhooks/paypal                                           │
│ Routes: web.php + settings.php + console.php                            │
└─────────────────────────────────────────────────────────────────────────┘
        │                       │                     │
        ▼                       ▼                     ▼
┌─────────────────┐  ┌───────────────────┐  ┌───────────────────────┐
│   Controllers    │  │     Services      │  │    Support / Enums    │
│ Admin · User ·   │  │ PayPal · PayPal   │  │ TiendaIva · Historia… │
│ Storefront ·     │  │ Plan · Pasarela   │  │ Precio · Catalogo…    │
│ Checkout · Auth  │  │ Recorder · Media  │  │ Serializer ·          │
│ · Settings       │  │ · Audio · Admin   │  │ ValidPublicStore…     │
└─────────────────┘  └───────────────────┘  └───────────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────────────────────────────┐    ┌────────────────────────┐
│  Eloquent Models (app/Models)           │    │  Mailables / Notifs    │
│  Historia · Producto · Suscripcion      │    │  8 mail + 2 notif OTP  │
│  StoreOrder/Item · Audio · HistoriaCap  │    └────────────────────────┘
│  Entrega · PasarelaEvento · User        │
│  TipoPago · MetodoPagoUsuario           │    ┌────────────────────────┐
│  Historias/Productos Taxonomías         │    │   Storage / Disks      │
└─────────────────────────────────────────┘    │   local · public       │
                                               └────────────────────────┘
        │
        ▼
┌─────────────────────────┐    ┌─────────────────────────┐    ┌──────────────────┐
│  Migrations (24)        │    │  Pest 4 Tests           │    │  GitHub Actions  │
│  - users / sessions     │    │  Feature + Unit + Mail  │    │  tests / lint /  │
│  - cache / jobs         │    │  90+ casos              │    │  deploy Ubuntu   │
│  - historias / productos│    └─────────────────────────┘    └──────────────────┘
│  - suscripciones /      │
│   pasarela_eventos /    │
│   store_orders /        │
│   audios / taxonomías   │
└─────────────────────────┘
```

---

## 4. Entidad–Relación (resumen funcional)

- **users** (1) ─< (N) **store_orders** >─ (N) **store_order_items**
- **users** (1) ─< (N) **suscripciones** >─ (1) **historias**
- **users** (1) ─< (N) **metodos_pago_usuario** >─ (1) **tipos_pago**
- **historias** (1) ─< (N) **historia_galerias** | **historia_variantes** | **entregas** | **historia_capitulos** | **audios** | **suscripciones**
- **historias** (N) ─> (1) **historia_categorias**
- **productos** (1) ─< (N) **producto_galerias**
- **productos** (N) ─> (1) **producto_categorias** y (N) ─> (1) **producto_subcategorias**
- **store_orders** (1) ─< (N) **suscripciones** (cross-link opcional)
- **store_orders** (1) ─< (N) **pasarela_eventos** (NULLable)
- **suscripciones** (1) ─< (N) **pasarela_eventos** (NULLable)

> Notas operativas:
> - `store_order_items` denormaliza `product_slug` + `product_name` (no FK directa) para sobrevivir a soft delete del producto.
> - `historias.categoria` (string) **fue eliminada** en favor de `historia_categoria_id` (migración `2026_05_17_190306`).
> - `productos.categoria` y `productos.subcategoria` (string) **fueron eliminadas** en favor de FK (migración `2026_04_22_120000`).
> - `audios.audio_path` es NULLable (migración `2026_07_02_020452`).

---

## 5. Rutas (resumen)

| Prefijo | Middleware | Notas |
|---------|-----------|-------|
| `/` `home` (GET) | — | Home pública |
| `/historias`, `/historias/{slug}` | — | Catálogo público historias |
| `/productos`, `/productos/{slug}`, `/productos/ejemplo` | — | Catálogo público productos |
| `/audios/{audio:slug}` | — | Página pública de audio |
| `/audios/{audio:slug}/stream` | throttle:60,1 | Stream por rangos |
| `/terminos-y-condiciones`, `/aviso-de-privacidad` | — | Legales |
| `/password/send-otp|verify-otp|reset-with-otp` | — | Reset password (guest) |
| `/email/verify`, `/email/verification-otp*` | auth | Verificación email con OTP |
| `/checkout/paypal/order`, `/checkout/paypal/capture` | — | Orders v2 |
| `/checkout/paypal/subscription/draft|sync` | auth+verified | Subscriptions v1 |
| `/webhooks/paypal` (POST) | csrf except | Eventos PayPal |
| `dashboard` | auth | Redirige admin → `/admin/dashboard`, cliente → `/user/orders` |
| `/user/...` | auth | orders, subscriptions.{cancel}, profile, profile.avatar, profile.payment-methods.{store,destroy,set-default} |
| `/admin/...` | auth + can:admin | CRUD, exports Excel, dashboard |
| `/settings/...` | auth (+verified para destroy/security) | Perfil, contraseña, apariencia |

Aliases legacy `/admin/{orders,subscriptions,clients,stories,products}` redirigen a canónicos en español.

---

## 6. Flujos críticos

### 6.1 Compra one-shot (catálogo productos)
1. Cliente agrega al carrito (`CartContext.addItem`).
2. Cliente abre checkout (`PayPalCheckoutButtons` carga SDK vía `load-paypal-script`).
3. Frontend `POST /checkout/paypal/order` →
   `PayPalCheckoutController@createOrder` valida stock por slug, lock `lockForUpdate`,
   calcula IVA con `TiendaIva::grossFromNet`, crea `StoreOrder` (status=`pending_payment`),
   items, evento `CHECKOUT_ORDER_CREATED`.
4. SDK PayPal aprueba → frontend llama `POST /checkout/paypal/capture` →
   `PayPalCheckoutController@capture` (transacción, lock productos, decrementa stock,
   status `paid`, evento `CHECKOUT_ORDER_CAPTURED`, mail `StoreOrderPaidMail`).
5. Errores PayPal → status `capture_failed` + email `StoreOrderCaptureFailedMail`.

### 6.2 Suscripción a historia
1. Cliente autenticado (email verificado) hace clic en «Suscribirme» desde `/historias/{slug}`.
2. `POST /checkout/paypal/subscription/draft` →
   `PayPalSubscriptionCheckoutController@draft`:
   - Asegura un plan PayPal activo por historia (`HistoriaPayPalPlanService::ensureBillingPlanForHistoria`,
     idempotente, `DB::transaction + lockForUpdate`; crea producto y plan si cambian
     `precio_suscripcion` o `paypal_plan_amount`).
   - Crea `Suscripcion` local en estado `pendiente` con `paypal_plan_id` cacheado.
   - Llama `PayPalService::createSubscriptionDraft` con `custom_id = id local`.
3. SDK PayPal aprueba → frontend `POST /checkout/paypal/subscription/sync` con
   `subscription_id` → `PayPalSubscriptionSyncController` consulta estado remoto,
   aplica `SuscripcionPayPalActivationSync::applyFromActivatedResource` y envía
   `SubscriptionActivatedMail`.
4. Webhook `BILLING.SUBSCRIPTION.ACTIVATED` (idempotente por `paypal_event_id`)
   re-sincroniza local → `SubscriptionActivatedMail` solo si hubo transición inactiva → activa.
5. Cobros recurrentes → webhook `PAYMENT.SALE.COMPLETED` actualiza `proximo_cobro`,
   reset `renewal_reminder_sent_at`, mail `SubscriptionRenewedMail`.
6. Comandos programados:
   - `subscriptions:send-renewal-reminders` (diario 09:00) → mail
     `SubscriptionRenewalReminderMail` para suscripciones con `proximo_cobro` en
     `today + renewal_reminder_days_before`, una sola vez.
7. Cancelación usuario `POST /user/subscriptions/{suscripcion}/cancel` → cancela en
   PayPal remoto, marca local `inactiva`. Policy `SuscripcionPolicy::cancel` =
   dueño del recurso.

### 6.3 Registro / verificación / login
- Registro vía Fortify (`/register`). Crea usuario `role=cliente`.
- Verificación email con OTP (6 dígitos, 10 min) — `User::sendEmailVerificationNotification()`.
- Login throttled 5/min por `email|ip` (`FortifyServiceProvider::configureRateLimiting`).
- Tras login si email no verificado → `verification.notice` guardando redirect en sesión.
- Password reset con OTP (3 pasos: send-otp, verify-otp→reset_token en cache 10min, reset-with-otp).
- 2FA TOTP opcional (Fortify `Features::twoFactorAuthentication`).

### 6.4 Panel admin
- Gate `admin` (=`role==='admin'`).
- Policies con trait `GrantsAllAbilitiesToAdmins` (admin = todo; cliente denegado).
- CRUD productos / historias / audios con compresión automática (WebP / MP4).
- Dashboard con props `defer` para no bloquear render.
- Export Excel vía `ExportService` (no queues, síncrono).

### 6.5 Audio público
- `POST /admin/audios` con archivo → `AudioStorageService::store` (disk `local`),
  `AudioQrGeneratorService::generate` (Endroid).
- `GET /audios/{slug}` → página pública con reproductor.
- `GET /audios/{slug}/stream` (throttle 60/min) → `AudioStorageService::streamResponse`
  con soporte `Range: bytes=` (HTTP 206).

---

## 7. Dependencias externas

| Servicio | Variables `.env` | Función |
|----------|------------------|---------|
| **PayPal** | `PAYPAL_MODE`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_CURRENCY`, `PAYPAL_WEBHOOK_ID`, `PAYPAL_WEBHOOK_VERIFY` | Cobros y suscripciones |
| **SMTP** | `MAIL_MAILER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_*` | OTP, confirmaciones, recordatorios |
| **FFmpeg** (binario) | `FFMPEG_BINARIES`, `FFPROBE_BINARIES` | Transcodificación de video |
| **PHP GD** (`gd2` con WebP) | del sistema | Compresión de imágenes a WebP |
| **MySQL/MariaDB** (producción) | `DB_*` | Persistencia. SQLite sólo local |
| **Redis** (opcional, no usado actualmente) | `REDIS_*` | declarado en `.env.example` |
| **S3** (declarado, no usado) | `AWS_*` | posible futuro |
| **Contabo / CloudPanel** (deploy) | secrets GH environment `historias-correos` | SSH deploy workflow |

---

## 8. Archivos fuente clave (para navegación)

| Archivo | Rol |
|---------|-----|
| `bootstrap/app.php` | Middleware, CSRF except, scheduler |
| `routes/web.php` | Todas las rutas (públicas, auth, verified, admin) |
| `app/Models/{Historia,Producto,Suscripcion,StoreOrder,Audio,PasarelaEvento,User}.php` | Núcleo de datos |
| `app/Services/PayPalService.php` | Cliente REST manual completo |
| `app/Services/HistoriaPayPalPlanService.php` | Idempotencia plan PayPal |
| `app/Services/PasarelaEventoRecorder.php` | Idempotencia eventos |
| `app/Services/Admin/DashboardMetricasService.php` | Métricas y gráficos (SQLite + MySQL safe) |
| `app/Services/Media/WebpImageStorageService.php` | Compresión WebP (Intervention v3) |
| `app/Services/Media/HistoriaVideoStorageService.php` | FFmpeg + reintentos CRF |
| `app/Services/Audio/AudioStorageService.php` + `AudioQrGeneratorService.php` | Audio + QR |
| `app/Http/Controllers/Checkout/PayPal*Controller.php` | Checkout y webhooks |
| `app/Http/Controllers/Admin/{Producto,Historia,Audio,Orden,Suscripcion,Cliente}Controller.php` | CRUD admin |
| `app/Http/Controllers/User/{Orden,Suscripcion,Profile,Producto,Historia}Controller.php` | Cliente logueado |
| `app/Http/Controllers/Storefront/HomeController.php` + `AudioPublicController.php` + `AudioStreamController.php` | Vitrina |
| `app/Http/Controllers/Auth/{EmailVerificationOtp,PasswordResetOtp}Controller.php` | OTP |
| `app/Actions/Fortify/CreateNewUser.php` + `app/Providers/FortifyServiceProvider.php` | Registro |
| `app/Http/Responses/{StorefrontLoginResponse,StorefrontRegisterResponse}.php` | Custom Fortify responses |
| `app/Policies/Concerns/GrantsAllAbilitiesToAdmins.php` | Trait policies |
| `app/Support/{TiendaIva,HistoriaSuscripcionPrecio,SuscripcionPayPalActivationSync,PayPalErrorMessage,ValidPublicStoreRedirect,InertiaSharedUser,HistoriaCatalogoSerializer,ProductoTiendaSerializer,AudioPublicSerializer}.php` | Helpers |
| `app/Http/Middleware/HandleInertiaRequests.php` | Props compartidos Inertia (auth, paypal, tienda, paymentMethods, flash) |
| `app/Providers/AppServiceProvider.php` | Gate `admin`, registro de policies, password policy producción |
| `resources/js/{app,ssr}.tsx` | Bootstrap React/Inertia |
| `resources/js/contexts/cart-context.tsx` | Carrito (productos | suscripciones) |
| `resources/js/components/tienda/PayPal{Checkout,Subscription}Buttons.tsx` | Integración SDK |
| `resources/js/components/admin/dashboard/*` | Dashboard visual |
| `resources/js/components/admin/create-story/{LimitedWordRichEditor,HistoriaVariantesEditor,HistoriaDetalleInclusionsEditor}.tsx` | Formularios historia |
| `resources/js/components/admin/create-product/ProductoMultimediaPanel.tsx` | Formulario producto |
| `vite.config.ts` | Plugins Vite (React Compiler, Tailwind v4, Wayfinder) |
| `database/seeders/DashboardDemoDataSeeder.php` + `app/Console/Commands/SeedDashboardDemoCommand.php` | Datos demo |
| `docs/DESPLIEGUE-UBUNTU.md` | Runbook de despliegue |
| `.github/workflows/{tests,lint,deploy}.yml` | CI/CD |

---

## 9. Áreas críticas / riesgos visibles

1. **`store_orders` con `ON DELETE NULL ON user_id`**: órdenes sobreviven a borrado de usuario.
   Quien opera debe recordar: el `_id` queda huérfano, pero el `paypal_order_id` es único,
   lo cual es deseable para auditoría.
2. **Webhooks PayPal**: idempotencia en `pasarela_eventos.paypal_event_id` (único).
   Si `PAYPAL_WEBHOOK_ID` no está definido, registra `Log::warning` y NO verifica firma
   (excepto en `testing`). **No usar en producción sin `PAYPAL_WEBHOOK_ID`.**
3. **`paypal.enabled`**: si las credenciales están vacías, los checkout devuelven 503
   en lugar de cobrar. Tests usan `config(['paypal.enabled' => true])` cuando es necesario.
4. **Stock atómico**: `lockForUpdate` en orden alfabético de slugs (estable, sin deadlocks).
   Si se cae entre validar stock y capturar PayPal, la orden queda `pending_payment` y
   el cliente debe reintentar; no se cobra de más.
5. **IVA configurable**: `config('tienda.iva_percentage')` y `HISTORIAS_*` están en `.env`.
   Cambiar `TIENDA_IVA_PERCENTAGE` afecta inmediatamente a nuevas órdenes y al cargo PayPal
   de suscripción activa (es decir, fuerza `ensureBillingPlanForHistoria` a crear plan nuevo).
6. **Webhook + sync**: el sync sólo se permite en `auth+verified`, evita fugas de IDs.
   El webhook es público pero exige firma en producción.
7. **Audio**: el stream soporta rangos HTTP, throttle 60/min, manejo de 404 si no existe
   el archivo físico.
8. **Demo seeder aborta en producción** (`'No se puede ejecutar en producción'`).
   No queda expuesto a riesgo de fuga accidental.
9. **Paypal `return_url`/`cancel_url`**: `subscriptionApplicationRedirectUrls` fuerza
   `https://` cuando el host no es loopback (evita 422 de PayPal detrás de proxy).
10. **WebPayPal sync `sync-{subscription_id}`**: grabado como `paypal_event_id`
    para no reenviar mail en reiteradas llamadas de sincronización.
