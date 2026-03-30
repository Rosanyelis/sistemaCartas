# Plan de Implementación: Panel del Usuario Suscriptor

## Visión General

Implementación quirúrgica sobre el stack existente (Laravel 12 + Inertia.js v2 + React 19 + Tailwind CSS v4). El diseño React ya está construido. El trabajo consiste en: reemplazar mocks con consultas Eloquent reales en tres controladores, migrar la paginación de client-side a server-side, agregar el endpoint de cancelación de suscripción, y conectar el modal de métodos de pago al flujo real. No se crean nuevos layouts ni páginas.

## Tareas

- [ ] 1. Conectar `OrdenController::index()` con datos reales y paginación server-side
  - [ ] 1.1 Reemplazar el array mock en `app/Http/Controllers/User/OrdenController.php` con consulta Eloquent real
    - Agregar `use App\Models\StoreOrder;` y `use Illuminate\Http\Request;` al controlador
    - Cambiar la firma del método a `public function index(Request $request): Response`
    - Reemplazar el bloque `$ordenes = [...]` con `StoreOrder::with('items')->where('user_id', auth()->id())->latest()`
    - Aplicar filtro `search` sobre `id` y `items.product_name` con `orWhereHas`
    - Aplicar filtros `start_date` y `end_date` con `whereDate`
    - Paginar con `->paginate(10)->through(fn($order) => [...])` mapeando los campos al formato esperado por el frontend
    - Mapear `status` usando `match`: `paid` → `Completado`, `capture_failed` → `Rechazado`, `pending_payment` → `Pendiente`
    - Mapear `estado_color` usando `match`: `paid` → `success`, `capture_failed` → `danger`, `pending_payment` → `warning`
    - Pasar `'filters' => $request->only(['search', 'start_date', 'end_date'])` como prop adicional
    - _Requerimientos: 2.1, 2.2, 2.3, 2.5_

  - [ ]* 1.2 Escribir test de propiedad para aislamiento de datos de órdenes (Propiedad 1)
    - **Propiedad 1: Aislamiento de datos por usuario autenticado**
    - **Valida: Requerimientos 2.1**
    - Crear `tests/Feature/User/OrdenControllerTest.php`
    - 100 iteraciones: crear usuario A con N órdenes y usuario B con 3 órdenes; verificar que `ordenes.total` retorna exactamente N para usuario A
    - Comentario: `// Feature: user-panel, Property 1: aislamiento de datos por usuario autenticado`

  - [ ]* 1.3 Escribir test de propiedad para mapeo de estados de orden (Propiedad 2)
    - **Propiedad 2: Mapeo correcto de estados de orden**
    - **Valida: Requerimientos 2.2**
    - En `tests/Feature/User/OrdenControllerTest.php`
    - Para cada valor de `status` en `{paid, capture_failed, pending_payment}`, crear una orden y verificar que `estado` y `estado_color` retornados son exactamente los esperados
    - Comentario: `// Feature: user-panel, Property 2: mapeo correcto de estados de orden`

  - [ ]* 1.4 Escribir test de propiedad para paginación server-side de órdenes (Propiedad 3)
    - **Propiedad 3: Paginación server-side retorna máximo 10 registros por página**
    - **Valida: Requerimientos 2.3, 2.4, 10.1, 10.2**
    - En `tests/Feature/User/OrdenControllerTest.php`
    - Crear usuario con 15 órdenes; verificar que `count(ordenes.data) <= 10` y `ordenes.total === 15`
    - Comentario: `// Feature: user-panel, Property 3: paginación server-side retorna máximo 10 registros por página`

  - [ ]* 1.5 Escribir test de propiedad para filtros server-side de órdenes (Propiedad 4)
    - **Propiedad 4: Los filtros retornan solo registros del usuario que cumplen los criterios**
    - **Valida: Requerimientos 2.5**
    - En `tests/Feature/User/OrdenControllerTest.php`
    - 100 iteraciones con filtros aleatorios de fecha; verificar que todos los registros retornados pertenecen al usuario y satisfacen el criterio
    - Comentario: `// Feature: user-panel, Property 4: los filtros retornan solo registros del usuario que cumplen los criterios`

