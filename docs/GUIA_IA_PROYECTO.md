# GUIA_IA_PROYECTO

> Reglas operativas para que un agente IA (opencode, Cursor, etc.) trabaje en
> `sistemaCartas` sin romper convenciones ni degradar el sistema.
> Complementa (no reemplaza) `AGENTS.md`, `GEMINI.md` y las skills en `.agents/skills/`.

---

## 0. Convenciones de partida

- **Naturaleza:** Laravel 12 + Inertia v2 (React 19) + Tailwind v4 + Vite 7.
- **Idioma del proyecto:** nombres técnicos en inglés, contenido UI en **español**
  (mensajes, emails, validaciones). Mantener esta coherencia.
- **Moneda:** USD configurada por defecto (`config('paypal.currency')`), IVA porcentual
  configurable (`config('tienda.iva_percentage')`).
- **Roles:** `cliente` (por defecto) y `admin` (gate `admin` definido en
  `app/Providers/AppServiceProvider.php:46`).
- **Comentarios en código:** **NO añadir comentarios** salvo que el usuario lo pida.
  El código existente sigue PHP-FIG y PHPDoc blocks (array shapes) — imitar ese estilo.

---

## 1. Cómo leer la estructura (orden recomendado)

1. `composer.json` + `package.json` → dependencias clave.
2. `bootstrap/app.php` → middleware + scheduler + CSRF except.
3. `routes/web.php` → mapa completo de URLs (incluye aliases legacy en inglés).
4. `app/Models/` → 18 modelos; relaciones se infieren del nombre.
5. `app/Http/Controllers/` (5 namespaces) → responsabilidades claras por rol.
6. `app/Services/` → lógica reutilizable (PayPal, Media, Audio, Admin).
7. `app/Support/` → helpers, serializadores, mutaciones PayPal.
8. `app/Http/Requests/` → Form Requests por namespace; los `Admin/` son los
   críticos porque aplican las reglas estrictas (galería ≤ 5, max 20 inclusiones,
   icon whitelist, max palabras descripciones largas).
9. `app/Policies/` + `app/Policies/Concerns/GrantsAllAbilitiesToAdmins.php` →
   el control de acceso real.
10. `database/migrations/` → historial (incluye renombramientos FK
    `categoria string → *_categoria_id`).
11. `resources/js/{app,ssr}.tsx` → boot cliente.
12. `resources/js/pages/` → 5 namespaces paralelos a los controladores.
13. `resources/js/components/{tienda,admin,ui,panel}/` → bloques reutilizables.
14. `resources/js/contexts/cart-context.tsx` + `lib/cart-{storage,mode}.ts` →
    único estado global no-React-Query.
15. `vite.config.ts` → plugins (React Compiler, Tailwind v4, **Wayfinder**).
16. `tests/` → descubrir los casos existentes antes de añadir nuevos.
17. `docs/DESPLIEGUE-UBUNTU.md` → runbook de servidor.

---

## 2. Cómo añadir una feature sin romper nada

### 2.1 Antes de escribir código
- Buscar si ya existe serializador en `app/Support/` (no exponer modelos crudos).
- Buscar si el form ya existe en `resources/js/components/admin/create-*/` (reutilizar).
- Confirmar que el nuevo archivo no duplica `app/Services/` (PayPal, Media, Audio).
- Si la feature toca **datos sensibles de pago**, pasar por `app/Support/PayPalErrorMessage.php`
  para mensajes al usuario (NO inventar texto).

### 2.2 Backend
- Crear modelo **vía** `php artisan make:model Nombre --factory --migration` (cuando se
  solicite). El proyecto sigue la convención snake_case + plural español en muchos casos
  (`store_orders`, `metodos_pago_usuario`, `tipos_pago`, `audios`, `historia_categorias`).
- Crear Form Request en `app/Http/Requests/{rol}/`. Si valida archivos de imagen,
  usar el trait `ValidatesGaleriaImageLimit` + `PreparesHistoriaDetalleJson` (ya
  preparados para `detalle[]` icon-titulo-desc).
- Antes de tocar `Producto` o `Historia`, **revisar** la migración
  `2026_04_26_190000_*` y `2026_05_17_190306_*` para no reintroducir columnas
  viejas (`categoria` string).
- Toda policy nueva para recurso admin debe:
  - Usar el trait `GrantsAllAbilitiesToAdmins` (regla Laravel: `before` debe ser
    coherente con los stubs `viewAny/view/create/update/delete/duplicate/toggleStatus`).
  - Registrarse en `app/Providers/AppServiceProvider::boot()` (`Gate::policy`).
- Si la feature hace checkout o captura, envolver en `DB::transaction(...)` con
  `lockForUpdate()` sobre las filas afectadas **antes** de llamar a PayPal.
