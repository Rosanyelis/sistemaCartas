# Diseño Técnico: Panel Administrativo

## Visión General

El Panel Administrativo es una interfaz de gestión interna construida sobre el stack existente de la plataforma (Laravel 12 + Inertia.js v2 + React 19 + Tailwind CSS v4). Reutiliza el guard de autenticación `web` de Fortify, restringiendo el acceso mediante el Gate `admin` ya definido en `AppServiceProvider`. El panel expone rutas bajo el prefijo `/admin`, protegidas por los middlewares `auth`, `verified` y `can:admin`.

La arquitectura sigue el patrón existente del proyecto: controladores Laravel que retornan `Inertia::render()`, componentes React en `resources/js/pages/admin/`, y Wayfinder para referencias de rutas tipadas en el frontend.

---

## Estado Actual de Implementación

### Páginas React ya construidas (diseño visual completo, datos mock)

| Archivo | Estado | Notas |
|---|---|---|
| `resources/js/pages/admin/dashboard.tsx` | ✅ UI completa (mock) | 5 tarjetas de métricas, LineChart, PieChart, filtros de período (solo UI). Requiere conectar props de Inertia (deferred). |
| `resources/js/pages/admin/orders.tsx` | ✅ UI completa (mock) | Tabla con filtros, paginación client-side (8 items, totalPages=12 hardcodeado). Requiere migrar a server-side (10 items) y conectar exportación Excel. |
| `resources/js/pages/admin/subscriptions.tsx` | ✅ UI completa (mock) | Tabla con filtros de búsqueda y fecha, paginación client-side (8 items), botón exportar (solo UI). Requiere migrar a server-side (10 items) y conectar exportación. |
| `resources/js/pages/admin/clients.tsx` | ✅ UI completa (mock) | Tabla con filtro de búsqueda, paginación client-side (8 items), botón exportar (solo UI). Requiere migrar a server-side (10 items) y conectar exportación. |
| `resources/js/pages/admin/stories.tsx` | ✅ UI completa (mock) | Tabla con filtros búsqueda/categoría/fecha, paginación client-side (8 items), botón exportar (solo UI), botón "Crear historia" que abre `CreateStoryModal`. Requiere migrar a server-side y conectar acciones del menú al backend. |
| `resources/js/pages/admin/products.tsx` | ✅ UI completa (mock) | Tabla con filtros búsqueda/categoría, paginación client-side (8 items), botón exportar (solo UI), botón "Crear producto" que abre `CreateProductModal`. Requiere migrar a server-side y conectar acciones del menú al backend. |

### Componentes modales ya construidos (formularios completos, sin conectar al backend)

| Archivo | Estado | Notas |
|---|---|---|
| `resources/js/components/admin/CreateStoryModal.tsx` | ✅ UI completa (sin backend) | Formulario completo: todos los campos, editor rich text, upload imágenes/video, variantes, estado. Requiere conectar a `POST /admin/historias` con `useForm` de Inertia. |
| `resources/js/components/admin/CreateProductModal.tsx` | ✅ UI completa (sin backend) | Formulario completo: todos los campos, upload imágenes, variantes, estado. Requiere conectar a `POST /admin/productos` con `useForm` de Inertia. |

### Backend existente relevante

- `User\OrdenController::index()` — detecta `isAdmin()` y retorna datos mock a `admin/orders`. Debe reemplazarse por `Admin\OrdenController`.
- Rutas stub en `routes/web.php`: `/clients` → `admin/clients`, `/admin/stories` → `admin/stories`, `/admin/products` → `admin/products`. Deben reemplazarse por rutas completas.
- Modelos `StoreOrder` y `StoreOrderItem` — ya existen con relaciones y casts.
- Modelos `Historia`, `Entrega`, `Producto`, `Suscripcion` — **no existen aún**.

---

## Arquitectura

### Estrategia de Autenticación

Se reutiliza el guard `web` de Fortify con el modelo `User` existente. El campo `role` ya existe en la tabla `users` y el método `isAdmin()` ya está implementado. El Gate `admin` ya está registrado en `AppServiceProvider`. No se requiere un guard separado.

