# Documento de Requerimientos: Panel Administrativo

## Introducción

El Panel Administrativo es una interfaz de gestión interna para la plataforma Laravel. Permite a los administradores monitorear métricas clave del negocio, gestionar órdenes de productos, suscripciones, clientes, historias y productos. El acceso está protegido por autenticación exclusiva para usuarios con rol `admin`. La plataforma maneja dos tipos de contenido vendible: **Historias** (contenido serializado por suscripción o compra completa) y **Productos** (artículos físicos de papelería).

---

## Glosario

- **Admin_Panel**: El sistema de gestión interna descrito en este documento.
- **Administrador**: Usuario con rol `admin` que tiene acceso completo al Admin_Panel.
- **Historia**: Contenido serializado vendido por suscripción mensual o compra completa, dividido en entregas/capítulos.
- **Producto**: Artículo físico de papelería disponible para compra directa con inventario de stock.
- **Orden**: Registro de una transacción de compra de uno o más Productos por parte de un Cliente.
- **Suscripción**: Acuerdo de pago recurrente o único de un Cliente para acceder a una Historia.
- **Cliente**: Usuario registrado en la plataforma con perfil completo.
- **Dashboard**: Pantalla principal del Admin_Panel con métricas y gráficas de resumen.
- **Entrega**: Capítulo o parte individual de una Historia publicada de forma periódica.
- **Estado_Orden**: Valor que indica el resultado de una Orden; puede ser `Completado` o `Rechazado`.
- **Estado_Suscripcion**: Valor que indica la situación de una Suscripción; puede ser `Activa`, `Inactiva` o `Incompleta`.
- **Estado_Historia**: Valor que indica la visibilidad de una Historia; puede ser `Activo` o `Pausado`.
- **Estado_Producto**: Valor que indica la visibilidad de un Producto; puede ser `Activo` o `Pausado`.
- **Estado_Entrega**: Valor que indica la publicación de una Entrega; puede ser `Borrador` o `Activo`.
- **Exportador_Excel**: Componente del Admin_Panel que genera archivos `.xlsx` con los datos de una tabla.
- **Filtro**: Componente de búsqueda que restringe los registros mostrados en una tabla.
- **Paginador**: Componente que divide los resultados de una tabla en páginas de 10 registros.

---

## Estado Actual del Sistema

### Ya implementado (NO requiere trabajo)

- Layout `user-layout.tsx`: sidebar con menú admin (Panel, Órdenes, Suscripciones, Clientes, Historias, Productos), header con indicador de admin, modal de cerrar sesión funcional.
- Página `resources/js/pages/admin/dashboard.tsx`: 5 tarjetas de métricas con datos mock, gráfica de líneas (Recharts LineChart) con datos mock para Historias/Productos/Cancelados, tarjeta "Ventas totales" con desglose mock, tarjeta "Historias activas" con gráfica de dona (PieChart) y datos mock, filtros de período (Semana/rango de fechas) solo UI.
- Página `resources/js/pages/admin/orders.tsx`: tabla con columnas Nº/Productos/Cantidad/Precio/Cliente/Dirección/Estado, filtro de búsqueda por texto, selector de rango de fechas (solo UI), botón "Exportar a excel" (solo UI), paginación client-side con `itemsPerPage = 8` y `totalPages = 12` hardcodeado.
- `OrdenController::index()` en `User\OrdenController`: detecta si es admin y retorna datos mock de admin a `admin/orders`.
- Rutas admin stub en `routes/web.php` bajo `can:admin`: `/clients`, `/admin/stories`, `/admin/products` — retornan páginas Inertia vacías.
- Modelos `StoreOrder` y `StoreOrderItem` con relaciones y casts.
- Autenticación y redirección por rol (admin/usuario) ya funcional.

### Pendiente de implementación

**Backend:**
1. Crear migraciones y modelos: `Historia`, `Entrega`, `Producto`, `Suscripcion`.
2. Crear `Admin\DashboardController` con deferred props para métricas y gráfica de ventas reales.
3. Crear `Admin\OrdenController` con filtros server-side, paginación `paginate(10)` y exportación Excel real.
4. Crear `Admin\SuscripcionController`, `Admin\ClienteController`, `Admin\HistoriaController`, `Admin\ProductoController` con CRUD completo.
5. Instalar `maatwebsite/excel` y crear clases Export para cada sección.
6. Registrar todas las rutas admin completas en `routes/web.php`.

