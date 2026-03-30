# Plan de Implementación: Panel Administrativo

## Visión General

Implementación del panel administrativo sobre el stack existente (Laravel 12 + Inertia.js v2 + React 19 + Tailwind CSS v4). **Todo el diseño visual React ya está construido con datos mock.** El trabajo consiste en crear el backend desde cero y conectar los datos reales a las vistas existentes. Se construye desde la capa de base de datos hacia arriba: modelos → controladores → servicios → conectar frontend.

## Estado de Partida

**Frontend — TODO ya existe (NO crear páginas nuevas):**
- ✅ `resources/js/pages/admin/dashboard.tsx` — UI completa con datos mock (métricas, LineChart, PieChart, filtros de período solo UI).
- ✅ `resources/js/pages/admin/orders.tsx` — UI completa con datos mock (tabla, filtros, paginación client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/subscriptions.tsx` — UI completa con datos mock (tabla, filtros búsqueda y fecha, paginación client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/clients.tsx` — UI completa con datión client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/stories.tsx` — UI completa con datos mock (tabla, filtros búsqueda/categoría/fecha, paginación client-side 8 items, exportación solo UI, botón "Crear historia" que abre modal).
- ✅ `resources/js/pages/admin/products.tsx` — UI completa con datos mock (tabla, filtros búsqueda/categoría, paginación client-side 8 items, exportación solo UI, botón "Crear producto" que abre modal).
- ✅ `resources/js/components/admin/Createario completo de creación de historia (sin conectar al backend).
- ✅ `resources/js/components/admin/CreateProductModal.tsx` — formulario completo de creación de producto (sin conectar al backend).
- ✅ `user-layout.tsx` — sidebar con menú admin funcional.

**Backend — TODO falta (crear desde cero):**
- ❌ Modelos `Historia`, `Entrega`, `Producto`, `Suscripcion` — no existen.
- ❌ Controladores `Admin\*` — no existen (solo `User\OrdenController` que retorna mocks).
- ❌ Rutas admin completas — no existen (solo stubs: `/clients`, `/admin/stories`, `/admin/products`).
- ❌ `maatwebsite/excel` — no instalado.

## Tareas

- [ ] 1. Migraciones, modelos y factories base
  - [ ] 1.1 Crear migraciones para las tablas `historias`, `entregas`, `productos` y `suscripciones`
    - Ejecutar `php artisan make:migration create_historias_table`, `create_entregas_table`, `create_productos_table`, `create_suscripciones_table`
    - Implementar los schemas exactos definidos en el diseño (campos, tipos, índices, soft deletes, foreign keys)
    - _Requerimientos: 7.2, 8.1, 9.2, 10.1, 5.1_

  - [ ] 1.2 Crear los modelos Eloquent `Historia`, `Entrega`, `Producto` y `Suscripcion`
    - Ejecutar `php artisan make:model Historia`, `Entrega`, `Producto`, `Suscripcion`
    - Definir `$fillable`, `casts()`, relaciones (`hasMany`, `belongsTo`) y `SoftDeletes` en cada modelo
    - Agregar relación `hasMany Suscripcion` al modelo `User` existente
    - _Requerimientos: 7.4, 8.4, 9.4, 10.4, 5.1_

  - [ ] 1.3 Crear factories para `Historia`, `Entrega`, `Producto` y `Suscripcion`
    - Ejecutar `php artisan make:factory HistoriaFactory`, etc.
    - Incluir estados (`activo`, `pausado`) y datos representativos con `fake()`
    - _Requerimientos: 7.4, 9.4_

- [ ] 2. Rutas admin completas
  - [ ] 2.1 Registrar todas las rutas admin en `routes/web.php` bajo el grupo `can:admin`
    - Reemplazar las rutas stub existentes (`admin/stories`, `admin/products`, `clients`) por las rutas completas del diseño
troy, duplicate, toggle-status, stock) y exportaciones para cada sección
    - _Requerimientos: 1.4, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1_

  - [ ]* 2.2 Escribir test de propiedad para acceso restringido (Propiedad 1)
    - **Propiedad 1: Acceso restringido a administradores**
    - **Valida: Requerimiento 1.4**
    - Crear `tests/Feature/Admin/AuthAdminTest.php`
    - Para N usuarios sin rol `admin`, verificar que cada ruta `/admin/*` retorna 403 o redirección

- [ ] 3. Controladores admin — listados con filtros server-side
  - [ ] 3.1 Crear `App\Http\Controllers\Admin\OrdenController` con método `index`
    - Ejecutar `php artisan make:controller Admin/OrdenController`
    - Implementar filtros por búsqueda (número, nombre, email) y rango de fechas
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/orders', [...])`
    - **Nota:** Reemplaza la lógica admin que actualmente vive en `User\OrdenController::index()`
    - _Requerimientos: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [ ] 3.2 Crear `App\Http\Controllers\Admin\SuscripcionController` con método `index`
    - Implementar filtros por búsqueda (número, nombre, email) y rango de fechas por `fecha_adquisicion`
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/subscriptions', [...])`
    - _Requerimientos: 5.1, 5.2, 5.3, 5.4, 5.6_

  - [ ] 3.3 Crear `App\Http\Controllers\Admin\ClienteController` con método `index`
    - Filtrar `User::query()->where('role', '!=', 'admin')` con búsqueda por nombre y email
    - Incluir columna calculada `tiene_suscripcion` con `withExists('suscripciones')`
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/clients', [...])`
    - _Requerimientos: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 3.4 Escribir test de propiedad para filtrado de tablas (Propiedad 5)
    - **Propiedad 5: El filtrado retorna solo registros que cumplen todos los criterios activos**
    - **Valida: Requerimientos 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 6.2, 6.3**
    - Crear `tests/Feature/Admin/TablaFiltrosTest.php`