El flujo de acceso al panel es:
1. El administrador accede a `/login` (login compartido con clientes).
2. Fortify autentica y redirige a `/dashboard`.
3. El dashboard detecta `isAdmin()` y renderiza `admin/dashboard`.
4. Las rutas `/admin/*` están protegidas por `can:admin`; cualquier acceso no autorizado retorna 403 y Inertia redirige al login.

### Estructura de Rutas

```
/admin/dashboard          → Admin\DashboardController@index
/admin/ordenes            → Admin\OrdenController@index
/admin/suscripciones      → Admin\SuscripcionController@index
/admin/clientes           → Admin\ClienteController@index
/admin/historias          → Admin\HistoriaController@index
/admin/historias/create   → Admin\HistoriaController@create
/admin/historias/{id}     → Admin\HistoriaController@show
/admin/historias/{id}/edit → Admin\HistoriaController@edit
/admin/productos          → Admin\ProductoController@index
/admin/productos/create   → Admin\ProductoController@create
/admin/productos/{id}     → Admin\ProductoController@show
/admin/productos/{id}/edit → Admin\ProductoController@edit

# Acciones (POST/PATCH/DELETE)
POST   /admin/historias
PATCH  /admin/historias/{id}
DELETE /admin/historias/{id}
POST   /admin/historias/{id}/duplicate
PATCH  /admin/historias/{id}/toggle-status
POST   /admin/historias/{id}/entregas
PATCH  /admin/historias/{id}/entregas/{entregaId}

POST   /admin/productos
PATCH  /admin/productos/{id}
DELETE /admin/productos/{id}
POST   /admin/productos/{id}/duplicate
PATCH  /admin/productos/{id}/toggle-status
PATCH  /admin/productos/{id}/stock

# Exportaciones
GET    /admin/ordenes/export
GET    /admin/suscripciones/export
GET    /admin/clientes/export
GET    /admin/historias/export
GET    /admin/productos/export

# Dashboard (deferred)
GET    /admin/dashboard/metricas
GET    /admin/dashboard/ventas-chart
```

### Diagrama de Capas

```mermaid
graph TD
    Browser["Navegador (React + Inertia)"]
    MW["Middleware: auth + verified + can:admin"]
    Controllers["Admin Controllers"]
    Services["Admin Services (métricas, exportación)"]
    Models["Eloquent Models"]
    DB[(Base de Datos)]
    Excel["maatwebsite/excel (Exportador)"]

    Browser -->|Inertia Request| MW
    MW --> Controllers
    Controllers --> Services
    Services --> Models
    Models --> DB
    Controllers -->|Inertia::render()| Browser
    Controllers -->|StreamedResponse| Excel
```

---

## Componentes e Interfaces

### Backend — Controladores Admin

