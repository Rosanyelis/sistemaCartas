# DIAGRAMA_ENTIDAD_RELACION

> Diagrama Mermaid generado del análisis de migraciones y modelos.
> Refleja el estado del esquema en la rama actual.

## Diagrama ERD (Mermaid)

```mermaid
erDiagram
    USERS ||--o{ STORE_ORDERS : "realiza"
    USERS ||--o{ SUSCRIPCIONES : "tiene"
    USERS ||--o{ METODOS_PAGO_USUARIO : "posee"
    USERS ||--o{ OTP_CODES : "usa (en users.otp_code/otp_expires_at)"

    USERS ||--|| USER_PROFILE_FIELDS : "extiende (avatar, direction, zip_code, phone)"

    STORE_ORDERS ||--|{ STORE_ORDER_ITEMS : "contiene"
    STORE_ORDERS ||--o{ PASARELA_EVENTOS : "audita"
    STORE_ORDERS }o--|| STORE_ORDERS_USER_NULL : "user_id nullable (nullOnDelete)"

    SUSCRIPCIONES }o--|| HISTORIAS : "apunta a"
    SUSCRIPCIONES }o--o| STORE_ORDERS : "derivada de (opcional)"
    SUSCRIPCIONES ||--o{ PASARELA_EVENTOS : "audita"

    HISTORIAS ||--|{ HISTORIA_GALERIAS : "tiene"
    HISTORIAS ||--|{ HISTORIA_VARIANTES : "papel|color"
    HISTORIAS ||--|{ ENTREGAS : "entregas físicas planificadas (modelo disponible)"
    HISTORIAS ||--|{ HISTORIA_CAPITULOS : "modelo disponible (sin uso activo)"
    HISTORIAS ||--|{ AUDIOS : "audios narrativos"
    HISTORIAS ||--|{ SUSCRIPCIONES : "suscriptores"
    HISTORIAS }o--|| HISTORIA_CATEGORIAS : "clasificada en"

    PRODUCTOS ||--|{ PRODUCTO_GALERIAS : "tiene"
    PRODUCTOS }o--o| PRODUCTO_CATEGORIAS : "clasificada en (restrictOnDelete)"
    PRODUCTOS }o--o| PRODUCTO_SUBCATEGORIAS : "subclasificada en (nullOnDelete)"

    PRODUCTO_CATEGORIAS ||--o{ PRODUCTO_SUBCATEGORIAS : "agrupa"

    TIPO_METODO_PAGO ||--|{ METODOS_PAGO_USUARIO : "define"

    AUDIOS }o--|| HISTORIAS : "pertenece"

    PASARELA_EVENTOS {
        string paypal_event_id "unique (idempotencia)"
        string event_type "PAYMENT.SALE.COMPLETED · BILLING.SUBSCRIPTION.*"
        string estado "pendiente | completado | rechazado"
        json payload
        string mensaje_error
    }

    USERS {
        string name
        string email "unique, lowercase"
        string role "cliente | admin"
        timestamp email_verified_at
        string password
        text two_factor_secret "nullable"
        text two_factor_recovery_codes "nullable"
        timestamp two_factor_confirmed_at "nullable"
        string avatar "nullable"
        string direction "nullable"
        string zip_code "nullable"
        string phone "nullable"
        string otp_code "nullable"
        timestamp otp_expires_at "nullable"
    }

    STORE_ORDERS {
        string paypal_order_id "unique"
        string status "pending_payment | paid | capture_failed"
        char currency "3 (ISO)"
        decimal total "12,2"
        string paypal_capture_id "nullable"
        string paypal_capture_status "nullable"
        json paypal_capture_payload "nullable"
        text failure_message "nullable"
        json failure_payload "nullable"
    }

    STORE_ORDER_ITEMS {
        string product_slug "160 (no FK, denormalizado)"
        string product_name "255 (snapshot)"
        unsigned_integer quantity
        decimal unit_price "12,2"
        decimal line_total "12,2"
    }

    SUSCRIPCIONES {
        string tipo "PayPal | Mensual (legacy)"
        unsigned_integer cantidad "default 1"
        unsigned_small_integer meses_entrega_total "nullable (arco)"
        date fecha_adquisicion
        date fecha_finalizacion "nullable"
        date proximo_cobro "nullable"
        timestamp renewal_reminder_sent_at "nullable"
        string estado "activa | inactiva | pendiente"
        string paypal_product_id "nullable"
        string paypal_plan_id "nullable"
        string paypal_subscription_id "nullable, unique"
        json paypal_last_payload "nullable"
    }

    HISTORIAS {
        string nombre
        string slug "unique"
        string codigo "unique"
        string imagen "nullable, /storage/...webp"
        string video "nullable, /storage/...mp4"
        string descripcion_corta
        text descripcion_larga "max 15000 chars"
        json detalle "max 20 (icon/title/description)"
        unsigned_bigint historia_categoria_id "nullable (restrictOnDelete)"
        string autor
        decimal precio_base "12,2"
        decimal precio_promocional "nullable, 12,2"
        decimal precio_suscripcion "nullable, 12,2 (override)"
        decimal impuesto "5,2 default 0"
        string peso "nullable"
        string dimensiones "nullable"
        string estado "activo | pausado"
        enum destacada "si | no (default no)"
        timestamp fecha_publicacion "nullable"
        integer duracion_meses "nullable"
        string paypal_product_id "nullable"
        string paypal_plan_id "nullable"
        decimal paypal_plan_amount "nullable, 12,2"
        unsigned_small_integer paypal_plan_interval_meses "nullable"
    }

    PRODUCTOS {
        string nombre
        string slug "unique"
        string codigo "unique"
        string imagen "nullable"
        string video "nullable (ya existía: tabla actual NO expone campo al form de producto)"
        string descripcion_corta
        text descripcion_larga "max 500 words (MaxWords rule)"
        json detalle "max 20"
        unsigned_bigint producto_categoria_id "nullable (restrictOnDelete)"
        unsigned_bigint producto_subcategoria_id "nullable (nullOnDelete)"
        decimal precio_base
        decimal precio_promocional "nullable"
        decimal impuesto "default 0"
        unsigned_integer stock "default 0"
        string peso
        string dimensiones
        string estado "activo | pausado"
    }

    AUDIOS {
        unsigned_bigint historia_id "FK cascade"
        string titulo
        string slug "unique (route key)"
        string codigo "unique, nullable"
        string audio_path "nullable (disk local)"
        string qr_path "nullable (/storage/qr/audios/...png)"
        unsigned_integer duracion_segundos "nullable"
        unsigned_big_integer tamano_bytes "nullable"
        string mime_type "nullable"
        string estado "activo | pausado"
    }

    HISTORIA_VARIANTES {
        enum tipo "papel | color"
        text valor
    }

    HISTORIA_GALERIAS {
        string path
        enum tipo "imagen | video"
        boolean es_principal "default false"
    }

    PRODUCTO_GALERIAS {
        string path
        string tipo "default imagen"
        boolean es_principal "default false"
    }

    HISTORIA_CATEGORIAS {
        string nombre "unique"
    }

    PRODUCTO_CATEGORIAS {
        string nombre "unique 255"
    }

    PRODUCTO_SUBCATEGORIAS {
        unsigned_bigint producto_categoria_id "FK cascade"
        string nombre "255"
    }

    METODOS_PAGO_USUARIO {
        unsigned_bigint user_id "FK cascade"
        unsigned_bigint tipo_metodo_pago_id "FK cascade"
        string titular
        string detalles
        boolean is_default
    }

    TIPO_METODO_PAGO {
        string nombre
        string icono "default credit-card"
        boolean is_active "default true"
    }
```