- Errores PayPal → siempre `PasarelaEventoRecorder::recordOrFetchByPayPalEventId`
  (idempotencia por `paypal_event_id`).

### 2.3 Frontend
- **Crear páginas** en `resources/js/pages/{rol}/`. Conectan vía
  `useForm()` (no `useState` manual) — ver `inertia-react-development` skill.
- **Botones PayPal** viven en `resources/js/components/tienda/`. Su carga de
  SDK está centralizada en `lib/load-paypal-script.ts`.
- Para el carrito, **nunca** llamar directamente a `localStorage` ni a `sessionStorage`;
  usar `addItem/addHistoriaSuscripcion` desde `useCart()`.
- Versión de carrito: `CART_VERSION = 2`. Si necesitas migración nueva, subir versión
  y limpiar storage.
- **No crear** componentes UI nuevos que dupliquen los de `resources/js/components/ui/`
  (shadcn-style, generados con `components.json`). Si falta uno, generarlo con
  `npx shadcn add <componente>` y respetar el `style: new-york` del proyecto.
- **No escribir** CSS ad-hoc: usar clases Tailwind v4 (utility-first, `@apply` solo
  dentro de `resources/css/app.css` para `@layer base`).
- Al tocar Tiptap, respetar el wrapper `LimitedWordRichEditor` para mantener el
  límite de palabras.
- Imports Tipados: usar `type X` separado (`@typescript-eslint/consistent-type-imports: prefer-top-level`).

### 2.4 Rutas (Wayfinder)
- Cada nueva ruta debe tener un **nombre** (`->name('...')`).
- Después de modificar `routes/`, ejecutar **`php artisan wayfinder:generate --no-interaction`**
  ANTES de `npm run build`. El output vive en `resources/js/actions/...` y `resources/js/routes/...`,
  no debe commitearse.
- Hardcodear URLs está prohibido (regla Wayfinder). Usar `route('name')` en Laravel y
  funciones generadas en React.

---

## 3. Precauciones obligatorias

### 3.1 Idempotencia PayPal
- `webhook` se ejecuta con `csrf except`. Toda escritura debe pasar por
  `PasarelaEventoRecorder` para no duplicar registros.
- En `PayPalCheckoutController@capture`, si la orden ya está en `STATUS_PAID`, devolver
  200 con el payload cacheado (no volver a PayPal).
- En `PayPalSubscriptionCheckoutController@draft`, si el plan remoto coincide
  con el cacheado, NO crear uno nuevo (el `lockForUpdate` lo garantiza).

### 3.2 Stock e integridad transaccional
- El ordenamiento alfabético de slugs en `lockActiveProductsAndVerifyStock`
  previene deadlocks. Mantenerlo al añadir lógica de stock en otras entidades.
- `Producto::decrement('stock', $qty)` ocurre **después** de capturar en PayPal.

### 3.3 Media
- Imágenes: **siempre** pasan por `WebpImageStorageService::store` (WebP + scaleDown
  1920×1920 q=82). Devuelve ruta pública `/storage/...`. No escribir a `public/` crudo.
- Video: **solo** historias. Productos prohiben `video` en el Form Request.
- Audio: vive en disco `local` (no público). El QR sí vive en disco `public/qr/audios/`.

### 3.4 Permisos / autorización
- `MediaCompressionException` se traduce a `back()->withErrors()` con clave
  `imagen`/`video` (no redirigir a una vista de error).
- En subidas admin, **no** confiar en `php artisan storage:link` como paso automático.
  El deploy.yml ya lo ejecuta, pero en local puede faltar.

### 3.5 Migraciones y modelos
- Si modificas una columna, **mantén todos los atributos previos** (`->change()`,
  doctrine/dbal no necesario con `composer.json` reciente pero documentar).
- Renombrar `*_categoria_id` no es trivial: hay migraciones que convierten texto → FK
  copiando datos. **No** revertir esas migraciones sin antes migrar datos.

### 3.6 Datos sensibles
- **Nunca** commitear `.env`, claves PayPal ni `storage/*.key`.
- `phpunit.xml` ya está configurado con SQLite `:memory:`, queue=sync, mail=array.
  Pest debe seguir corriendo bajo esos defaults.

### 3.7 Roles admin / cliente
- Toda ruta `/admin/*` exige `can:admin`. Nuevas rutas admin deben incluir el grupo
  `Route::middleware('can:admin')->prefix('admin')->name('admin.')`.
- Si añades un nuevo rol, **no** asumir que `Gate::admin` lo deniega implícitamente
  (`$user->isAdmin()` filtra por `role`). Usar Policies explícitas.

---

## 4. Convenciones específicas (las que NO están en `AGENTS.md`)

1. **Validación visual**: español neutro ("Datos guardados", "No se pudo procesar...").
   El sistema ya tiene mensajes únicos por form request.
