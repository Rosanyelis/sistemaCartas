# Documento de Requerimientos: Panel del Usuario Suscriptor

## Introducción

El Panel del Usuario Suscriptor es una interfaz personal dentro de la plataforma que permite a los usuarios autenticados consultar sus órdenes de productos, gestionar sus suscripciones a historias, editar su información de perfil y métodos de pago, y cerrar sesión. El diseño React de todas las páginas ya está construido y funcional. El trabajo pendiente consiste exclusivamente en conectar los controladores backend con datos reales de la base de datos, migrar la paginación de client-side a server-side, e integrar el flujo real de métodos de pago con Stripe/PayPal/Mercado Pago.

---

## Glosario

- **User_Panel**: El sistema de gestión personal del usuario suscriptor descrito en este documento.
- **Usuario**: Persona autenticada con rol distinto a `admin` que accede al User_Panel.
- **Orden**: Registro de una transacción de compra representada por el modelo `StoreOrder`, con campos `id`, `user_id`, `status`, `total`, `created_at`.
- **Item_Orden**: Línea individual dentro de una Orden representada por el modelo `StoreOrderItem`, con campos `product_name`, `quantity`, `unit_price`, `line_total`.
- **Suscripcion**: Acuerdo de pago recurrente o único del Usuario para acceder a una Historia, representado por el modelo `Suscripcion` (pendiente de creación en el spec del admin-panel).
- **Historia**: Contenido serializado vendido por suscripción mensual o compra completa.
- **Perfil**: Conjunto de datos personales del Usuario almacenados en el modelo `User` (campos: `name`, `email`, `avatar`, `direction`, `zip_code`, `phone`).
- **Foto_Perfil**: Imagen de avatar del Usuario almacenada en el campo `avatar` del modelo `User`.
- **Metodo_Pago**: Registro del método de pago del Usuario almacenado en el modelo `MetodoPagoUsuario`, asociado a un `TipoMetodoPago`.
- **Tipo_Metodo_Pago**: Clasificación del método de pago representada por el modelo `TipoMetodoPago` (tabla `tipos_pago`); puede ser `Stripe`, `PayPal` o `Mercado Pago`.
- **Estado_Orden**: Valor que indica el resultado de una Orden; los estados del modelo son `pending_payment`, `paid` y `capture_failed`.
- **Estado_Suscripcion**: Valor que indica la situación de una Suscripción; puede ser `Activa`, `Inactiva` o `Incompleta`.
- **Tipo_Suscripcion**: Modalidad de una Suscripción; puede ser `Completa` o `Mensual`.
- **Paginador_Server**: Componente de paginación server-side que usa `paginate(10)` de Laravel y recibe props de Inertia con la estructura `LengthAwarePaginator`.
- **Modal_Cancelacion**: Ventana de confirmación ya implementada en `subscriptions.tsx` que se muestra antes de cancelar una Suscripción.
- **OrdenController**: Controlador en `app/Http/Controllers/User/OrdenController.php`, actualmente retorna datos mock hardcodeados.
- **SuscripcionController**: Controlador en `app/Http/Controllers/User/SuscripcionController.php`, actualmente retorna datos mock hardcodeados y no tiene método `cancel`.
- **ProfileController**: Controlador en `app/Http/Controllers/User/ProfileController.php`, ya conectado a BD real para perfil y métodos de pago; el campo `activitySummary` retorna valores mock.

---

## Estado Actual del Sistema

### Ya implementado (NO requiere trabajo)
- Layout `user-layout.tsx`: sidebar, navegación, modal de cerrar sesión funcional con Fortify.
- Página `orders.tsx`: tabla con filtros por texto y fecha, vista desktop y mobile, paginación client-side.
- Página `subscriptions.tsx`: tabla con filtros, vista desktop y mobile, Modal_Cancelacion implementado en UI.
- Página `profile.tsx`: foto de perfil, datos personales, métodos de pago, modal de añadir pago (UI).
- `ProfileController`: `update`, `updateAvatar`, `storePaymentMethod`, `setDefaultPaymentMethod`, `destroyPaymentMethod` — todos conectados a BD real.
- Rutas en `routes/web.php` para todas las secciones del panel.
- Modelos `StoreOrder`, `StoreOrderItem`, `MetodoPagoUsuario`, `TipoMetodoPago`.
- Autenticación y redirección por rol (admin/usuario) ya funcional.