Todos los controladores viven en `App\Http\Controllers\Admin\` y extienden `App\Http\Controllers\Controller`.

| Controlador | Estado | Responsabilidad |
|---|---|---|
| `DashboardController` | ❌ Por crear | Métricas del dashboard con deferred props |
| `OrdenController` | ❌ Por crear | Listado, filtros, paginación y exportación de órdenes (reemplaza la lógica admin en `User\OrdenController`) |
| `SuscripcionController` | ❌ Por crear | Listado, filtros, paginación y exportación de suscripciones |
| `ClienteController` | ❌ Por crear | Listado, filtros, paginación y exportación de clientes |
| `HistoriaController` | ❌ Por crear | CRUD completo de historias + entregas |
| `ProductoController` | ❌ Por crear | CRUD completo de productos + ajuste de stock |

### Backend — Services

| Service | Estado | Responsabilidad |
|---|---|---|
| `Admin\DashboardMetricasService` | ❌ Por crear | Cálculo de todas las métricas del dashboard |
| `Admin\ExportService` | ❌ Por crear | Generación de archivos Excel con `maatwebsite/excel` |

### Backend — Form Requests

| Form Request | Estado | Valida |
|---|---|---|
| `Admin\StoreHistoriaRequest` | ❌ Por crear | Creación de Historia |
| `Admin\UpdateHistoriaRequest` | ❌ Por crear | Edición de Historia |
| `Admin\StoreProductoRequest` | ❌ Por crear | Creación de Producto |
| `Admin\UpdateProductoRequest` | ❌ Por crear | Edición de Producto |
| `Admin\AjustarStockRequest` | ❌ Por crear | Ajuste de stock de Producto |
| `Admin\StoreEntregaRequest` | ❌ Por crear | Creación de Entrega |
| `Admin\UpdateEntregaRequest` | ❌ Por crear | Edición de Entrega |

### Backend — Exports (maatwebsite/excel)

| Export Class | Estado | Exporta |
|---|---|---|
| `Admin\OrdenesExport` | ❌ Por crear | Tabla de órdenes con filtros |
| `Admin\SuscripcionesExport` | ❌ Por crear | Tabla de suscripciones con filtros |
| `Admin\ClientesExport` | ❌ Por crear | Tabla de clientes con filtros |
| `Admin\HistoriasExport` | ❌ Por crear | Tabla de historias con filtros |
| `Admin\ProductosExport` | ❌ Por crear | Tabla de productos con filtros |

### Frontend — Páginas React

Ubicadas en `resources/js/pages/admin/`:

| Página | Estado | Notas |
|---|---|---|
| `dashboard.tsx` | ✅ UI completa (mock) | Conectar deferred props para métricas y gráfica. |
| `orders.tsx` | ✅ UI completa (mock) | Migrar paginación a server-side (10 items). Conectar exportación. |
| `subscriptions.tsx` | ✅ UI completa (mock) | Migrar paginación a server-side (10 items). Conectar exportación. |
| `clients.tsx` | ✅ UI completa (mock) | Migrar paginación a server-side (10 items). Conectar exportación. |
| `stories.tsx` | ✅ UI completa (mock) | Migrar paginación a server-side (10 items). Conectar exportación y acciones del menú al backend. |
| `products.tsx` | ✅ UI completa (mock) | Migrar paginación a server-side (10 items). Conectar exportación y acciones del menú al backend. |

### Frontend — Componentes Compartidos Admin

Ubicados en `resources/js/components/admin/`:

| Componente | Estado | Descripción |
|---|---|---|
| `CreateStoryModal.tsx` | ✅ Existe (sin backend) | Formulario completo de creación de historia. Requiere conectar a `POST /admin/historias` con `useForm` de Inertia. |
| `CreateProductModal.tsx` | ✅ Existe (sin backend) | Formulario completo de creación de producto. Requiere conectar a `POST /admin/productos` con `useForm` de Inertia. |
| `StatusBadge.tsx` | ❌ Por crear | Badge de color según el valor del estado (activo/pausado/activa/inactiva/etc.) |
| `ConfirmDialog.tsx` | ❌ Por crear | Modal de confirmación con Radix UI Dialog para acciones destructivas |
| `StockAdjuster.tsx` | ❌ Por crear | Control de ajuste de stock (botones +/- y campo numérico) |

---

## Modelos de Datos

### Nuevos Modelos

#### `Historia`

```php
// Tabla: historias
Schema::create('historias', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->string('codigo')->unique();
    $table->text('descripcion_corta');
    $table->longText('descripcion_larga'); // HTML enriquecido
    $table->json('detalle')->nullable();   // íconos, tipografías
    $table->string('categoria');
    $table->string('autor');
    $table->string('duracion')->nullable();
    $table->decimal('precio_base', 12, 2);
    $table->decimal('precio_promocional', 12, 2)->nullable();
    $table->decimal('impuestos', 5, 2)->default(0);
    $table->json('variantes')->nullable();  // color, material
    $table->string('imagen_principal')->nullable();
    $table->string('video')->nullable();
    $table->json('galeria')->nullable();
    $table->decimal('peso', 8, 2)->nullable();
    $table->json('dimensiones')->nullable();
    $table->string('tipo_envio')->nullable();
    $table->enum('estado', ['activo', 'pausado'])->default('pausado')->index();
    $table->timestamps();
    $table->softDeletes();
});
```

#### `Entrega`

```php
// Tabla: entregas
Schema::create('entregas', function (Blueprint $table) {
    $table->id();
    $table->foreignId('historia_id')->constrained('historias')->cascadeOnDelete();
    $table->unsignedInteger('numero');
    $table->string('titulo');
    $table->longText('contenido')->nullable();
    $table->enum('estado', ['borrador', 'activo'])->default('borrador')->index();
    $table->timestamps();
    $table->softDeletes();
    $table->unique(['historia_id', 'numero']);
});
```

#### `Producto`

```php
// Tabla: productos
Schema::create('productos', function (Blueprint $table) {
    $table->id();
    $table->string('nombre');
    $table->string('slug')->unique();
    $table->string('codigo')->unique();
    $table->text('descripcion_corta');
    $table->longText('descripcion_larga');
    $table->json('detalle')->nullable();
    $table->string('categoria');
    $table->string('subcategoria')->nullable();
    $table->decimal('precio_base', 12, 2);
    $table->decimal('precio_promocional', 12, 2)->nullable();
    $table->decimal('impuestos', 5, 2)->default(0);
    $table->unsignedInteger('stock')->default(0);
    $table->json('variantes')->nullable();
    $table->string('imagen_principal')->nullable();
    $table->json('galeria')->nullable();
    $table->decimal('peso', 8, 2)->nullable();
    $table->json('dimensiones')->nullable();
    $table->string('tipo_envio')->nullable();
    $table->enum('estado', ['activo', 'pausado'])->default('pausado')->index();
    $table->timestamps();
    $table->softDeletes();
});
```

#### `Suscripcion`

```php
// Tabla: suscripciones
Schema::create('suscripciones', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('historia_id')->constrained('historias')->cascadeOnDelete();
    $table->unsignedInteger('cantidad')->default(1);
    $table->enum('tipo', ['completa', 'mensual']);
    $table->timestamp('fecha_adquisicion');
    $table->timestamp('fecha_finalizacion')->nullable();
    $table->timestamp('proximo_cobro')->nullable();
    $table->enum('estado', ['activa', 'inactiva', 'incompleta'])->default('activa')->index();
    $table->string('paypal_subscription_id')->nullable();
    $table->timestamps();
});
```

### Relaciones Eloquent

```
User          hasMany  Suscripcion
Historia      hasMany  Entrega
Historia      hasMany  Suscripcion
Suscripcion   belongsTo User
Suscripcion   belongsTo Historia
Entrega       belongsTo Historia
StoreOrder    belongsTo User
StoreOrder    hasMany  StoreOrderItem
```

### Mapeo Admin → Modelo Existente

| Concepto Admin | Modelo/Tabla | Estado |
|---|---|---|
| Orden | `StoreOrder` + `StoreOrderItem` | ✅ Existe |
| Cliente | `User` (role != 'admin') | ✅ Existe |
| Historia | `Historia` (nuevo) | ❌ Por crear |
| Entrega | `Entrega` (nuevo) | ❌ Por crear |
| Producto | `Producto` (nuevo) | ❌ Por crear |
| Suscripción | `Suscripcion` (nuevo) | ❌ Por crear |

---

## Propiedades de Corrección

*Una propiedad es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas de un sistema — esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquinas.*

### Propiedad 1: Acceso restringido a administradores

*Para cualquier* usuario autenticado sin rol `admin`, cualquier intento de acceder a una ruta bajo `/admin/*` debe resultar en una respuesta 403 o redirección al login, sin exponer datos del panel.

**Valida: Requerimientos 1.4**

### Propiedad 2: Login exitoso redirige al dashboard

*Para cualquier* usuario con rol `admin` y credenciales válidas, el envío del formulario de login debe resultar en una redirección al dashboard del panel administrativo.

**Valida: Requerimientos 1.2, 1.5**

### Propiedad 3: Credenciales inválidas son rechazadas

*Para cualquier* combinación de email/contraseña que no corresponda a un usuario `admin` existente, el intento de login debe retornar errores de validación y no iniciar sesión.

**Valida: Requerimientos 1.3**

### Propiedad 4: Las métricas del dashboard reflejan el estado real de la base de datos

*Para cualquier* estado de la base de datos (N usuarios, M suscripciones activas, K órdenes del día), los contadores retornados por el endpoint de métricas deben ser iguales a los valores calculados directamente sobre los modelos Eloquent con los mismos criterios de filtrado temporal.

**Valida: Requerimientos 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### Propiedad 5: El filtrado de tablas retorna solo registros que cumplen todos los criterios activos

*Para cualquier* tabla del panel (órdenes, suscripciones, clientes, historias, productos) y cualquier combinación de filtros activos, todos los registros retornados deben satisfacer simultáneamente todos los criterios de filtrado aplicados (lógica AND), y ningún registro que no cumpla los criterios debe aparecer en los resultados.

**Valida: Requerimientos 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 6.2, 6.3, 8.7, 10.7**

### Propiedad 6: La paginación retorna máximo 10 registros por página sobre el conjunto filtrado

*Para cualquier* tabla del panel y cualquier combinación de filtros, cada página de resultados debe contener como máximo 10 registros, y el total de páginas debe calcularse sobre el conjunto de registros filtrados (no el total sin filtrar).

**Valida: Requerimientos 4.6, 5.6, 6.5, 12.1, 12.3**

### Propiedad 7: Los metadatos de paginación son correctos

*Para cualquier* conjunto de resultados paginados, los metadatos `has_previous_page` y `has_next_page` deben ser `false` en la primera y última página respectivamente, y `true` en cualquier página intermedia.

**Valida: Requerimientos 12.5, 12.6**

### Propiedad 8: La exportación Excel respeta los filtros activos

*Para cualquier* tabla del panel y cualquier combinación de filtros activos, el archivo `.xlsx` generado debe contener exactamente los mismos registros que la tabla paginada mostraría si se eliminara la paginación, ni más ni menos.

**Valida: Requerimientos 4.5, 5.5, 6.4, 8.8, 10.8, 11.2, 11.3**

### Propiedad 9: La validación rechaza formularios con campos obligatorios faltantes

*Para cualquier* formulario de Historia o Producto con uno o más campos obligatorios ausentes o vacíos, el endpoint de creación/edición debe retornar errores de validación (HTTP 422) y no persistir ningún registro en la base de datos.

**Valida: Requerimientos 7.3, 9.3**

### Propiedad 10: Guardar una Historia/Producto persiste todos sus campos

*Para cualquier* Historia o Producto con todos los campos obligatorios completos, después de guardarlo, consultarlo desde la base de datos debe retornar exactamente los mismos valores que se enviaron en el request de creación.

**Valida: Requerimientos 7.4, 9.4**

### Propiedad 11: Duplicar crea una copia con estado Pausado

*Para cualquier* Historia o Producto existente, la acción de duplicar debe crear un nuevo registro con los mismos valores en todos los campos de contenido, pero con `estado = 'pausado'` independientemente del estado del original.

**Valida: Requerimientos 8.4, 10.4**

### Propiedad 12: Toggle de estado alterna correctamente

*Para cualquier* Historia o Producto, aplicar la acción toggle-status dos veces consecutivas debe resultar en el mismo estado inicial (propiedad de round-trip/idempotencia del toggle).

**Valida: Requerimientos 8.5, 10.5**

### Propiedad 13: Eliminar remueve el registro de la base de datos

*Para cualquier* Historia o Producto existente, después de ejecutar la acción de eliminación, consultar ese registro por su ID debe retornar `null` (soft delete).

**Valida: Requerimientos 8.6, 10.6**

---

## Manejo de Errores

### Errores de Autenticación y Autorización

- Acceso no autenticado a rutas admin → redirección a `/login` (comportamiento estándar de Laravel).
- Acceso autenticado sin rol admin → respuesta 403; Inertia muestra página de error.
- Sesión expirada durante navegación → Inertia intercepta la respuesta 401/419 y redirige al login.

### Errores de Validación

- Los Form Requests retornan HTTP 422 con el bag de errores de Laravel.
- Inertia propaga los errores al componente React a través de `errors` en el formulario.
- Los campos con error se marcan visualmente con mensaje descriptivo.

### Errores de Base de Datos

- Violaciones de unicidad (slug, código) → capturadas en Form Request con regla `unique`.
- Registros no encontrados → `findOrFail()` lanza `ModelNotFoundException` → Laravel retorna 404.

### Errores de Exportación

- Si la exportación falla (timeout, memoria), se retorna HTTP 500 con mensaje de error en flash.
- Las exportaciones grandes se encolan como jobs con `ShouldQueue` para evitar timeouts HTTP.

### Errores de Subida de Archivos

- Imágenes con formato inválido o tamaño excesivo → validación en Form Request con reglas `image`, `max`.
- Las imágenes se almacenan en `storage/app/public/admin/` con `Storage::disk('public')`.

---

## Estrategia de Testing

### Enfoque Dual

Se utilizan tanto **tests unitarios/de feature** (Pest) como **tests de propiedades** para garantizar cobertura completa.

- **Tests de feature**: verifican ejemplos concretos, casos borde y flujos de integración end-to-end.
- **Tests de propiedades**: verifican que las propiedades universales se cumplen para cualquier entrada generada aleatoriamente.

### Librería de Property-Based Testing

Se utilizará **[Eris](https://github.com/giorgiosironi/eris)** para PHP, que provee generadores de datos aleatorios y shrinking automático. Cada test de propiedad debe ejecutarse con mínimo **100 iteraciones**.

Alternativamente, dado que Pest 4 no incluye PBT nativo, se puede simular con datasets generados dinámicamente usando `fake()` dentro de un loop de 100 iteraciones en un único test.

### Tests de Feature (Pest)

Ubicados en `tests/Feature/Admin/`:

```
AuthAdminTest.php          → Propiedad 1, 2, 3
DashboardMetricasTest.php  → Propiedad 4
TablaFiltrosTest.php       → Propiedad 5
PaginacionTest.php         → Propiedad 6, 7
ExportacionTest.php        → Propiedad 8
HistoriaValidacionTest.php → Propiedad 9, 10
ProductoValidacionTest.php → Propiedad 9, 10
DuplicarTest.php           → Propiedad 11
ToggleEstadoTest.php       → Propiedad 12
EliminarTest.php           → Propiedad 13
```

### Ejemplo de Test de Propiedad (Pest)

```php
// Feature: admin-panel, Property 5: filtrado retorna solo registros que cumplen criterios
it('filtra órdenes correctamente para cualquier término de búsqueda', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    // 100 iteraciones con datos aleatorios
    foreach (range(1, 100) as $_) {
        $termino = fake()->lastName();
        $cliente = User::factory()->create(['name' => $termino . ' ' . fake()->lastName()]);
        StoreOrder::factory(3)->create(['user_id' => $cliente->id]);
        StoreOrder::factory(5)->create(); // órdenes de otros clientes

        $response = $this->actingAs($admin)
            ->getJson("/admin/ordenes?search={$termino}");

        $response->assertSuccessful();
        collect($response->json('data'))->each(function ($orden) use ($termino) {
            expect(
                str_contains(strtolower($orden['cliente_nombre']), strtolower($termino)) ||
                str_contains(strtolower($orden['cliente_email']), strtolower($termino))
            )->toBeTrue();
        });
    }
});
```

### Etiquetado de Tests de Propiedad

Cada test de propiedad debe incluir un comentario con el formato:

```
// Feature: admin-panel, Property {N}: {texto de la propiedad}
```

### Tests Unitarios Prioritarios

- `DashboardMetricasService`: cálculo de contadores con fechas límite.
- `ExportService`: estructura de columnas y encabezados del Excel.
- Validación de slugs únicos al duplicar historias/productos.
- Cálculo de `has_previous_page` / `has_next_page` en el paginador.

### Cobertura Mínima Esperada

| Área | Tipo de Test |
|---|---|
| Autenticación admin | Feature (property) |
| Métricas dashboard | Feature (property) + Unit |
| Filtros de tablas | Feature (property) |
| Paginación | Feature (property) |
| Exportación Excel | Feature (property) + example |
| CRUD Historias | Feature (property) + example |
| CRUD Productos | Feature (property) + example |
| Toggle/Duplicar/Eliminar | Feature (property) |