**Frontend:**
1. `dashboard.tsx` — reemplazar datos mock con props de Inertia (deferred), conectar filtros de período al backend.
2. `orders.tsx` — migrar de client-side (8 items, mock) a server-side (10 items, datos reales), conectar exportación Excel.
3. Crear `resources/js/pages/admin/subscriptions.tsx` — tabla de suscripciones admin.
4. Crear `resources/js/pages/admin/clients.tsx` — tabla de clientes.
5. Crear `resources/js/pages/admin/historias/index.tsx` — listado de historias con acciones.
6. Crear `resources/js/pages/admin/historias/form.tsx` — formulario crear/editar historia.
7. Crear `resources/js/pages/admin/productos/index.tsx` — listado de productos con acciones.
8. Crear `resources/js/pages/admin/productos/form.tsx` — formulario crear/editar producto.

---

## Requerimientos

### Requerimiento 1: Autenticación del Administrador

**User Story:** Como administrador, quiero iniciar sesión con mis credenciales, para que pueda acceder de forma segura al Panel Administrativo.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar un formulario de inicio de sesión con los campos Correo Electrónico, Contraseña y un botón "Iniciar Sesión".
2. WHEN el Administrador envía el formulario con credenciales válidas de un usuario con rol `admin`, THE Admin_Panel SHALL redirigir al Dashboard.
3. IF el Administrador envía credenciales incorrectas, THEN THE Admin_Panel SHALL mostrar un mensaje de error indicando que las credenciales son inválidas.
4. IF un usuario sin rol `admin` intenta acceder al Admin_Panel, THEN THE Admin_Panel SHALL redirigir al usuario a la página de inicio de sesión.
5. WHILE el Administrador tiene una sesión activa, THE Admin_Panel SHALL mantener el acceso sin requerir nueva autenticación.

> **Estado:** El login compartido con Fortify y la redirección por rol ya están implementados. El sidebar admin en `user-layout.tsx` ya muestra el menú correcto para admins. No requiere cambios en autenticación.

---

### Requerimiento 2: Dashboard — Tarjetas de Métricas

**User Story:** Como administrador, quiero ver tarjetas con métricas clave del negocio, para que pueda tener una visión rápida del estado de la plataforma.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una tarjeta "Usuarios Registrados" con el conteo de Clientes que tienen perfil completo en la plataforma.
2. THE Dashboard SHALL mostrar una tarjeta "Suscripciones" con dos contadores: "Suscritos" (Suscripciones con Estado_Suscripcion `Activa` y con cobro vigente) y "Dados de Baja" (Suscripciones que estuvieron activas pero fueron canceladas); ambos contadores se reinician al inicio de cada mes calendario.
3. THE Dashboard SHALL mostrar una tarjeta "Órdenes del Día" con dos contadores: "Completadas" y "Rechazadas", calculados sobre las Órdenes generadas en las últimas 24 horas; ambos contadores se reinician cada 24 horas.
4. THE Dashboard SHALL mostrar una tarjeta "Historias Activas" con el total de Historias con Estado_Historia `Activo` y el número de Suscripciones activas asociadas a cada Historia.
5. THE Dashboard SHALL mostrar una tarjeta "Productos Activos" con el total de Productos con Estado_Producto `Activo` y una gráfica de barras con el valor total vendido en dinero (MXN) por cada Producto activo.
6. THE Dashboard SHALL mostrar una tarjeta "Ventas del Mes" con el valor total vendido en el mes calendario actual, desglosado en "Historias (MX)" y "Productos (MX)"; el contador se reinicia al inicio de cada mes calendario.

> **Estado:** La UI de las 5 tarjetas de métricas ya existe en `dashboard.tsx` con datos mock hardcodeados. Requiere crear `Admin\DashboardController` con `DashboardMetricasService` y conectar las props de Inertia (deferred) para reemplazar los mocks con datos reales. Los modelos `Historia`, `Producto` y `Suscripcion` aún no existen.