- [ ] 2. Migrar `orders.tsx` a paginación server-side
  - [ ] 2.1 Actualizar la interfaz `OrdersProps` en `resources/js/pages/user/orders.tsx`
    - Cambiar el tipo de `ordenes` de `Order[]` a `{ data: Order[]; current_page: number; last_page: number; per_page: number; total: number }`
    - Agregar prop `filters: { search?: string; start_date?: string; end_date?: string }`
    - Agregar `auth` prop con `{ user: { name: string } }` si no está presente
    - _Requerimientos: 10.2_

  - [ ] 2.2 Reemplazar estados locales de filtrado y paginación por `router.get()` de Inertia
    - Eliminar `useMemo` de `filteredOrders` y `paginatedOrders`; eliminar `itemsPerPage = 5`
    - Inicializar `searchTerm` desde `filters.search ?? ''`, `startDate` desde `filters.start_date ?? ''`, `endDate` desde `filters.end_date ?? ''`
    - Agregar `import { router } from '@inertiajs/react'`
    - Implementar `applyFilters(params)` que llama `router.get(route('user.orders'), { ...params, page: 1 }, { preserveState: true, replace: true })`
    - Implementar `goToPage(page)` que llama `router.get(route('user.orders'), { search: searchTerm, start_date: startDate, end_date: endDate, page }, { preserveState: true })`
    - Conectar el input de búsqueda para llamar `applyFilters` con debounce o al presionar Enter
    - Conectar el botón "Aplicar" del filtro de fechas para llamar `applyFilters`
    - _Requerimientos: 10.3, 10.4_

  - [ ] 2.3 Actualizar la sección de paginación para usar datos del servidor
    - Reemplazar `totalPages` calculado localmente por `ordenes.last_page`
    - Reemplazar `currentPage` local por `ordenes.current_page`
    - Reemplazar `paginatedOrders.map(...)` por `ordenes.data.map(...)`
    - Actualizar el texto "Mostrando X a Y de Z registros" usando `ordenes.current_page`, `ordenes.per_page` y `ordenes.total`
    - Conectar botones de página para llamar `goToPage(page)`
    - Deshabilitar botón izquierdo cuando `ordenes.current_page === 1`; deshabilitar botón derecho cuando `ordenes.current_page === ordenes.last_page`
    - _Requerimientos: 10.5, 10.6_

- [ ] 3. Checkpoint — Verificar órdenes con datos reales
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 4. Preparar `SuscripcionController` para paginación server-side (fase sin modelo)
  - [ ] 4.1 Reemplazar el array mock en `app/Http/Controllers/User/SuscripcionController.php` con paginador vacío
    - Agregar `use Illuminate\Http\Request;` y cambiar la firma a `public function index(Request $request): Response`
    - Reemplazar el bloque `$suscripciones = [...]` con `new \Illuminate\Pagination\LengthAwarePaginator([], 0, 10, 1, ['path' => $request->url()])`
    - Pasar `'filters' => $request->only(['search', 'start_date', 'end_date'])` como prop adicional
    - Dejar comentado el bloque de consulta real para cuando exista el modelo `Suscripcion` (ver diseño)
    - _Requerimientos: 3.1, 3.2_

- [ ] 5. Agregar ruta y método `cancel` en `SuscripcionController`
  - [ ] 5.1 Registrar la ruta `PATCH subscriptions/{suscripcion}/cancel` en `routes/web.php`
    - Dentro del grupo `['auth', 'verified']`, agregar: `Route::patch('subscriptions/{suscripcion}/cancel', [SuscripcionController::class, 'cancel'])->name('user.subscriptions.cancel');`
    - _Requerimientos: 4.3, 4.6_

  - [ ] 5.2 Implementar el método `cancel` en `app/Http/Controllers/User/SuscripcionController.php`
    - Agregar `use Illuminate\Http\RedirectResponse;` al controlador
    - Implementar `public function cancel($suscripcion): RedirectResponse` con guard `if ($suscripcion->user_id !== auth()->id()) abort(403)`
    - Agregar guard `if ($suscripcion->estado !== 'Activa') abort(422, 'Solo se pueden cancelar suscripciones activas.')`
    - Ejecutar `$suscripcion->update(['estado' => 'Inactiva'])` y retornar `back()->with('success', 'Suscripción cancelada correctamente.')`
    - Nota: el type-hint del modelo `Suscripcion` se agrega cuando el modelo exista; por ahora usar `$suscripcion` sin type-hint o con `mixed`
    - _Requerimientos: 4.3, 4.5, 4.6_

  - [ ]* 5.3 Escribir test de propiedad para autorización de cancelación (Propiedad 5)
    - **Propiedad 5: Solo el dueño puede cancelar su suscripción**
    - **Valida: Requerimientos 4.6**
    - Crear `tests/Feature/User/SuscripcionControllerTest.php`
    - 100 iteraciones: crear dueño y atacante; verificar que el atacante recibe HTTP 403 y el estado no cambia
    - Comentario: `// Feature: user-panel, Property 5: solo el dueño puede cancelar su suscripción`

  - [ ]* 5.4 Escribir test de propiedad para validación de estado en cancelación (Propiedad 6)
    - **Propiedad 6: Solo suscripciones Activas pueden cancelarse**
    - **Valida: Requerimientos 4.3, 4.5**
    - En `tests/Feature/User/SuscripcionControllerTest.php`
    - Para estados `Inactiva` e `Incompleta`, verificar que el dueño recibe HTTP 422 y el estado no cambia
    - Comentario: `// Feature: user-panel, Property 6: solo suscripciones Activas pueden cancelarse`