2. **Flash messages**: usar `with('success', ...)` o `with('error', ...)`. El middleware
   `HandleInertiaRequests` los expone como `props.flash.{success|error|warning}`.
3. **Sesión `verified_storefront_redirect`**: `App\Support\ValidPublicStoreRedirect`
   es el único punto para permitir redirect tras login/verificación. No escribir
   lógica nueva de redirect sin pasar por él.
4. **PayPal `return_url`**: NO añadir URLs absolutas a mano en el código; usar siempre
   `PayPalService::subscriptionApplicationRedirectUrls()`.
5. **IVA**: ni la UI ni los tests deben asumir un valor fijo. Usar
   `config('tienda.iva_percentage')` o `TiendaIva::grossFromNet()`.
6. **DTOs para Inertia**: mantener el shape exacto que devuelve cada serializer
   (`HistoriaCatalogoSerializer::tarjeta`, `ProductoTiendaSerializer::tarjetaCatalogo`,
   `ProductoTiendaSerializer::fichaProducto`, `AudioPublicSerializer`). Reflejan el
   contrato TS (`resources/js/types/*` y `resources/js/types/welcome.ts`).
7. **Build / Deploy**: NO commitear `resources/js/actions/**`, `resources/js/routes/**`,
   `resources/js/wayfinder/**` ni `public/build/**` (`.gitignore` ya los cubre).
8. **Pint**: `vendor/bin/pint --dirty --format agent` después de cualquier cambio PHP.
9. **Prettier + ESLint**:
   `npm run format && npm run lint:check && npm run types:check` antes de PR.
10. **Pest**: usar datasets cuando aplique. `RefreshDatabase` ya está en `tests/Pest.php`.
    No duplicar seeds; preferir factories (`database/factories/`) que ya existen.

---

## 5. Errores comunes que la IA debe evitar

| ❌ Error | ✅ Forma correcta |
|---------|-------------------|
| Importar `InteractsWithQueue` en un Job cuando ya se usa `dispatchSync` | Dejar como `use Dispatchable;` (estilo actual) |
| Crear migration `add_*_column_to_*` sin preservar atributos | Usar `Schema::table(...)` con TODAS las opciones previas y `->change()` |
| Devolver modelo crudo en respuesta Inertia | Usar `app/Support/*Serializer::*` |
| Hacer `->all()` sobre `rules()` en Form Request | Ya está bien en el código existente, replicar patrón |
| Usar `routes/web.php` para definir form en lugar de `routes/settings.php` | El settings.php está separado por Fortify |
| Crear role nuevo sin actualizar `AppServiceProvider::boot` `Gate::define('admin', ...)` y el trait `GrantsAllAbilitiesToAdmins` | Actualizar todo a la vez |
| Hacer `Mail::send()` dentro de la transacción en lugar de `DB::afterCommit(...)` | El patrón actual usa `afterCommit` precisamente para evitar emails de cargos revertidos |
| Modificar `paypal_event_id` para que NO sea unique | Único por diseño: la idempotencia depende de ello |
| Añadir UI shadcn sin ejecutar `npx shadcn add` | Generar con el CLI para mantener `style: new-york` |
| Reducir IVA en checkout sin regenerar el plan PayPal | `HistoriaPayPalPlanService::ensureBillingPlanForHistoria` lo hace por ti |

---

## 6. Comandos útiles antes de cualquier cambio

```bash
# Estado del repo y árbol de cambios
git status
git diff --stat

# Lint y tipo
vendor/bin/pint --test --format agent   # sólo validar
npm run format
npm run lint:check
npm run types:check

# Tests rápidos del archivo tocado
php artisan test --compact --filter=<NombreTest>
php artisan test --compact tests/Feature/Checkout
php artisan test --compact --group=paypal

# Regenerar Wayfinder (cuando se modifican rutas)
php artisan wayfinder:generate --no-interaction

# Demo data (en local)
php artisan demo:seed-dashboard --year=2026 --force
```

---

## 7. Definición de «hecho» (Definition of Done) por feature

- [ ] Cambios respetan `composer.json` y `package.json` (no añadir deps sin aprobación).
- [ ] Migración idempotente + reversible (`up()` y `down()` correctos).
- [ ] Models con `$fillable`, `casts()` y PHPDoc de relaciones.
- [ ] Policy registrada y, si aplica, con trait.
- [ ] Tests Pest Feature (al menos happy path + 1 caso negativo).
- [ ] Pint pasa sin cambios.
- [ ] Prettier + ESLint + tsc pasan sin cambios.
- [ ] Wayfinder regenerado si se tocó `routes/`.
- [ ] Build frontend pasa (`npm run build`).
- [ ] Mailables revisados cuando hay cambios de redacción.
- [ ] `AGENTS.md` y `GEMINI.md` actualizados si cambia un patrón del proyecto.