### Pendiente de implementación
1. `OrdenController::index()` — reemplazar mocks con datos reales de `StoreOrder`.
2. `SuscripcionController::index()` — reemplazar mocks con datos reales de `Suscripcion`.
3. `SuscripcionController::cancel()` — nuevo método para cambiar estado de suscripción.
4. `ProfileController::index()` — conectar `activitySummary` con datos reales.
5. `orders.tsx` — migrar paginación de client-side (5 items) a server-side (10 items con Inertia).
6. `subscriptions.tsx` — migrar paginación de client-side (5 items) a server-side (10 items con Inertia) y conectar "Dar de baja" al backend.
7. `profile.tsx` — conectar modal de añadir método de pago al flujo real de Stripe/PayPal/Mercado Pago.
8. `ProfileController::updateAvatar()` — restringir validación a formatos `png`, `jpg`, `jpeg`.

---

## Requerimientos

### Requerimiento 1: Acceso al Panel del Usuario

**User Story:** Como usuario autenticado, quiero acceder a mi panel personal, para que pueda gestionar mis órdenes, suscripciones y perfil desde un solo lugar.

#### Criterios de Aceptación

1. WHILE el Usuario tiene una sesión activa y verificada, THE User_Panel SHALL mostrar las secciones: Órdenes, Suscripciones, Perfil y Cerrar Sesión en el sidebar de navegación.
2. IF un visitante no autenticado intenta acceder a cualquier ruta del User_Panel, THEN THE User_Panel SHALL redirigir al visitante a la página de inicio de sesión mediante el middleware `auth`.
3. IF un usuario con rol `admin` accede a `/dashboard`, THEN THE User_Panel SHALL redirigir al administrador al panel administrativo en lugar de mostrar el panel de usuario.

> **Estado:** Completamente implementado. No requiere cambios.

---

### Requerimiento 2: Visualización de Órdenes con Datos Reales

**User Story:** Como usuario, quiero ver el historial real de mis órdenes de productos, para que pueda conocer el estado de cada una de mis compras.

#### Criterios de Aceptación

1. WHEN el Usuario navega a la sección de Órdenes, THE OrdenController SHALL consultar el modelo `StoreOrder` filtrando por `user_id` del Usuario autenticado, con eager loading de `items`.
2. THE OrdenController SHALL mapear el campo `status` del modelo `StoreOrder` a etiquetas de presentación: `paid` → `Completado`, `capture_failed` → `Rechazado`, `pending_payment` → `Pendiente`.
3. THE OrdenController SHALL retornar los datos de Órdenes usando `paginate(10)` de Laravel y pasar el resultado como prop de Inertia a la página `user/orders`.
4. THE Paginador_Server SHALL mostrar 10 registros por página en la tabla de Órdenes.
5. WHEN el Usuario aplica un filtro de búsqueda por texto o fecha en la tabla de Órdenes, THE OrdenController SHALL aplicar los filtros como parámetros de query en la consulta Eloquent y SHALL retornar resultados paginados server-side.
6. IF el Usuario no tiene Órdenes registradas, THEN THE User_Panel SHALL mostrar el mensaje "No se encontraron órdenes que coincidan con tu búsqueda." en la tabla.

> **Estado:** `OrdenController::index()` retorna mocks hardcodeados. Requiere reemplazar con consulta real a `StoreOrder`. La página `orders.tsx` usa paginación client-side con 5 items; debe migrarse a server-side con 10 items usando props de Inertia.

---

### Requerimiento 3: Visualización de Suscripciones con Datos Reales

**User Story:** Como usuario, quiero ver el listado real de mis suscripciones a historias, para que pueda conocer el estado y los detalles de cada una.