---

### Requerimiento 3: Dashboard — Gráfica de Ventas

**User Story:** Como administrador, quiero ver una gráfica comparativa de ventas, para que pueda analizar el rendimiento de Historias vs Productos en distintos períodos.

#### Criterios de Aceptación

1. THE Dashboard SHALL mostrar una gráfica que compare el valor total de ventas de Historias contra el valor total de ventas de Productos en el período seleccionado.
2. THE Dashboard SHALL ofrecer un selector de período con las opciones: Semana, Mes y Año; el período por defecto es Mes.
3. WHEN el Administrador selecciona un período diferente, THE Dashboard SHALL actualizar la gráfica con los datos correspondientes al nuevo período sin recargar la página.
4. THE Dashboard SHALL mostrar la gráfica con un diseño moderno que incluya leyenda, etiquetas de ejes y valores al pasar el cursor sobre los puntos de datos.

> **Estado:** La gráfica de líneas (LineChart de Recharts) ya existe en `dashboard.tsx` con datos mock y los botones de filtro de período ya están en la UI. Requiere conectar el selector de período al endpoint `/admin/dashboard/ventas-chart` y reemplazar `salesData` con props de Inertia.

---

### Requerimiento 4: Gestión de Órdenes

**User Story:** Como administrador, quiero consultar y exportar el listado de Órdenes, para que pueda hacer seguimiento de las transacciones de la plataforma.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar una tabla de Órdenes con las columnas: Número de Orden, Producto, Cantidad, Precio, Nombre del Cliente, Dirección y Estado (Rechazado/Completado).
2. THE Admin_Panel SHALL permitir filtrar la tabla de Órdenes por Número de Orden, Nombre del Cliente o Correo Electrónico del Cliente.
3. THE Admin_Panel SHALL mostrar un ícono de calendario que, al ser activado, permita al Administrador seleccionar un rango de fechas para filtrar las Órdenes por fecha de creación.
4. WHEN el Administrador aplica uno o más filtros, THE Admin_Panel SHALL actualizar la tabla mostrando únicamente las Órdenes que cumplan todos los criterios activos.
5. THE Admin_Panel SHALL mostrar un botón "Exportar Excel" que genere un archivo `.xlsx` con los registros actualmente visibles en la tabla, respetando los filtros aplicados.
6. THE Paginador SHALL dividir los resultados de la tabla de Órdenes en páginas de 10 registros, con botones de navegación izquierdo y derecho, y SHALL funcionar correctamente cuando hay filtros activos.

> **Estado:** La UI de `orders.tsx` ya está construida con tabla, filtro de búsqueda, selector de fechas (solo UI) y botón "Exportar a excel" (solo UI). La paginación es client-side con 8 items y `totalPages = 12` hardcodeado. `OrdenController::index()` retorna mocks. Requiere: crear `Admin\OrdenController` con filtros y `paginate(10)` server-side, conectar exportación Excel real con `maatwebsite/excel`, y migrar `orders.tsx` de client-side a server-side.

---

### Requerimiento 5: Gestión de Suscripciones

**User Story:** Como administrador, quiero consultar y exportar el listado de Suscripciones, para que pueda monitorear el estado de los accesos a Historias.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar una tabla de Suscripciones con las columnas: Número de Suscripción, Historia, Cantidad, Tipo de Suscripción (Completa/Mensual), Fecha de Adquisición, Fecha de Finalización, Próximo Cobro, Nombre del Cliente, Dirección y Estado (Activa/Inactiva/Incompleta).
2. THE Admin_Panel SHALL permitir filtrar la tabla de Suscripciones por Número de Suscripción, Nombre del Cliente o Correo Electrónico del Cliente.
3. THE Admin_Panel SHALL mostrar un ícono de calendario que, al ser activado, permita al Administrador seleccionar un rango de fechas para filtrar las Suscripciones por Fecha de Adquisición.
4. WHEN el Administrador aplica uno o más filtros, THE Admin_Panel SHALL actualizar la tabla mostrando únicamente las Suscripciones que cumplan todos los criterios activos.
5. THE Admin_Panel SHALL mostrar un botón "Exportar Excel" que genere un archivo `.xlsx` con los registros actualmente visibles en la tabla, respetando los filtros aplicados.
6. THE Paginador SHALL dividir los resultados de la tabla de Suscripciones en páginas de 10 registros, con botones de navegación izquierdo y derecho, y SHALL funcionar correctamente cuando hay filtros activos.