## Descripción de cada entidad y su rol

| Entidad (modelo) | Tabla | Rol de negocio |
|------------------|-------|----------------|
| **User** | `users` | Usuarios con rol `cliente` o `admin`. Soporta 2FA TOTP, OTP para verificación de email y reset de password (almacenado en `users.otp_code` y `users.otp_expires_at`). |
| **Historia** | `historias` | Producto narrativo central. Tiene galería multimedia, variantes (papel/color), capítulos opcionales y modelo de suscripción mensual PayPal. Asocia `paypal_product_id` y `paypal_plan_id` cacheados. |
| **Producto** | `productos` | Producto físico de catálogo (papelería, coleccionables, regalos). Control de stock, precio base/promoción, galería, IVA. |
| **Suscripcion** | `suscripciones` | Relación `user × historia` con periodicidad (mensual), arco de meses de entrega, fechas, estado (`activa|inactiva|pendiente`), y metadata PayPal (`paypal_subscription_id`, último payload). |
| **StoreOrder / StoreOrderItem** | `store_orders` / `store_order_items` | Pedidos de catálogo (cobro único). Items **denormalizan** slug + nombre para sobrevivir soft delete de Producto. |
| **PasarelaEvento** | `pasarela_eventos` | Auditoría idempotente de eventos PayPal (orders y subscriptions). Único por `paypal_event_id` (excepto eventos internos del sync, que usan `sync-{id}`). |
| **Audio** | `audios` | Audios narrativos públicos vinculados a una historia. Slug es la route key. Archivos en disco `local`; QR generado en disco `public`. |
| **HistoriaCategoria / HistoriaGaleria / HistoriaVariante / Entrega / HistoriaCapitulo** | `historia_*` / `entregas` | Anatomía modular de la historia. `Entrega` y `HistoriaCapitulo` tienen modelos pero no se usan activamente en CRUD público. |
| **ProductoCategoria / ProductoSubcategoria / ProductoGaleria** | `producto_*` | Taxonomía N:M efectiva (categoría → subcategoría → producto) más galería. |
| **TipoMetodoPago / MetodoPagoUsuario** | `tipos_pago` / `metodos_pago_usuario` | Métodos de pago del usuario (PayPal actualmente). Whitelist configurable en `config/payments.php:allowed_profile_method_type_names`. |