#### Criterios de Aceptación

1. WHEN el Usuario navega a la sección de Suscripciones, THE SuscripcionController SHALL consultar el modelo `Suscripcion` filtrando por el Usuario autenticado.
2. THE SuscripcionController SHALL retornar los datos de Suscripciones usando `paginate(10)` de Laravel y pasar el resultado como prop de Inertia a la página `user/subscriptions`.
3. THE Paginador_Server SHALL mostrar 10 registros por página en la tabla de Suscripciones.
4. WHEN el Usuario aplica un filtro de búsqueda por texto o fecha en la tabla de Suscripciones, THE SuscripcionController SHALL aplicar los filtros como parámetros de query en la consulta Eloquent y SHALL retornar resultados paginados server-side.
5. IF el Usuario no tiene Suscripciones registradas, THEN THE User_Panel SHALL mostrar el mensaje "No se encontraron suscripciones." en la tabla.

> **Estado:** `SuscripcionController::index()` retorna mocks hardcodeados. Requiere reemplazar con consulta real al modelo `Suscripcion` (pendiente de creación). La página `subscriptions.tsx` usa paginación client-side con 5 items; debe migrarse a server-side con 10 items usando props de Inertia.

---

### Requerimiento 4: Cancelación de Suscripción

**User Story:** Como usuario, quiero poder cancelar una suscripción activa, para que pueda dejar de recibir cobros recurrentes cuando ya no desee el servicio.

#### Criterios de Aceptación

1. WHILE una Suscripción tiene Estado_Suscripcion `Activa`, THE User_Panel SHALL mostrar el botón "Dar de baja" en la fila correspondiente de la tabla de Suscripciones.
2. WHEN el Usuario activa el botón "Dar de baja", THE User_Panel SHALL abrir el Modal_Cancelacion ya implementado en `subscriptions.tsx`.
3. WHEN el Usuario confirma la cancelación en el Modal_Cancelacion, THE SuscripcionController SHALL ejecutar el método `cancel` que cambia el Estado_Suscripcion de `Activa` a `Inactiva` en el modelo `Suscripcion`.
4. WHEN la cancelación es exitosa, THE User_Panel SHALL reflejar el cambio de estado en la tabla mediante una recarga Inertia sin recargar la página completa.
5. IF una Suscripción tiene Estado_Suscripcion `Inactiva` o `Incompleta`, THEN THE User_Panel SHALL ocultar el botón "Dar de baja" para esa fila.
6. IF el Usuario intenta cancelar una Suscripción que no le pertenece, THEN THE SuscripcionController SHALL retornar un error 403 Forbidden.

> **Estado:** El Modal_Cancelacion ya existe en `subscriptions.tsx` pero el botón "Continuar" no está conectado al backend. Requiere crear `SuscripcionController::cancel()` y agregar la ruta `PATCH subscriptions/{suscripcion}/cancel` en `routes/web.php`, además de conectar el modal al endpoint real.

---

### Requerimiento 5: Visualización y Edición del Perfil

**User Story:** Como usuario, quiero ver y editar mi información personal y de envío, para que pueda mantener mis datos actualizados en la plataforma.

#### Criterios de Aceptación

1. THE User_Panel SHALL mostrar en la sección de Perfil los campos del Usuario: Foto de Perfil, Nombre, Correo Electrónico, Teléfono, Dirección y Código Postal.
2. THE User_Panel SHALL permitir al Usuario editar los campos: Nombre, Teléfono, Dirección y Código Postal. El campo Correo Electrónico SHALL mostrarse como solo lectura (deshabilitado).
3. WHEN el Usuario activa el botón "Guardar cambios" con todos los campos válidos, THE ProfileController SHALL persistir los cambios en el modelo `User` y SHALL retornar una respuesta de éxito que actualice la UI sin recargar la página.
4. IF el Usuario intenta guardar el Perfil con el campo Nombre vacío, THEN THE ProfileController SHALL retornar un error de validación indicando el campo requerido.