atorios; verificar que todos los registros retornados satisfacen el criterio

  - [ ]* 3.5 Escribir test de propiedad para paginación (Propiedades 6 y 7)
    - **Propiedad 6: La paginación retorna máximo 10 registros por página sobre el conjunto filtrado**
    - **Propiedad 7: Los metadatos de paginación son correctos**
    - **Valida: Requerimientos 4.6, 5.6, 6.5, 12.1, 12.3, 12.5, 12.6**
    - Crear `tests/Feature/Admin/PaginacionTest.php`
    - Verificar `count(data) <= 10`, `has_previous_page` en primera página y `has_next_page` en última

- [ ] 4. Checkpoint — Verificar listados y filtros
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 5. CRUD de Historias — backend
  - [ ] 5.1 Crear Form Requests `Admin\StoreHistoriaRequest` y `Admin\UpdateHistoriaRequest`
    - Ejecutar `php artisan make:request Admin/StoreHistoriaRequest` y `Admin/UpdateHistoriaRequest`
    - Definir reglas para todos los campos obligatorios (nombre, descripcionr, precio_base, codigo, estado)
    - Incluir regla `unique:historias,codigo` (con `ignore` en Update) y `unique:historias,slug`
    - _Requerimientos: 7.2, 7.3_

  - [ ] 5.2 Crear `App\Http\Controllers\Admin\HistoriaController` con métodos CRUD completos
    - Implementar `index` (listado con filtros y paginación), `store`, `update`, `destroy`
    - Implementar acciones `duplicate` (copia con `estado = 'pausado'`), `toggleStatus`, `storeEntrega`, `updateEntrega`
    - Generar slug automático desde el nombre en `store`; en `duplicate` agregar sufijo único
    - Usar `findOrFail()` para todas las acciones sobre registros existentes
    - _Requerimientos: 7.4, 7.5, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 5.3 Escribir test de propiedad para validación de Historia (Propiedad 9)
    - **Propiedad 9: La validación rechaza formularios con campos obligatorios faltantes**
    - **Valida: Requerimientos 7.3**
    - Crear `tests/Feature/Admin/HistoriaValidacionTest.php`
    - Para cada campo obligatorio, enviar request sin ese campo y verificar HTTP 422 y que no se creó registro

  - [ ]* 5.4 Escribir test de propiedad para persistencia de Historia (Propiedad 10)
    - **Propiedad 10: Guardar una Historia persiste todos sus campos**
    - **Valida: Requerimientos 7.4**
    - 100 iteraciones con datos aleatorios válidos; verificar que `Historia::find($id)` retorna los mismos valores enviados

  - [ ]* 5.5 Escribir test de propiedad para duplicar Historia (Propiedad 11)
    - **Propiedad 11: Duplicar crea una copia con esta
    - **Valida: Requerimientos 8.4**
    - Crear `tests/Feature/Admin/DuplicarTest.php`
    - Verificar que la copia tiene `estado = 'pausado'` independientemente del estado original

  - [ ]* 5.6 Escribir test de propiedad para toggle de estado de Historia (Propiedad 12)
    - **Propiedad 12: Toggle de estado alterna correctamente (round-trip)**
    - **Valida: Requerimientos 8.5**
    - Crear `tests/Feature/Admin/ToggleEstadoTest.php`
    - Aplicar toggle dos veces y ver al inicial

  - [ ]* 5.7 Escribir test de propiedad para eliminar Historia (Propiedad 13)
    - **Propiedad 13: Eliminar remueve el registro (soft delete)**
    - **Valida: Requerimientos 8.6**
    - Crear `tests/Feature/Admin/EliminarTest.php`
    - Verificar que `Historia::find($id)` retorna `null` tras la eliminación

- [ ] 6. CRUD de Productos — backend
  - [ ] 6.1 Crear Form Requests `Admin\StoreProductoRequest`, `Admin\UpdateProductoRequest` y `Admin\AjustarStockRequest`
    - Ejecutar `php artisan make:request` para cada uno
    - Definir reglas para campos obligatorios (nombre, descripcion_corta, descripcion_larga, categoria, precio_base, codigo, stock, estado)
    - Incluir regla `unique:productos,codigo` (con `ignore` en Update) y validación `integer|min:0` para stock
    - _Requerimientos: 9.2, 9.3, 10.3_

  - [ ] 6.2 Crear `App\Http\Controllers\Admin\ProductoController` con métodos CRUD completos
    - Implementar `index`, `store`, `update`, `destroy`
    - Implementar acciones `duplicate`, `toggleStatus`, `ajustarStock`
    - Misma lógica de slug y duplicación que `HistoriaController`
    - _Requerimientos: 9.4, 9.5, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 6.3 Escribir tests de propiedad para validación y persistencia de Producto (Propiedades 9 y 10)
    - **Propiedad 9: La validación rechaza formularios con campos obligatorios faltantes**
    - **Propiedad 10: Guardar un Producto persiste todos sus campos**
    - **Valida: Requerimientos 9.3, 9.4**