- [ ] 6. Migrar `subscriptions.tsx` a paginación server-side y conectar cancelación
  - [ ] 6.1 Actualizar la interfaz `SubscriptionsProps` en `resources/js/pages/user/subscriptions.tsx`
    - Cambiar el tipo de `suscripciones` de `Suscripcion[]` a `{ data: Suscripcion[]; current_page: number; last_page: number; per_page: number; total: number }`
    - Agregar prop `filters: { search?: string; start_date?: string; end_date?: string }`
    - _Requerimientos: 10.2_

  - [ ] 6.2 Reemplazar estados locales de filtrado y paginación por `router.get()` de Inertia
    - Eliminar `useMemo` de `filteredSuscripciones` y `paginatedSuscripciones`; eliminar `itemsPerPage = 5`
    - Inicializar controles de UI desde las props `filters`
    - Agregar `import { router } from '@inertiajs/react'`
    - Implementar `applyFilters(params)` y `goToPage(page)` con el mismo patrón que `orders.tsx`
    - Reemplazar `paginatedSuscripciones.map(...)` por `suscripciones.data.map(...)`
    - Actualizar paginación para usar `suscripciones.current_page` y `suscripciones.last_page`
    - _Requerimientos: 10.3, 10.4, 10.5, 10.6_

  - [ ] 6.3 Conectar el botón "Continuar" del `Modal_Cancelacion` al endpoint real
    - Implementar `confirmCancel` que llama `router.patch(route('user.subscriptions.cancel', { suscripcion: selectedSub.id }), {}, { onSuccess: () => closeCancelModal() })`
    - Conectar `confirmCancel` al `onClick` del botón "Continuar" en el modal de cancelación
    - _Requerimientos: 4.2, 4.3, 4.4_

  - [ ] 6.4 Ocultar el botón "Dar de baja" para suscripciones no activas
    - En la columna "Acciones" de la tabla desktop, renderizar el botón solo cuando `sub.estado === 'Activa'`
    - En el menú contextual mobile, renderizar la opción "Dar de baja" solo cuando `sub.estado === 'Activa'`
    - _Requerimientos: 4.1, 4.5_

- [ ] 7. Checkpoint — Verificar suscripciones y cancelación
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 8. Conectar `ProfileController::index()` con datos reales
  - [ ] 8.1 Reemplazar los mocks de `activitySummary` en `app/Http/Controllers/User/ProfileController.php`
    - Agregar `use App\Models\StoreOrder;` al controlador
    - Reemplazar `'acquiredProducts' => 0` con `StoreOrder::where('user_id', $user->id)->where('status', StoreOrder::STATUS_PAID)->count()`
    - Mantener `'activeSubscriptions' => 0` hasta que exista el modelo `Suscripcion`; dejar comentario con la consulta real del diseño
    - _Requerimientos: 7.1, 7.2_

  - [ ] 8.2 Agregar la prop `tiposMetodoPago` al retorno de `ProfileController::index()`
    - Agregar `use App\Models\TipoMetodoPago;` al controlador
    - Agregar `'tiposMetodoPago' => TipoMetodoPago::where('is_active', true)->get(['id', 'nombre', 'icono'])` al array de props de `Inertia::render`
    - _Requerimientos: 8.4_

  - [ ]* 8.3 Escribir test de propiedad para resumen de actividad (Propiedad 7)
    - **Propiedad 7: El resumen de actividad refleja el estado real de la base de datos**
    - **Valida: Requerimientos 7.1, 7.2**
    - Crear `tests/Feature/User/ProfileControllerTest.php`
    - Para M órdenes `paid` del usuario, verificar que `activitySummary.acquiredProducts === M`
    - Comentario: `// Feature: user-panel, Property 7: el resumen de actividad refleja el estado real de la base de datos`

  - [ ]* 8.4 Escribir test de propiedad para tipos de pago activos (Propiedad 9)
    - **Propiedad 9: El modal de pago lista solo tipos activos**
    - **Valida: Requerimientos 8.4**
    - En `tests/Feature/User/ProfileControllerTest.php`
    - Crear tipos activos e inactivos; verificar que `tiposMetodoPago` contiene exactamente los activos
    - Comentario: `// Feature: user-panel, Property 9: el modal de pago lista solo tipos activos`