> **Estado:** Completamente implementado. `ProfileController::update()` ya conectado a BD real. No requiere cambios.

---

### Requerimiento 6: Gestión de Foto de Perfil

**User Story:** Como usuario, quiero cargar o cambiar mi foto de perfil, para que pueda personalizar mi cuenta con una imagen propia.

#### Criterios de Aceptación

1. THE User_Panel SHALL mostrar la Foto_Perfil actual del Usuario; IF el Usuario no tiene Foto_Perfil, THEN THE User_Panel SHALL mostrar el avatar genérico `/images/avatar-placeholder.jpg`.
2. THE ProfileController SHALL validar que el archivo de Foto_Perfil sea de tipo `png`, `jpg` o `jpeg` con un tamaño máximo de 2048 KB.
3. IF el Usuario intenta cargar un archivo en un formato distinto a `png`, `jpg` o `jpeg`, THEN THE ProfileController SHALL retornar un error de validación indicando los formatos permitidos y SHALL rechazar el archivo.
4. WHEN el Usuario selecciona un archivo de imagen válido, THE User_Panel SHALL enviar el archivo al endpoint `POST /profile/avatar` y SHALL actualizar la Foto_Perfil mostrada en el sidebar y en la tarjeta de perfil.
5. WHEN la carga es exitosa, THE ProfileController SHALL eliminar la Foto_Perfil anterior del almacenamiento y SHALL actualizar el campo `avatar` del modelo `User`.

> **Estado:** `ProfileController::updateAvatar()` ya funcional pero la validación actual acepta cualquier tipo de imagen (`'image'`). Requiere restringir la regla de validación a `mimes:png,jpg,jpeg`.

---

### Requerimiento 7: Resumen de Actividad en el Perfil

**User Story:** Como usuario, quiero ver un resumen de mis suscripciones activas y productos adquiridos en mi perfil, para que pueda tener una visión rápida de mi actividad en la plataforma.

#### Criterios de Aceptación

1. WHEN el Usuario navega a la sección de Perfil, THE ProfileController SHALL calcular el número de Suscripciones con Estado_Suscripcion `Activa` del Usuario autenticado y SHALL retornarlo en el campo `activitySummary.activeSubscriptions`.
2. WHEN el Usuario navega a la sección de Perfil, THE ProfileController SHALL calcular el número total de Órdenes con `status = paid` del Usuario autenticado y SHALL retornarlo en el campo `activitySummary.acquiredProducts`.
3. THE User_Panel SHALL mostrar los valores de `activitySummary` en la tarjeta lateral de la sección de Perfil.

> **Estado:** `ProfileController::index()` retorna `activeSubscriptions: 0` y `acquiredProducts: 0` hardcodeados. Requiere conectar con consultas reales: `Suscripcion::where('estado', 'Activa')->count()` y `StoreOrder::where('status', 'paid')->count()`.

---

### Requerimiento 8: Gestión de Métodos de Pago

**User Story:** Como usuario, quiero añadir, eliminar y establecer como predeterminado mis métodos de pago, para que pueda gestionar cómo se procesan mis transacciones.

#### Criterios de Aceptación