t.php`

  - [ ]* 6.4 Escribir tests de propiedad para duplicar, toggle y eliminar Producto (Propiedades 11, 12, 13)
    - **Propiedad 11: Duplicar crea una copia con estado Pausado**
    - **Propiedad 12: Toggle de estado alterna correctamente**
    - **Propiedad 13: Eliminar remueve el registro**
    - **Valida: Requerimientos 10.4, 10.5, 10.6**
    - Agregar casos de Producto a `DuplicarTest.php`, `ToggleEstadoTest.php` y `EliminarTest.php`

- [ ] 7. Checkpoint — Verificar CRUD de Historias y Productos
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 8. Servicio de exportación Excel
  - [ ] 8.1 Instalar `maatwebsite/excel` y crear las clases Export
    - Agregar dependencia: `composer require maatwebsite/excel`
    - Crear `App\Exports\Admin\OrdenesExport`, `SuscripcionesExport`, `ClientesExport`, `HistoriasExport`, `ProductosExport`

    - Los encabezados deben coincidir con los nombres de columna de la interfaz (Requerimiento 11.4)
    - _Requerimientos: 11.1, 11.2, 11.3, 11.4_

  - [ ] 8.2 Crear `App\Services\Admin\ExportService` y agregar métodos `export` en cada controlador
    - Implementar método `export(string $tipo, array $filtros): StreamedResponse` que delega a la clase Export correspondiente
r`
    - _Requerimientos: 4.5, 5.5, 6.4, 8.8, 10.8_

  - [ ]* 8.3 Escribir test de propiedad para exportación Excel (Propiedad 8)
    - **Propiedad 8: La exportación Excel respeta los filtros activos**
    - **Valida: Requerimientos 4.5, 5.5, 6.4, 8.8, 10.8, 11.2, 11.3**
    - Crear `tests/Feature/Admin/ExportacionTest.php`
    - Verificar que el número de filas del Excel exportado coincide con el total de registros filtrados sin paginación

- [ ] 9. Servicio de métricas del dashboard
  - [ ] 9.1 Crear `App\Services\Admin\DashboardMetricasService`
    - Ejecutar `php artisan make:class App/Services/Admin/DashboardMetricasService`
    - Implementar métodos: `usuariosRegistrados()`, `suscripcionesDelMes()`, `ordenesDelDia()`, `historiasActivas()`, `productosActivos()`, `ventasDelMes()`
    - Usar `Carbon` para los límites temporales (inicio de mes, últimas 24 horas)
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 9.2 Crear `App\Http\Controllers\Admin\DashboardController` con deferred props
    - Implementar método `index` que retorna `Inertia::render('admin/dashboard')` con props diferidas para métricas y gráfica
    - Implementar endpoints `metricas()` y `ventasChart()` para las deferred props
    - Actualizar la ruta `/admin/dashboard` en `routes/web.php` para que use `Admin\DashboardController`
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3_

  - [ ]* 9.3 Escribir test de propiedad para métricas del dashboard (Propiedad 4)
    - **Propiedad 4: Las métricas reflebase de datos**
    - **Valida: Requerimientos 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
    - Crear `tests/Feature/Admin/DashboardMetricasTest.php`
    - Para N usuarios, M suscripciones y K órdenes creados con factories, verificar que los contadores del servicio coinciden con los valores calculados directamente con Eloquent

- [ ] 10. Checkpoint — Verificar exportaciones y métricas
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 11. Conectar `dashboard.tsx` con datos reales (UI ya existe)
  - [ ] 11.1 Actualizar `dashboard.tsx` para consumir props de Inertia (deferred)
    - Reemplazar las constantes mock (`salesData`, `donughtData`, valores hardcodeados en tarjetas) con props recibidas de `Admin\DashboardController`
    - Implementar `<Deferred>` de Inertia v2 para métricas y gráfica; mostrar skeletons mientras cargan
    - Conectar el selector de período (Semana/rango de fechas) al endpoint `/admin/dashboard/ventas-chart` con `router.get()` de Inertia
    - **Nota:** La estructura visual de las tarjetas, LineChart y PieChart ya existe — solo se reemplazan los datos mock
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4_

- [ ] 12. Conectar `orders.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 12.1 Migrar `orders.tsx` de paginación client-side a server-side
    - Eliminar el estado local `filteredOrders`, `paginatedOrders`, `currentPage` y la constante `totalPages = 12`
ctura: `data`, `current_page`, `last_page`, `total`, `links`)
    - Cambiar `itemsPerPage` de 8 a 10 registros (server-side)
    - Al cambiar `searchTerm` o rango de fechas, disparar `router.get()` de Inertia con los query params y `preserveState: true`
    - Conectar el botón "Exportar a excel" existente al endpoint `GET /admin/ordenes/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 12.1, 12.4, 12.5, 12.6_

- [ ] 13. Conectar `subscriptions.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 13.1 Migrar `subscriptions.tsx` de paginación client-side a server-side
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `suscripciones` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda y rango de fechas a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/suscripciones/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 12.1, 12.4, 12.5, 12.6_

- [ ] 14. Conectar `clients.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 14.1 Migrar `clients.tsx` de paginación client-side a server-side
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `clientes` como `LengthAwarePaginator` de Laravel
    - Conectar filtro de búsqueda a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/clientes/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 6.1, 6.2, 6.3, 6.4, 6.5, 12.1, 12.4, 12.5, 12.6_