> **Estado:** La página `subscriptions.tsx` no existe aún. Requiere crear la página React completa y el `Admin\SuscripcionController` con filtros server-side, `paginate(10)` y exportación Excel. El modelo `Suscripcion` tampoco existe aún.

---

### Requerimiento 6: Gestión de Clientes

**User Story:** Como administrador, quiero consultar y exportar el listado de Clientes, para que pueda conocer la base de usuarios registrados en la plataforma.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar una tabla de Clientes con las columnas: ID de Cliente, Nombre, Correo Electrónico, Dirección, Teléfono y ¿Tiene Suscripción? (Sí/No).
2. THE Admin_Panel SHALL permitir filtrar la tabla de Clientes por Nombre del Cliente o Correo Electrónico.
3. WHEN el Administrador aplica un filtro, THE Admin_Panel SHALL actualizar la tabla mostrando únicamente los Clientes que cumplan el criterio activo.
4. THE Admin_Panel SHALL mostrar un botón "Exportar Excel" que genere un archivo `.xlsx` con la información completa de los Clientes, respetando los filtros aplicados si los hay.
5. THE Paginador SHALL dividir los resultados de la tabla de Clientes en páginas de 10 registros, con botones de navegación izquierdo y derecho, y SHALL funcionar correctamente cuando hay filtros activos.

> **Estado:** La página `clients.tsx` no existe aún (la ruta `/clients` retorna una página Inertia vacía). Requiere crear la página React y el `Admin\ClienteController` con filtros server-side y `paginate(10)`.

---

### Requerimiento 7: Creación y Edición de Historias

**User Story:** Como administrador, quiero crear y editar Historias con toda su información, para que pueda publicarlas y mantenerlas actualizadas en la plataforma.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar un botón "Crear Historia" en color primario en la esquina superior derecha de la sección de Historias, que al ser activado abra un formulario de creación.
2. THE Admin_Panel SHALL requerir que el formulario de Historia incluya los siguientes campos obligatorios agrupados en secciones: Información Básica (Nombre, Descripción Corta, Descripción Larga con editor de texto enriquecido, Detalle con soporte de íconos y mínimo 5 tipografías, Categoría, Autor, Duración de Historia); Precio (Precio Base, Precio Promocional, Impuestos en porcentaje); Inventario (Código de Historia, variantes opcionales de Color y Material); Imágenes y Multimedia (Imagen Principal, Video, Galería de mínimo 5 fotos); Información de Envío (Peso, Dimensiones, Tipo de Envío); Estado y Visibilidad (selector `Activo` o `Pausado`).
3. IF el Administrador intenta guardar una Historia sin completar un campo obligatorio, THEN THE Admin_Panel SHALL mostrar un mensaje de error indicando el campo faltante y SHALL impedir el guardado.
4. WHEN el Administrador activa el botón "Guardar Historia" con todos los campos obligatorios completos, THE Admin_Panel SHALL persistir la Historia en la base de datos y SHALL publicarla en la sección de Historias del sitio si el estado es `Activo`.
5. WHEN el Administrador activa la acción "Editar" sobre una Historia existente, THE Admin_Panel SHALL cargar el formulario con los datos actuales de la Historia para su modificación.

> **Estado:** La página `historias/form.tsx` no existe aún. El modelo `Historia` tampoco existe. Requiere crear migración, modelo, Form Requests (`StoreHistoriaRequest`, `UpdateHistoriaRequest`), `Admin\HistoriaController` y la página React del formulario.

---

### Requerimiento 8: Listado y Acciones Rápidas de Historias