## Cardinalidades críticas

- **Historia ↔ Suscripción**: 1↔N. Una historia admite múltiples suscriptores.
- **Usuario ↔ Suscripción**: 1↔N. Un usuario puede tener varias suscripciones a distintas historias.
- **Usuario ↔ Historia activa**: pre-check impide duplicar `Suscripcion` con `estado='activa'` por usuario×historia (`PayPalSubscriptionCheckoutController@draft:42`).
- **StoreOrder ↔ StoreOrderItem**: 1↔N (cascadeOnDelete).
- **StoreOrder ↔ PasarelaEvento**: 1↔N (nullOnDelete).
- **StoreOrder ↔ Suscripcion**: relación opcional vía `suscripciones.store_order_id` (cascade pending) que identifica la orden de catálogo que disparó la suscripción.
- **ProductoCategoria ↔ Producto**: restrictOnDelete (no se puede borrar categoría con productos asociados).

## Restricciones notables

- **Soft Deletes:** `historias`, `productos`, `audios` usan `SoftDeletes`.
- **Unique clave natural:** `historias.slug`, `historias.codigo`, `productos.slug`, `productos.codigo`, `audios.slug`, `audios.codigo`, `historia_categorias.nombre`, `producto_categorias.nombre`, `[producto_categorias_id, nombre]` único compuesto, `pasarela_eventos.paypal_event_id`, `users.email`.
- **Índices:** `historias(estado, destacada, fecha_publicacion)`, `productos(estado)`, `suscripciones(estado, fecha_adquisicion)`, `pasarela_eventos(event_type, estado)`.
- **Enumeraciones:** `users.role` = `cliente|admin`; `historias.estado` y `productos.estado` = `activo|pausado`; `historias.destacada` = `si|no`.
- **Defaults importantes:** `users.role` default `cliente`; `users.otp_expires_at` 10 min (en `User::generateOtp()`).