1. THE User_Panel SHALL mostrar en la sección de Perfil todos los Metodos_Pago del Usuario con: tipo, ícono, titular, detalles y estado predeterminado.
2. IF el Usuario no tiene ningún Metodo_Pago registrado, THEN THE User_Panel SHALL mostrar únicamente el botón "+ Añadir nuevo método de pago".
3. WHEN el Usuario activa el botón "Añadir nuevo" o "+ Añadir nuevo método de pago", THE User_Panel SHALL abrir el modal de añadir método de pago.
4. THE User_Panel SHALL listar en el selector del modal únicamente los Tipos_Metodo_Pago con `is_active = true` obtenidos desde la tabla `tipos_pago`.
5. WHEN el Usuario selecciona un Tipo_Metodo_Pago y confirma en el modal, THE User_Panel SHALL iniciar el flujo de autorización correspondiente: Stripe SDK para tarjeta, `PayPalService` para PayPal, o SDK de Mercado Pago para Mercado Pago.
6. WHEN el flujo de autorización es exitoso, THE ProfileController SHALL almacenar el nuevo Metodo_Pago en `MetodoPagoUsuario` con los datos del titular y los detalles permitidos (últimos 4 dígitos para Stripe, identificador de cuenta para PayPal y Mercado Pago).
7. WHEN el Usuario activa "Marcar predeterminado" en un Metodo_Pago, THE ProfileController SHALL actualizar `is_default = true` en ese método y `is_default = false` en todos los demás del Usuario.
8. WHEN el Usuario elimina un Metodo_Pago, THE ProfileController SHALL verificar mediante `MetodoPagoUsuarioPolicy` que el Metodo_Pago pertenece al Usuario autenticado antes de eliminarlo.
9. IF ocurre un error durante el flujo de autorización de pago, THEN THE User_Panel SHALL mostrar un mensaje de error descriptivo y SHALL conservar los Metodos_Pago existentes sin modificaciones.

> **Estado:** Las operaciones de listar, eliminar y marcar predeterminado ya están completamente implementadas en `ProfileController`. El modal de añadir pago existe en `profile.tsx` pero el botón "Aceptar" solo cierra el modal sin conectarse al backend real. Requiere implementar el flujo de autorización por tipo de pago (Stripe/PayPal/Mercado Pago) y conectar el modal al endpoint `POST /profile/payment-methods`.

---

### Requerimiento 9: Cierre de Sesión

**User Story:** Como usuario, quiero cerrar sesión desde el panel, para que pueda salir de mi cuenta de forma segura.

#### Criterios de Aceptación

1. THE User_Panel SHALL mostrar el botón "Cerrar Sesión" en la parte inferior del sidebar de navegación.
2. WHEN el Usuario activa el botón "Cerrar Sesión", THE User_Panel SHALL abrir el Modal de confirmación de cierre de sesión.
3. WHEN el Usuario confirma en el modal, THE User_Panel SHALL enviar una petición `POST` al endpoint de logout de Fortify, SHALL invalidar la sesión activa y SHALL redirigir al Usuario a la página de inicio del sitio.
4. WHEN el Usuario cancela en el modal, THE User_Panel SHALL cerrar el modal sin cerrar la sesión.

> **Estado:** Completamente implementado en `user-layout.tsx`. No requiere cambios.

---

### Requerimiento 10: Paginación Server-Side de Tablas

**User Story:** Como usuario, quiero que las tablas de órdenes y suscripciones estén paginadas con datos del servidor, para que la navegación sea eficiente independientemente del volumen de registros.

#### Criterios de Aceptación

1. THE Paginador_Server SHALL mostrar 10 registros por página en las tablas de Órdenes y Suscripciones, usando `paginate(10)` de Laravel en los respectivos controladores.
2. THE Paginador_Server SHALL recibir la estructura `LengthAwarePaginator` de Laravel como prop de Inertia, incluyendo: `data`, `current_page`, `last_page`, `per_page`, `total`, `links`.
3. WHEN el Usuario navega entre páginas, THE User_Panel SHALL usar `router.get()` de Inertia con el parámetro `page` para solicitar la página correspondiente al servidor, preservando los filtros activos como query params.
4. WHEN el Usuario aplica o modifica un filtro, THE User_Panel SHALL regresar a la primera página de resultados (`page=1`).
5. IF el Usuario se encuentra en la primera página, THEN THE Paginador_Server SHALL deshabilitar el botón de navegación izquierdo.
6. IF el Usuario se encuentra en la última página (`current_page === last_page`), THEN THE Paginador_Server SHALL deshabilitar el botón de navegación derecho.

> **Estado:** Ambas páginas (`orders.tsx` y `subscriptions.tsx`) usan paginación client-side con `itemsPerPage = 5` y array local. Requiere migrar a server-side: los controladores deben usar `paginate(10)` y los componentes React deben consumir el paginador de Inertia en lugar del estado local.