**User Story:** Como administrador, quiero ver el listado de Historias con acciones rápidas, para que pueda gestionar el catálogo de contenido de forma eficiente.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar una tabla de Historias con las columnas: Código, Imagen Miniatura, Nombre, Categoría, Autor, Precio y Estado.
2. THE Admin_Panel SHALL mostrar para cada Historia las siguientes acciones rápidas: Editar, Vista Previa, Ver, Duplicar, Activar/Pausar y Eliminar.
3. WHEN el Administrador activa la acción "Ver" sobre una Historia, THE Admin_Panel SHALL abrir un modal con la información completa de la Historia y un listado de sus Entregas; el listado de Entregas SHALL incluir Número de Entrega, Estado_Entrega y acciones Ver y Editar por entrega; el modal SHALL incluir un botón "Crear Nueva Entrega".
4. WHEN el Administrador activa la acción "Duplicar" sobre una Historia, THE Admin_Panel SHALL crear una copia de la Historia con todos sus datos y Estado_Historia `Pausado`.
5. WHEN el Administrador activa la acción "Activar/Pausar" sobre una Historia, THE Admin_Panel SHALL alternar el Estado_Historia entre `Activo` y `Pausado` y SHALL reflejar el cambio en la tabla sin recargar la página.
6. WHEN el Administrador activa la acción "Eliminar" sobre una Historia, THE Admin_Panel SHALL solicitar confirmación antes de eliminar el registro de la base de datos.
7. THE Admin_Panel SHALL mostrar un Filtro inteligente en la esquina superior izquierda de la sección de Historias que permita buscar por Nombre, Código y Categoría simultáneamente.
8. THE Admin_Panel SHALL mostrar un botón "Generar Reporte Excel" que exporte el listado de Historias respetando los filtros activos aplicados.

> **Estado:** La página `historias/index.tsx` no existe aún (la ruta `/admin/stories` retorna una página Inertia vacía). Requiere crear la página React completa con tabla y acciones, y el `Admin\HistoriaController` con todos los métodos CRUD y acciones especiales.

---

### Requerimiento 9: Creación y Edición de Productos

**User Story:** Como administrador, quiero crear y editar Productos con toda su información, para que pueda publicarlos y mantenerlos actualizados en la plataforma.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar un botón "Crear Producto" en color primario en la esquina superior derecha de la sección de Productos, que al ser activado abra un formulario de creación.
2. THE Admin_Panel SHALL requerir que el formulario de Producto incluya los siguientes campos obligatorios agrupados en secciones: Información Básica (Nombre, Descripción Corta, Descripción Larga, Detalle, Categoría, Subcategoría); Precio (Precio Base, Precio Promocional, Impuestos en porcentaje); Inventario (Código de Producto, Stock, variantes opcionales de Color y Material); Imágenes y Multimedia (Imagen Principal, Galería); Información de Envío (Peso, Dimensiones, Tipo de Envío); Estado y Visibilidad (selector `Activo` o `Pausado`).
3. IF el Administrador intenta guardar un Producto sin completar un campo obligatorio, THEN THE Admin_Panel SHALL mostrar un mensaje de error indicando el campo faltante y SHALL impedir el guardado.
4. WHEN el Administrador activa el botón "Guardar Producto" con todos los campos obligatorios completos, THE Admin_Panel SHALL persistir el Producto en la base de datos y SHALL publicarlo en la sección de Productos del sitio si el estado es `Activo`.
5. WHEN el Administrador activa la acción "Editar" sobre un Producto existente, THE Admin_Panel SHALL cargar el formulario con los datos actuales del Producto para su modificación.

> **Estado:** La página `productos/form.tsx` no existe aún. El modelo `Producto` tampoco existe. Requiere crear migración, modelo, Form Requests (`StoreProductoRequest`, `UpdateProductoRequest`), `Admin\ProductoController` y la página React del formulario.

---

### Requerimiento 10: Listado y Acciones Rápidas de Productos

**User Story:** Como administrador, quiero ver el listado de Productos con acciones rápidas, para que pueda gestionar el catálogo de artículos de forma eficiente.

#### Criterios de Aceptación