- [ ] 15. Conectar `stories.tsx` con datos reales y acciones del backend (UI ya existe)
  - [ ] 15.1 Migrar `stories.tsx` de paginación client-side a server-side y conectar acciones
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `historias` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda/categoría/fecha a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/historias/export` con los filtros activos
    - Conectar las acciones`), Duplicar (`POST /admin/historias/{id}/duplicate`), Activar/Pausar (`PATCH /admin/historias/{id}/toggle-status`), Eliminar (`DELETE /admin/historias/{id}`) con `ConfirmDialog`
    - **Nota:** La estructura visual de la tabla, filtros, paginación y menú de acciones ya existe — solo se conecta al backend
    - _Requerimientos: 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 12.1, 12.4, 12.5, 12.6_

  - [ ] 15.2 Crear componente `ConfirmDialog.tsx` para acciones destructivas
    - Modal de confirmación con Radix UI Dialog para la acción "Eliminar"
    - _Requerimientos: 8.6, 10.6_

- [ ] 16. Conectar `products.tsx` con datos reales y acciones del backend (UI ya existe)
  - [ ] 16.1 Migrar `products.tsx` de paginación client-side a server-side y conectar acciones
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `productos` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda/categoría a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/productos/export` con los filtros activos
    - Conectar las acciones del menú por fila al backend: Editar (`PATCH /admin/productos/{id}`), Duplicar (`POST /admin/productos/{id}/duplicate`), Activar/Pausar (`PATCH /admin/productos/{id}/toggle-status`), Eliminar (`DELETE /admin/productos/{id}`) con `ConfirmDialog`
    - **Nota:** La estructura visual de la tabla, filtros, paginación y menú de acciones ya existe — solo se conecta al backend
    - _Requerimientos: 10.1, 10.2, 10.4, 10.5, 10.6, 10.7, 10.8, 12.1, 12.4, 12.5, 12.6_

  - [ ] 16.2 Crear componente `StockAdjuster.tsx` para ajuste de stock
    - Control con botones `+` y `-` y campo numérico; al confirmar envía `PATCH /admin/productos/{id}/stock` con Inertia
    - _Requerimientos: 10.3_

- [ ] 17. Conectar `CreateStoryModal.tsx` al backend (modal ya existe)
  - [ ] 17.1 Conectar el formulario existente de `CreateStoryModal.tsx` al endpoint `POST /admin/historias`
    - Reemplazar el estado local del f Inertia
    - Conectar el submit al endpoint `POST /admin/historias` usando Wayfinder
    - Mostrar errores de validación por campo usando `form.errors` de Inertia
    - Cerrar el modal y recargar la tabla al guardar exitosamente
    - **Nota:** El formulario con todos sus campos ya existe — solo se conecta la lógica de envío
    - _Requerimientos: 7.1, 7.2, 7.3, 7.4_

- [ ] 18. Conectar `CreateProductModal.tsx` al backend (modal ya existe)
  - [ ] 18.1 Conectar el formulario existente de `CreateProductModaal endpoint `POST /admin/productos`
    - Reemplazar el estado local del formulario con `useForm` de Inertia
    - Conectar el submit al endpoint `POST /admin/productos` usando Wayfinder
    - Mostrar errores de validación por campo usando `form.errors` de Inertia
    - Cerrar el modal y recargar la tabla al guardar exitosamente
    - **Nota:** El formulario con todos sus campos ya existe — solo se conecta la lógica de envío
    - _Requerimientos: 9.1, 9.2, 9.3, 9.4_

- [ ] 19. Tests de autenticación admin
  - [ ]* 19.1 Completar `tests/Feature/Admin/AuthAdminTest.php` con Propiedades 1, 2 y 3
    - **Propiedad 1: Acceso restringido a administradores**
    - **Propiedad 2: Login exitoso redirige al dashboard**
    - **Propiedad 3: Credenciales inválidas son rechazadas**
    - **Valida: Requerimientos 1.2, 1.3, 1.4, 1.5**
propiedad usan 100 iteraciones con `fake()` dentro de un loop (patrón Pest 4)
- Cada test de propiedad incluye el comentario `// Feature: admin-panel, Property {N}: {descripción}`
- Las exportaciones Excel requieren instalar `maatwebsite/excel` antes de implementar la tarea 8


- [ ] 20. Checkpoint final — Integración completa
  - Asegurarse de que todos los tests pasen. Ejecutar `php artisan test --compact`. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- **Las tareas 11–18 son "conectar datos reales a UI existente" — NO crear páginas ni modales desde cero**
- Las tareas 1–10 son backend puro (crear desde cero)
- Cada tarea referencia requerimientos específicos para trazabilidad
- Los tests de     - Verificar redirección al dashboard tras login admin válido
    - Verificar 403 para usuarios sin rol admin en rutas `/admin/*`
    - Verificar errores de validación para credenciales incorrectas