- [ ] 9. Corregir validación de avatar en `ProfileController::updateAvatar()`
  - [ ] 9.1 Cambiar la regla `'image'` por `'mimes:png,jpg,jpeg'` en `app/Http/Controllers/User/ProfileController.php`
    - En el método `updateAvatar`, reemplazar `'avatar' => ['required', 'image', 'max:2048']` por `'avatar' => ['required', 'mimes:png,jpg,jpeg', 'max:2048']`
    - _Requerimientos: 6.2, 6.3_

  - [ ]* 9.2 Escribir test de propiedad para validación de avatar (Propiedad 8)
    - **Propiedad 8: El avatar solo acepta formatos png, jpg y jpeg**
    - **Valida: Requerimientos 6.2, 6.3**
    - En `tests/Feature/User/ProfileControllerTest.php`
    - Para archivos con extensión `gif`, `pdf`, `webp`, verificar HTTP 422 y que `avatar` del usuario no cambia
    - Para archivos `png` y `jpg` válidos (≤ 2048 KB), verificar que el avatar se actualiza
    - Comentario: `// Feature: user-panel, Property 8: el avatar solo acepta formatos png, jpg y jpeg`

- [ ] 10. Conectar modal de métodos de pago en `profile.tsx`
  - [ ] 10.1 Actualizar la interfaz `ProfileProps` en `resources/js/pages/user/profile.tsx`
    - Agregar `tiposMetodoPago: { id: number; nombre: string; icono: string }[]` a la interfaz
    - Agregar `tiposMetodoPago` como parámetro desestructurado en la función del componente
    - _Requerimientos: 8.4_

  - [ ] 10.2 Reemplazar las opciones hardcodeadas del `<select>` por las de `tiposMetodoPago`
    - Cambiar el estado `newPaymentType` de `string` a `number | null` (almacena el `id` del tipo)
    - Inicializar `newPaymentType` con `tiposMetodoPago[0]?.id ?? null`
    - Reemplazar las tres `<option>` hardcodeadas por `tiposMetodoPago.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)`
    - _Requerimientos: 8.4_

  - [ ] 10.3 Conectar el botón "Aceptar" del modal al endpoint `POST /profile/payment-methods`
    - Agregar estado `newPaymentOwner` (string) y `newPaymentDetails` (string) al componente
    - Agregar campos de formulario en el modal para "Titular" y "Detalles" (últimos 4 dígitos / identificador de cuenta)
    - Implementar `submitPaymentMethod` que llama `router.post(route('user.profile.payment-methods.store'), { tipo_id: newPaymentType, titular: newPaymentOwner, detalles: newPaymentDetails }, { onSuccess: () => setIsAddPaymentModalOpen(false) })`
    - Conectar `submitPaymentMethod` al `onClick` del botón "Aceptar"
    - _Requerimientos: 8.3, 8.5, 8.6_

- [ ] 11. Checkpoint final — Integración completa
  - Asegurarse de que todos los tests pasen. Ejecutar `php artisan test --compact`. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Las tareas 4 y 5 (suscripciones) quedan en fase de espera hasta que el spec `admin-panel` cree el modelo `Suscripcion`; los controladores están preparados para recibir el modelo sin cambios adicionales
- Los tests de propiedad usan 100 iteraciones con `fake()` dentro de un loop (patrón Pest 4 sin dependencias externas)
- Cada test de propiedad incluye el comentario `// Feature: user-panel, Property {N}: {descripción}`
- La tarea 10.3 implementa el flujo básico de `storePaymentMethod` (titular + detalles manuales); la integración con SDKs de Stripe/PayPal/Mercado Pago es un paso posterior fuera del alcance de este spec