1. THE Admin_Panel SHALL mostrar una tabla de Productos con las columnas: Código, Imagen Miniatura, Nombre, Categoría, Subcategoría, Precio, Stock Disponible y Estado.
2. THE Admin_Panel SHALL mostrar para cada Producto las siguientes acciones rápidas: Editar, Vista Previa, Ajustar Stock, Duplicar, Activar/Pausar y Eliminar.
3. WHEN el Administrador activa la acción "Ajustar Stock" sobre un Producto, THE Admin_Panel SHALL mostrar un control que permita incrementar o reducir el valor de Stock Disponible del Producto y SHALL persistir el nuevo valor en la base de datos.
4. WHEN el Administrador activa la acción "Duplicar" sobre un Producto, THE Admin_Panel SHALL crear una copia del Producto con todos sus datos y Estado_Producto `Pausado`.
5. WHEN el Administrador activa la acción "Activar/Pausar" sobre un Producto, THE Admin_Panel SHALL alternar el Estado_Producto entre `Activo` y `Pausado` y SHALL reflejar el cambio en la tabla sin recargar la página.
6. WHEN el Administrador activa la acción "Eliminar" sobre un Producto, THE Admin_Panel SHALL solicitar confirmación antes de eliminar el registro de la base de datos.
7. THE Admin_Panel SHALL mostrar un Filtro inteligente en la esquina superior izquierda de la sección de Productos que permita buscar por Nombre, Código y Categoría simultáneamente.
8. THE Admin_Panel SHALL mostrar un botón "Generar Reporte Excel" que exporte el listado de Productos respetando los filtros activos aplicados.

> **Estado:** La página `productos/index.tsx` no existe aún (la ruta `/admin/products` retorna una página Inertia vacía). Requiere crear la página React completa con tabla y acciones, y el `Admin\ProductoController` con todos los métodos CRUD y acciones especiales.

---

### Requerimiento 11: Exportación de Datos

**User Story:** Como administrador, quiero exportar datos de cualquier sección a Excel, para que pueda analizarlos o compartirlos fuera de la plataforma.

#### Criterios de Aceptación

1. THE Exportador_Excel SHALL generar archivos en formato `.xlsx` compatibles con Microsoft Excel y Google Sheets.
2. WHEN el Administrador activa un botón de exportación con filtros activos, THE Exportador_Excel SHALL incluir únicamente los registros que cumplan los criterios de filtrado activos en ese momento.
3. WHEN el Administrador activa un botón de exportación sin filtros activos, THE Exportador_Excel SHALL incluir todos los registros de la sección correspondiente.
4. THE Exportador_Excel SHALL incluir encabezados de columna en la primera fila del archivo generado, con los mismos nombres de columna que se muestran en la tabla de la interfaz.

> **Estado:** Los botones "Exportar a excel" y "Generar Reporte Excel" ya existen en la UI de `orders.tsx` (y existirán en las demás páginas cuando se creen), pero no tienen funcionalidad real. Requiere instalar `maatwebsite/excel` y crear las clases Export para cada sección.

---

### Requerimiento 12: Paginación de Tablas

**User Story:** Como administrador, quiero que las tablas estén paginadas, para que pueda navegar por grandes volúmenes de datos de forma ordenada.

#### Criterios de Aceptación

1. THE Paginador SHALL mostrar un máximo de 10 registros por página en todas las tablas del Admin_Panel.
2. THE Paginador SHALL mostrar botones de navegación izquierdo (página anterior) y derecho (página siguiente).
3. WHILE hay filtros activos en una tabla, THE Paginador SHALL calcular la paginación sobre el conjunto de registros filtrados.
4. WHEN el Administrador aplica o modifica un filtro, THE Paginador SHALL regresar a la primera página de resultados.
5. IF el Administrador se encuentra en la primera página, THEN THE Paginador SHALL deshabilitar el botón de navegación izquierdo.
6. IF el Administrador se encuentra en la última página, THEN THE Paginador SHALL deshabilitar el botón de navegación derecho.

> **Estado:** `orders.tsx` usa paginación client-side con `itemsPerPage = 8` y `totalPages = 12` hardcodeado. Las demás páginas de tabla aún no existen. Todas las tablas deben usar paginación server-side con `paginate(10)` de Laravel y props de Inertia.