- ✅ `resources/js/pages/admin/orders.tsx` — UI completa con datos mock (tabla, filtros, paginación client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/subscriptions.tsx` — UI completa con datos mock (tabla, filtros búsqueda y fecha, paginación client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/clients.tsx` — UI completa con datos mock (tabla, filtro búsqueda, paginación client-side 8 items, exportación solo UI).
- ✅ `resources/js/pages/admin/stories.tsx` — UI completa con datos mock (tabla, filtros búsqueda/categoría/fecha, paginación client-side 8 items, exportación solo UI, botón "Crear historia" que abre modal).
- ✅ `resources/js/pages/admin/products.tsx` — UI completa con datos mock (tabla, filtros búsqueda/categoría, paginación client-side 8 items, exportación solo UI, botón "Crear producto" que abre modal).
- ✅ `resources/js/components/admin/CreateStoryModal.tsx` — formulario completo de creación de historia (sin conectar al backend).
- ✅ `resources/js/components/admin/CreateProductModal.tsx` — formulario completo de creación de producto (sin conectar al backend).
- ✅ `user-layout.tsx` — sidebar con menú admin funcional.

**Backend — TODO falta (crear desde cero):**
- ❌ Modelos `Historia`, `Entrega`, `Producto`, `Suscripcion` — no existen.
- ❌ Controladores `Admin\*` — no existen (solo `User\OrdenController` que retorna mocks).
- ❌ Rutas admin completas — no existen (solo stubs: `/clients`, `/admin/stories`, `/admin/products`).
- ❌ `maatwebsite/excel` — no instalado.

## Tareas

- [ ] 1. Migraciones, modelos y factories base
  - [ ] 1.1 Crear migraciones para las tablas `historias`, `entregas`, `productos` y `suscripciones`
    - Ejecutar `php artisan make:migration create_historias_table`, `create_entregas_table`, `create_productos_table`, `create_suscripciones_table`
    - Implementar los schemas exactos definidos en el diseño (campos, tipos, índices, soft deletes, foreign keys)
    - _Requerimientos: 7.2, 8.1, 9.2, 10.1, 5.1_

  - [ ] 1.2 Crear los modelos Eloquent `Historia`, `Entrega`, `Producto` y `Suscripcion`
    - Ejecutar `php artisan make:model Historia`, `Entrega`, `Producto`, `Suscripcion`
    - Definir `$fillable`, `casts()`, relaciones (`hasMany`, `belongsTo`) y `SoftDeletes` en cada modelo
    - Agregar relación `hasMany Suscripcion` al modelo `User` existente
    - _Requerimientos: 7.4, 8.4, 9.4, 10.4, 5.1_

  - [ ] 1.3 Crear factories para `Historia`, `Entrega`, `Producto` y `Suscripcion`
    - Ejecutar `php artisan make:factory HistoriaFactory`, etc.
    - Incluir estados (`activo`, `pausado`) y datos representativos con `fake()`
    - _Requerimientos: 7.4, 9.4_

- [ ] 2. Rutas admin completas
  - [ ] 2.1 Registrar todas las rutas admin en `routes/web.php` bajo el grupo `can:admin`
    - Reemplazar las rutas stub existentes (`admin/stories`, `admin/products`, `clients`) por las rutas completas del diseño
    - Registrar rutas de recursos (index), acciones (store, update, destroy, duplicate, toggle-status, stock) y exportaciones para cada sección
    - _Requerimientos: 1.4, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1_

  - [ ]* 2.2 Escribir test de propiedad para acceso restringido (Propiedad 1)
    - **Propiedad 1: Acceso restringido a administradores**
    - **Valida: Requerimiento 1.4**
    - Crear `tests/Feature/Admin/AuthAdminTest.php`
    - Para N usuarios sin rol `admin`, verificar que cada ruta `/admin/*` retorna 403 o redirección

- [ ] 3. Controladores admin — listados con filtros server-side
  - [ ] 3.1 Crear `App\Http\Controllers\Admin\OrdenController` con método `index`
    - Ejecutar `php artisan make:controller Admin/OrdenController`
    - Implementar filtros por búsqueda (número, nombre, email) y rango de fechas
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/orders', [...])`
    - **Nota:** Reemplaza la lógica admin que actualmente vive en `User\OrdenController::index()`
    - _Requerimientos: 4.1, 4.2, 4.3, 4.4, 4.6_

  - [ ] 3.2 Crear `App\Http\Controllers\Admin\SuscripcionController` con método `index`
    - Implementar filtros por búsqueda (número, nombre, email) y rango de fechas por `fecha_adquisicion`
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/subscriptions', [...])`
    - _Requerimientos: 5.1, 5.2, 5.3, 5.4, 5.6_

  - [ ] 3.3 Crear `App\Http\Controllers\Admin\ClienteController` con método `index`
    - Filtrar `User::query()->where('role', '!=', 'admin')` con búsqueda por nombre y email
    - Incluir columna calculada `tiene_suscripcion` con `withExists('suscripciones')`
    - Paginar con `->paginate(10)` y retornar `Inertia::render('admin/clients', [...])`
    - _Requerimientos: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 3.4 Escribir test de propiedad para filtrado de tablas (Propiedad 5)
    - **Propiedad 5: El filtrado retorna solo registros que cumplen todos los criterios activos**
    - **Valida: Requerimientos 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 6.2, 6.3**
    - Crear `tests/Feature/Admin/TablaFiltrosTest.php`
    - 100 iteraciones con términos aleatorios; verificar que todos los registros retornados satisfacen el criterio

  - [ ]* 3.5 Escribir test de propiedad para paginación (Propiedades 6 y 7)
    - **Propiedad 6: La paginación retorna máximo 10 registros por página sobre el conjunto filtrado**
    - **Propiedad 7: Los metadatos de paginación son correctos**
    - **Valida: Requerimientos 4.6, 5.6, 6.5, 12.1, 12.3, 12.5, 12.6**
    - Crear `tests/Feature/Admin/PaginacionTest.php`
    - Verificar `count(data) <= 10`, `has_previous_page` en primera página y `has_next_page` en última

- [ ] 4. Checkpoint — Verificar listados y filtros
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 5. CRUD de Historias — backend
  - [ ] 5.1 Crear Form Requests `Admin\StoreHistoriaRequest` y `Admin\UpdateHistoriaRequest`
    - Ejecutar `php artisan make:request Admin/StoreHistoriaRequest` y `Admin/UpdateHistoriaRequest`
    - Definir reglas para todos los campos obligatorios (nombre, descripcion_corta, descripcion_larga, categoria, autor, precio_base, codigo, estado)
    - Incluir regla `unique:historias,codigo` (con `ignore` en Update) y `unique:historias,slug`
    - _Requerimientos: 7.2, 7.3_

  - [ ] 5.2 Crear `App\Http\Controllers\Admin\HistoriaController` con métodos CRUD completos
    - Implementar `index` (listado con filtros y paginación), `store`, `update`, `destroy`
    - Implementar acciones `duplicate` (copia con `estado = 'pausado'`), `toggleStatus`, `storeEntrega`, `updateEntrega`
    - Generar slug automático desde el nombre en `store`; en `duplicate` agregar sufijo único
    - Usar `findOrFail()` para todas las acciones sobre registros existentes
    - _Requerimientos: 7.4, 7.5, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 5.3 Escribir test de propiedad para validación de Historia (Propiedad 9)
    - **Propiedad 9: La validación rechaza formularios con campos obligatorios faltantes**
    - **Valida: Requerimientos 7.3**
    - Crear `tests/Feature/Admin/HistoriaValidacionTest.php`
    - Para cada campo obligatorio, enviar request sin ese campo y verificar HTTP 422 y que no se creó registro

  - [ ]* 5.4 Escribir test de propiedad para persistencia de Historia (Propiedad 10)
    - **Propiedad 10: Guardar una Historia persiste todos sus campos**
    - **Valida: Requerimientos 7.4**
    - 100 iteraciones con datos aleatorios válidos; verificar que `Historia::find($id)` retorna los mismos valores enviados

  - [ ]* 5.5 Escribir test de propiedad para duplicar Historia (Propiedad 11)
    - **Propiedad 11: Duplicar crea una copia con estado Pausado**
    - **Valida: Requerimientos 8.4**
    - Crear `tests/Feature/Admin/DuplicarTest.php`
    - Verificar que la copia tiene `estado = 'pausado'` independientemente del estado original

  - [ ]* 5.6 Escribir test de propiedad para toggle de estado de Historia (Propiedad 12)
    - **Propiedad 12: Toggle de estado alterna correctamente (round-trip)**
    - **Valida: Requerimientos 8.5**
    - Crear `tests/Feature/Admin/ToggleEstadoTest.php`
    - Aplicar toggle dos veces y verificar que el estado final es igual al inicial

  - [ ]* 5.7 Escribir test de propiedad para eliminar Historia (Propiedad 13)
    - **Propiedad 13: Eliminar remueve el registro (soft delete)**
    - **Valida: Requerimientos 8.6**
    - Crear `tests/Feature/Admin/EliminarTest.php`
    - Verificar que `Historia::find($id)` retorna `null` tras la eliminación

- [ ] 6. CRUD de Productos — backend
  - [ ] 6.1 Crear Form Requests `Admin\StoreProductoRequest`, `Admin\UpdateProductoRequest` y `Admin\AjustarStockRequest`
    - Ejecutar `php artisan make:request` para cada uno
    - Definir reglas para campos obligatorios (nombre, descripcion_corta, descripcion_larga, categoria, precio_base, codigo, stock, estado)
    - Incluir regla `unique:productos,codigo` (con `ignore` en Update) y validación `integer|min:0` para stock
    - _Requerimientos: 9.2, 9.3, 10.3_

  - [ ] 6.2 Crear `App\Http\Controllers\Admin\ProductoController` con métodos CRUD completos
    - Implementar `index`, `store`, `update`, `destroy`
    - Implementar acciones `duplicate`, `toggleStatus`, `ajustarStock`
    - Misma lógica de slug y duplicación que `HistoriaController`
    - _Requerimientos: 9.4, 9.5, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 6.3 Escribir tests de propiedad para validación y persistencia de Producto (Propiedades 9 y 10)
    - **Propiedad 9: La validación rechaza formularios con campos obligatorios faltantes**
    - **Propiedad 10: Guardar un Producto persiste todos sus campos**
    - **Valida: Requerimientos 9.3, 9.4**
    - Crear `tests/Feature/Admin/ProductoValidacionTest.php`

  - [ ]* 6.4 Escribir tests de propiedad para duplicar, toggle y eliminar Producto (Propiedades 11, 12, 13)
    - **Propiedad 11: Duplicar crea una copia con estado Pausado**
    - **Propiedad 12: Toggle de estado alterna correctamente**
    - **Propiedad 13: Eliminar remueve el registro**
    - **Valida: Requerimientos 10.4, 10.5, 10.6**
    - Agregar casos de Producto a `DuplicarTest.php`, `ToggleEstadoTest.php` y `EliminarTest.php`

- [ ] 7. Checkpoint — Verificar CRUD de Historias y Productos
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 8. Servicio de exportación Excel
  - [ ] 8.1 Instalar `maatwebsite/excel` y crear las clases Export
    - Agregar dependencia: `composer require maatwebsite/excel`
    - Crear `App\Exports\Admin\OrdenesExport`, `SuscripcionesExport`, `ClientesExport`, `HistoriasExport`, `ProductosExport`
    - Cada clase debe implementar `FromQuery`, `WithHeadings` y `WithMapping`; recibir los filtros activos como parámetros del constructor
    - Los encabezados deben coincidir con los nombres de columna de la interfaz (Requerimiento 11.4)
    - _Requerimientos: 11.1, 11.2, 11.3, 11.4_

  - [ ] 8.2 Crear `App\Services\Admin\ExportService` y agregar métodos `export` en cada controlador
    - Implementar método `export(string $tipo, array $filtros): StreamedResponse` que delega a la clase Export correspondiente
    - Agregar método `export` en `OrdenController`, `SuscripcionController`, `ClienteController`, `HistoriaController` y `ProductoController`
    - _Requerimientos: 4.5, 5.5, 6.4, 8.8, 10.8_

  - [ ]* 8.3 Escribir test de propiedad para exportación Excel (Propiedad 8)
    - **Propiedad 8: La exportación Excel respeta los filtros activos**
    - **Valida: Requerimientos 4.5, 5.5, 6.4, 8.8, 10.8, 11.2, 11.3**
    - Crear `tests/Feature/Admin/ExportacionTest.php`
    - Verificar que el número de filas del Excel exportado coincide con el total de registros filtrados sin paginación

- [ ] 9. Servicio de métricas del dashboard
  - [ ] 9.1 Crear `App\Services\Admin\DashboardMetricasService`
    - Ejecutar `php artisan make:class App/Services/Admin/DashboardMetricasService`
    - Implementar métodos: `usuariosRegistrados()`, `suscripcionesDelMes()`, `ordenesDelDia()`, `historiasActivas()`, `productosActivos()`, `ventasDelMes()`
    - Usar `Carbon` para los límites temporales (inicio de mes, últimas 24 horas)
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 9.2 Crear `App\Http\Controllers\Admin\DashboardController` con deferred props
    - Implementar método `index` que retorna `Inertia::render('admin/dashboard')` con props diferidas para métricas y gráfica
    - Implementar endpoints `metricas()` y `ventasChart()` para las deferred props
    - Actualizar la ruta `/admin/dashboard` en `routes/web.php` para que use `Admin\DashboardController`
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3_

  - [ ]* 9.3 Escribir test de propiedad para métricas del dashboard (Propiedad 4)
    - **Propiedad 4: Las métricas reflejan el estado real de la base de datos**
    - **Valida: Requerimientos 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**
    - Crear `tests/Feature/Admin/DashboardMetricasTest.php`
    - Para N usuarios, M suscripciones y K órdenes creados con factories, verificar que los contadores del servicio coinciden con los valores calculados directamente con Eloquent

- [ ] 10. Checkpoint — Verificar exportaciones y métricas
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 11. Conectar `dashboard.tsx` con datos reales (UI ya existe)
  - [ ] 11.1 Actualizar `dashboard.tsx` para consumir props de Inertia (deferred)
    - Reemplazar las constantes mock (`salesData`, `donughtData`, valores hardcodeados en tarjetas) con props recibidas de `Admin\DashboardController`
    - Implementar `<Deferred>` de Inertia v2 para métricas y gráfica; mostrar skeletons mientras cargan
    - Conectar el selector de período (Semana/rango de fechas) al endpoint `/admin/dashboard/ventas-chart` con `router.get()` de Inertia
    - **Nota:** La estructura visual de las tarjetas, LineChart y PieChart ya existe — solo se reemplazan los datos mock
    - _Requerimientos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4_

- [ ] 12. Conectar `orders.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 12.1 Migrar `orders.tsx` de paginación client-side a server-side
    - Eliminar el estado local `filteredOrders`, `paginatedOrders`, `currentPage` y la constante `totalPages = 12`
    - Recibir la prop `ordenes` como `LengthAwarePaginator` de Laravel (estructura: `data`, `current_page`, `last_page`, `total`, `links`)
    - Cambiar `itemsPerPage` de 8 a 10 registros (server-side)
    - Al cambiar `searchTerm` o rango de fechas, disparar `router.get()` de Inertia con los query params y `preserveState: true`
    - Conectar el botón "Exportar a excel" existente al endpoint `GET /admin/ordenes/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 12.1, 12.4, 12.5, 12.6_

- [ ] 13. Conectar `subscriptions.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 13.1 Migrar `subscriptions.tsx` de paginación client-side a server-side
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `suscripciones` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda y rango de fechas a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/suscripciones/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 12.1, 12.4, 12.5, 12.6_

- [ ] 14. Conectar `clients.tsx` con datos reales y paginación server-side (UI ya existe)
  - [ ] 14.1 Migrar `clients.tsx` de paginación client-side a server-side
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `clientes` como `LengthAwarePaginator` de Laravel
    - Conectar filtro de búsqueda a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/clientes/export` con los filtros activos
    - **Nota:** La estructura visual de la tabla, filtros y paginación ya existe — solo se migra la lógica de datos
    - _Requerimientos: 6.1, 6.2, 6.3, 6.4, 6.5, 12.1, 12.4, 12.5, 12.6_

- [ ] 15. Conectar `stories.tsx` con datos reales y acciones del backend (UI ya existe)
  - [ ] 15.1 Migrar `stories.tsx` de paginación client-side a server-side y conectar acciones
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `historias` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda/categoría/fecha a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/historias/export` con los filtros activos
    - Conectar las acciones del menú por fila: Editar (`PATCH /admin/historias/{id}`), Duplicar (`POST /admin/historias/{id}/duplicate`), Activar/Pausar (`PATCH /admin/historias/{id}/toggle-status`), Eliminar (`DELETE /admin/historias/{id}`) con `ConfirmDialog`
    - **Nota:** La estructura visual de la tabla, filtros, paginación y menú de acciones ya existe — solo se conecta al backend
    - _Requerimientos: 8.1, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 12.1, 12.4, 12.5, 12.6_

  - [ ] 15.2 Crear componente `ConfirmDialog.tsx` para acciones destructivas
    - Modal de confirmación con Radix UI Dialog para la acción "Eliminar"
    - _Requerimientos: 8.6, 10.6_

- [ ] 16. Conectar `products.tsx` con datos reales y acciones del backend (UI ya existe)
  - [ ] 16.1 Migrar `products.tsx` de paginación client-side a server-side y conectar acciones
    - Eliminar estado local de paginación y datos mock
    - Recibir la prop `productos` como `LengthAwarePaginator` de Laravel
    - Conectar filtros de búsqueda/categoría a `router.get()` de Inertia con `preserveState: true`
    - Conectar el botón "Exportar" existente al endpoint `GET /admin/productos/export` con los filtros activos
    - Conectar las acciones del menú por fila: Editar (`PATCH /admin/productos/{id}`), Duplicar (`POST /admin/productos/{id}/duplicate`), Activar/Pausar (`PATCH /admin/productos/{id}/toggle-status`), Eliminar (`DELETE /admin/productos/{id}`) con `ConfirmDialog`
    - **Nota:** La estructura visual de la tabla, filtros, paginación y menú de acciones ya existe — solo se conecta al backend
    - _Requerimientos: 10.1, 10.2, 10.4, 10.5, 10.6, 10.7, 10.8, 12.1, 12.4, 12.5, 12.6_

  - [ ] 16.2 Crear componente `StockAdjuster.tsx` para ajuste de stock
    - Control con botones `+` y `-` y campo numérico; al confirmar envía `PATCH /admin/productos/{id}/stock` con Inertia
    - _Requerimientos: 10.3_

- [ ] 17. Conectar `CreateStoryModal.tsx` al backend (modal ya existe)
  - [ ] 17.1 Conectar el formulario existente de `CreateStoryModal.tsx` al endpoint `POST /admin/historias`
    - Reemplazar el estado local del formulario con `useForm` de Inertia
    - Conectar el submit al endpoint `POST /admin/historias` usando Wayfinder
    - Mostrar errores de validación por campo usando `form.errors` de Inertia
    - Cerrar el modal y recargar la tabla al guardar exitosamente
    - **Nota:** El formulario con todos sus campos ya existe — solo se conecta la lógica de envío
    - _Requerimientos: 7.1, 7.2, 7.3, 7.4_

- [ ] 18. Conectar `CreateProductModal.tsx` al backend (modal ya existe)
  - [ ] 18.1 Conectar el formulario existente de `CreateProductModal.tsx` al endpoint `POST /admin/productos`
    - Reemplazar el estado local del formulario con `useForm` de Inertia
    - Conectar el submit al endpoint `POST /admin/productos` usando Wayfinder
    - Mostrar errores de validación por campo usando `form.errors` de Inertia
    - Cerrar el modal y recargar la tabla al guardar exitosamente
    - **Nota:** El formulario con todos sus campos ya existe — solo se conecta la lógica de envío
    - _Requerimientos: 9.1, 9.2, 9.3, 9.4_

- [ ] 19. Tests de autenticación admin
  - [ ]* 19.1 Completar `tests/Feature/Admin/AuthAdminTest.php` con Propiedades 1, 2 y 3
    - **Propiedad 1: Acceso restringido a administradores**
    - **Propiedad 2: Login exitoso redirige al dashboard**
    - **Propiedad 3: Credenciales inválidas son rechazadas**
    - **Valida: Requerimientos 1.2, 1.3, 1.4, 1.5**
    - Verificar redirección al dashboard tras login admin válido
    - Verificar 403 para usuarios sin rol admin en rutas `/admin/*`
    - Verificar errores de validación para credenciales incorrectas

- [ ] 20. Checkpoint final — Integración completa
  - Asegurarse de que todos los tests pasen. Ejecutar `php artisan test --compact`. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- **Las tareas 11–18 son "conectar datos reales a UI existente" — NO crear páginas ni modales desde cero**
- Las tareas 1–10 son backend puro (crear desde cero)
- Cada tarea referencia requerimientos específicos para trazabilidad
- Los tests de propiedad usan 100 iteraciones con `fake()` dentro de un loop (patrón Pest 4)
- Cada test de propiedad incluye el comentario `// Feature: admin-panel, Property {N}: {descripción}`
- Las exportaciones Excel requieren instalar `maatwebsite/excel` antes de implementar la tarea 8
