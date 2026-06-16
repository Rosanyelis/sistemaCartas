# Despliegue en Ubuntu — Historias por Correo (sistemaCartas)

Guía técnica para desplegar y operar **Historias por Correo** en un servidor **Ubuntu** con **Contabo** y **CloudPanel**, alineada con el workflow de GitHub Actions (`.github/workflows/deploy.yml`).

**Audiencia:** DevOps / desarrollador que despliega por primera vez en producción.

---

## 1. Resumen del stack

| Componente | Versión / nota |
|------------|----------------|
| **Laravel** | 12 (`laravel/framework ^12.0`) |
| **PHP** | 8.4 recomendado en producción (el proyecto declara `^8.2` en `composer.json`) |
| **Node.js** | LTS (20.x o 22.x) para `npm run build` (Vite) |
| **Base de datos** | MySQL/MariaDB en producción; SQLite solo desarrollo local |
| **Servidor web** | Nginx + PHP-FPM (gestionado por CloudPanel) |
| **Frontend** | Inertia v2 + React 19 + Vite + Tailwind CSS v4 |
| **Colas** | `QUEUE_CONNECTION=database` (`.env.example`); el recordatorio de suscripciones usa `dispatchSync` y **no exige** worker activo |
| **Pagos** | PayPal REST (`PAYPAL_*` en `.env`) |
| **Compresión imágenes** | Intervention Image v3 + PHP GD (Imagick opcional) |
| **Compresión video** | FFmpeg del sistema (`HistoriaVideoStorageService`) |

---

## 2. Requisitos del sistema (Ubuntu)

### 2.1 Paquetes base

```bash
sudo apt update
sudo apt install -y git curl unzip
```

> **Nota:** Nginx y PHP-FPM suelen instalarse y gestionarse desde **CloudPanel**. Si el servidor ya tiene CloudPanel, no reinstales Nginx manualmente salvo que sepas lo que haces.

**Verificación**

```bash
git --version
curl --version
```

**Solución de problemas**

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `apt` muy lento o con errores 404 | Mirrors desactualizados | `sudo apt update` y revisar `/etc/apt/sources.list` |
| Sin acceso `sudo` | Usuario sin privilegios | Usar usuario con permisos o pedir acceso al administrador del VPS |

---

### 2.2 PHP 8.4 y extensiones obligatorias

Extensiones necesarias para Laravel 12 y la compresión de medios:

| Extensión | Uso |
|-----------|-----|
| `php-fpm`, `php-cli` | Servidor web y Artisan |
| `php-mysql` / `pdo_mysql` | Base de datos MySQL/MariaDB |
| `php-mbstring`, `php-xml`, `php-curl`, `php-zip` | Laravel core |
| `php-bcmath`, `php-intl` | Cálculos y localización |
| **`php-gd`** | **Obligatorio** — `WebpImageStorageService` (Intervention Image) |
| `php-imagick` | Opcional — si está cargada, el servicio la prefiere sobre GD |

**Instalación (ejemplo con repositorio Ondřej Surý)**

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y \
  php8.4-fpm php8.4-cli php8.4-mysql php8.4-mbstring php8.4-xml \
  php8.4-curl php8.4-zip php8.4-bcmath php8.4-intl php8.4-gd
```

Opcional:

```bash
sudo apt install -y php8.4-imagick
```

**Verificación**

```bash
php -v
php -m | grep -E 'gd|imagick|pdo_mysql'
php -r "var_dump(gd_info()['WebP Support'] ?? false);"
```

La última línea debe devolver `bool(true)` para que la conversión a WebP funcione.

**Solución de problemas**

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| `WebP Support => false` | GD compilado sin WebP | `sudo apt install --reinstall php8.4-gd` y reiniciar PHP-FPM |
| CloudPanel usa otra versión PHP | Vhost enlazado a PHP 8.3 u otra | En CloudPanel, asignar **PHP 8.4** al sitio |
| `pdo_mysql` no aparece | Paquete no instalado | `sudo apt install php8.4-mysql` |

---

### 2.3 FFmpeg (compresión de video en historias)

El paquete Composer `php-ffmpeg/php-ffmpeg` **no sustituye** el binario del sistema. `HistoriaVideoStorageService` ejecuta `ffmpeg` vía `Symfony\Component\Process\Process`.

```bash
sudo apt install -y ffmpeg
ffmpeg -version
which ffmpeg
which ffprobe
```

Rutas habituales en Ubuntu: `/usr/bin/ffmpeg` y `/usr/bin/ffprobe`.

**Verificación como usuario del servidor web**

```bash
sudo -u www-data ffmpeg -version
sudo -u www-data which ffmpeg
```

**Solución de problemas**

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| «FFmpeg no está instalado o no está en el PATH» | Binario ausente para `www-data` | `apt install ffmpeg` + `FFMPEG_BINARIES=/usr/bin/ffmpeg` en `.env` |
| Permiso denegado al ejecutar ffmpeg | Restricciones del sistema | Comprobar que `/usr/bin/ffmpeg` es ejecutable: `ls -l /usr/bin/ffmpeg` |

---

### 2.4 Node.js (build de assets)

Instalar **Node.js LTS** (20.x o 22.x). Ejemplo con NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Alternativa: [nvm](https://github.com/nvm-sh/nvm) para el usuario de despliegue.

**Verificación**

```bash
node -v   # v20.x o v22.x
npm -v
```

---

### 2.5 Composer

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer -V
```

---

## 3. Compresión de medios en la aplicación

La compresión ocurre **en el servidor** al crear o editar registros en el panel admin. No hay compresión en el navegador.

### 3.1 Imágenes → WebP (`WebpImageStorageService`)

| Aspecto | Detalle |
|---------|---------|
| **Módulos** | Historias y productos (imagen principal + galería) |
| **Entrada** | JPEG, PNG, JPG, WebP — validación `max:5120` (5 MB) en Form Requests |
| **Salida** | Siempre `.webp` en `storage/app/public/` |
| **Rutas típicas** | `historias/imagenes/`, `historias/galeria/`, `productos/imagenes/`, `productos/galeria/` |
| **URL pública** | `/storage/{directorio}/{uuid}.webp` |
| **Config** | `config/media.php` → clave `image` |
| **Composer** | `intervention/image` ^3.0 |
| **Servidor** | PHP **GD con WebP** (o Imagick si está disponible) |

Valores actuales en `config/media.php`:

```php
'image' => [
    'format' => 'webp',
    'max_width' => 1920,
    'max_height' => 1920,
    'webp_quality' => 82,
    'max_upload_kb' => 5120,
],
```

El servicio redimensiona manteniendo proporción (`scaleDown`) y guarda con calidad WebP configurada.

---

### 3.2 Video → MP4 comprimido (`HistoriaVideoStorageService`)

| Aspecto | Detalle |
|---------|---------|
| **Módulos** | **Solo historias** (productos no admiten video en admin) |
| **Entrada** | MP4 o MOV (`video/mp4`, `video/quicktime`) — **sin límite de tamaño en validación Laravel** |
| **Proceso** | FFmpeg transcodifica H.264 + AAC, escala ancho máx. configurable, hasta 4 intentos aumentando CRF |
| **Atajo** | MP4 ≤ 10 MB (`max_output_bytes`) se guarda sin transcodificar |
| **Salida** | `storage/app/public/historias/videos/{uuid}.mp4` → `/storage/historias/videos/...` |
| **Config** | `config/media.php` → clave `video` |
| **Variables `.env` opcionales** | `FFMPEG_BINARIES`, `FFPROBE_BINARIES` (por defecto `ffmpeg` / `ffprobe` en PATH) |

Valores actuales en `config/media.php`:

```php
'video' => [
    'max_upload_kb' => 10240,              // referencia histórica; no se valida en Form Request
    'max_output_bytes' => 10 * 1024 * 1024, // tamaño máximo del archivo generado
    'max_width' => 1280,
    'crf' => 28,
    'audio_bitrate_kbps' => 128,
    'allowed_mimetypes' => ['video/mp4', 'video/quicktime'],
    'ffmpeg_binaries' => env('FFMPEG_BINARIES', 'ffmpeg'),
    'ffprobe_binaries' => env('FFPROBE_BINARIES', 'ffprobe'),
],
```

> **Importante:** Al no validar el peso del video en la subida, los límites pránicos los imponen **PHP** (`upload_max_filesize`, `post_max_size`) y **Nginx** (`client_max_body_size`). Ver sección 4.

---

### 3.3 Tabla resumen compresión

| Tipo | Módulo | Servicio | Requisito servidor |
|------|--------|----------|-------------------|
| Imagen | Historias + Productos | `WebpImageStorageService` | PHP GD con WebP (Imagick opcional) |
| Video | Solo historias | `HistoriaVideoStorageService` | FFmpeg en PATH (o `FFMPEG_BINARIES`) |

---

## 4. Límites de subida (PHP y Nginx)

Sin validación estricta de MB en video, configura el servidor para aceptar archivos grandes y dar tiempo a la transcodificación.

### 4.1 PHP-FPM

Editar el `php.ini` del pool FPM (ruta típica en Ubuntu):

```ini
; /etc/php/8.4/fpm/php.ini  (o vhost PHP de CloudPanel)
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
```

Recargar PHP-FPM:

```bash
sudo systemctl reload php8.4-fpm
```

**Verificación**

```bash
php -i | grep -E 'upload_max_filesize|post_max_size|memory_limit'
```

En CloudPanel también puedes ajustar estos valores desde la interfaz del sitio.

### 4.2 Nginx

En el vhost del dominio (CloudPanel → Sitio → Vhost / Nginx):

```nginx
client_max_body_size 128M;
```

Recargar Nginx:

```bash
sudo systemctl reload nginx
```

### 4.3 Solución de problemas (límites)

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| Error **413 Request Entity Too Large** | `client_max_body_size` en Nginx | Subir límite en vhost y `reload nginx` |
| Upload vacío o campos perdidos | `post_max_size` < tamaño del POST | Aumentar `post_max_size` y `upload_max_filesize` |
| Script termina a mitad de transcodificación | `max_execution_time` bajo | Subir a 300 s o más en FPM |
| Imagen rechazada con mensaje de 5 MB | Validación Laravel en imagen | Comprimir imagen o subir archivo ≤ 5 MB (solo imágenes) |

---

## 5. Configuración del proyecto Laravel

### 5.1 Clonar / desplegar

Ruta en el servidor: valor del secret **`CLOUDPANEL_PROJECT_PATH`** del environment GitHub `historias-correos` (por ejemplo `/home/cloudpanel/htdocs/tu-dominio.com`).

Despliegue manual inicial:

```bash
cd /home/cloudpanel/htdocs
git clone https://github.com/Rosanyelis/sistemaCartas.git tu-dominio.com
cd tu-dominio.com
```

En producción continua, el workflow hace `git fetch`, `checkout` y `reset --hard` sobre la rama definida en `DEPLOY_BRANCH`.

---

### 5.2 Archivo `.env` de producción

Basado en `.env.example` del repositorio. **Nunca commitear `.env`.**

```dotenv
APP_NAME="Historias por Correo"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com
APP_KEY=base64:...

APP_LOCALE=es
APP_FALLBACK_LOCALE=es

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nombre_bd
DB_USERNAME=usuario_bd
DB_PASSWORD=contraseña_segura

SESSION_DRIVER=database
SESSION_LIFETIME=120

FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database

# PayPal producción
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=tu_client_id
PAYPAL_CLIENT_SECRET=tu_client_secret
PAYPAL_CURRENCY=USD

# IVA tienda (checkout y suscripciones)
TIENDA_IVA_PERCENTAGE=16

# Días antes de proximo_cobro para el correo de recordatorio
TIENDA_RENEWAL_REMINDER_DAYS=3

# Compresión de video (historias) — opcional si ffmpeg está en PATH
FFMPEG_BINARIES=/usr/bin/ffmpeg
FFPROBE_BINARIES=/usr/bin/ffprobe

VITE_APP_NAME="${APP_NAME}"
```

Configurar también **correo** (`MAIL_*`) según el proveedor SMTP que uses en producción (en `.env.example` el valor por defecto es `MAIL_MAILER=log`).

---

### 5.3 Comandos de instalación (orden correcto)

Primera instalación o despliegue manual completo:

```bash
cd /ruta/al/proyecto

composer install --no-dev --optimize-autoloader --no-interaction

cp .env.example .env
# Editar .env con valores de producción
php artisan key:generate

php artisan migrate --force

php artisan wayfinder:generate --no-interaction

npm ci
npm run build

php artisan storage:link

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Alineación con GitHub Actions** (`.github/workflows/deploy.yml`):

El workflow en `push` a `main` (o manual) ejecuta por SSH:

1. `git fetch` / `checkout` / `reset --hard` en `DEPLOY_BRANCH`
2. `composer install --prefer-dist --optimize-autoloader --no-interaction`  
   > En producción se recomienda `--no-dev` (el workflow actual no lo incluye; conviene añadirlo cuando el servidor esté estable).
3. `php artisan wayfinder:generate --no-interaction`
4. `rm -rf node_modules` → `npm install` → `npm run build`
5. `php artisan optimize:clear` → `config:cache` → `route:cache` → `view:cache`
6. `php artisan storage:link`

Las migraciones (`php artisan migrate --force`) están **comentadas** en el workflow; ejecútalas manualmente o descoméntalas cuando proceda.

**Secrets del environment `historias-correos`:**

| Secret | Uso |
|--------|-----|
| `CONTABO_HOST` | IP o hostname del VPS |
| `CONTABO_USER` | Usuario SSH |
| `CONTABO_SSH_KEY` | Clave privada PEM |
| `CONTABO_PORT` | Puerto SSH (opcional, default 22) |
| `CLOUDPANEL_PROJECT_PATH` | Ruta absoluta del proyecto |
| `DEPLOY_BRANCH` | Rama a desplegar (ej. `main`) |

---

### 5.4 Permisos

El usuario de PHP-FPM (habitualmente `www-data`) debe poder escribir en `storage` y `bootstrap/cache`, y ejecutar `ffmpeg`:

```bash
cd /ruta/al/proyecto
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
```

---

### 5.5 Storage público

```bash
php artisan storage:link
```

Crea el enlace simbólico `public/storage` → `storage/app/public`.

Los archivos comprimidos se sirven como:

- `https://tu-dominio.com/storage/historias/imagenes/{uuid}.webp`
- `https://tu-dominio.com/storage/historias/videos/{uuid}.mp4`
- `https://tu-dominio.com/storage/productos/imagenes/{uuid}.webp`

---

### 5.6 Cron (Laravel Scheduler)

El proyecto programa un comando diario en `bootstrap/app.php`:

| Comando | Frecuencia | Descripción |
|---------|------------|-------------|
| `subscriptions:send-renewal-reminders` | Diario 09:00 (timezone `config('app.timezone')`) | Recordatorios de renovación de suscripción |

Crontab del usuario que ejecuta la app (suele ser el del sitio en CloudPanel o `www-data`):

```cron
* * * * * cd /ruta/al/proyecto && php artisan schedule:run >> /dev/null 2>&1
```

**Verificación**

```bash
cd /ruta/al/proyecto
php artisan schedule:list
php artisan subscriptions:send-renewal-reminders
```

---

### 5.7 Colas (opcional)

`QUEUE_CONNECTION=database` está configurado en `.env.example`. El recordatorio de suscripciones usa `dispatchSync` desde el comando programado, por lo que **no requiere** `queue:work` para esa funcionalidad.

Si en el futuro se añaden jobs asíncronos, ejemplo de **Supervisor**:

```ini
[program:historias-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /ruta/al/proyecto/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/ruta/al/proyecto/storage/logs/queue.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start historias-queue:*
```

---

## 6. Nginx / CloudPanel

CloudPanel gestiona el vhost, PHP-FPM y certificados SSL.

**Requisitos del sitio**

| Parámetro | Valor |
|-----------|-------|
| **Document root** | `/ruta/al/proyecto/public` |
| **PHP** | 8.4 (o la versión acordada) |
| **HTTPS** | Let's Encrypt desde CloudPanel |

Bloque típico de ubicación (referencia; CloudPanel lo genera automáticamente):

```nginx
root /ruta/al/proyecto/public;
index index.php;

location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    include fastcgi_params;
}

client_max_body_size 128M;
```

**Solución de problemas**

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| 404 en todas las rutas excepto `/` | `root` no apunta a `public/` | Corregir document root en CloudPanel |
| 502 Bad Gateway | PHP-FPM caído o socket incorrecto | `sudo systemctl status php8.4-fpm` |
| Mixed content / cookies | `APP_URL` incorrecto | Ajustar `APP_URL=https://...` y `php artisan config:cache` |

---

## 7. Despliegue continuo (GitHub Actions)

Workflow: `.github/workflows/deploy.yml` — **Deploy Historias-Correos**

| Aspecto | Detalle |
|---------|---------|
| **Trigger** | `push` a `main` o ejecución manual (`workflow_dispatch`) |
| **Concurrency** | Un despliegue a la vez (`deploy-production`) |
| **Environment** | `historias-correos` (secrets de Contabo / CloudPanel) |
| **Acción** | `appleboy/ssh-action` — comandos remotos en el VPS |

Flujo remoto resumido: actualizar código → Composer → Wayfinder → npm build → cache Laravel → `storage:link`.

**Recomendación:** en el script remoto, usar `composer install --no-dev` y `npm ci` para builds reproducibles en producción.

---

## 8. Verificación post-instalación

### 8.1 Checklist de comandos

```bash
# FFmpeg como www-data
sudo -u www-data ffmpeg -version

# Soporte WebP en PHP
php -r "var_dump(gd_info()['WebP Support'] ?? false);"

# Storage escribible
sudo -u www-data touch storage/app/public/.write-test
sudo -u www-data rm storage/app/public/.write-test

# Health check Laravel
curl -I https://tu-dominio.com/up

# Cabecera del sitio
curl -I https://tu-dominio.com
```

### 8.2 Pruebas funcionales (panel admin)

1. **Historia — imagen:** crear/editar con JPG o PNG → comprobar `.webp` en `storage/app/public/historias/imagenes/`.
2. **Historia — galería:** subir imágenes → `.webp` en `storage/app/public/historias/galeria/`.
3. **Historia — video:** subir MP4 o MOV → comprobar `.mp4` en `storage/app/public/historias/videos/`.
4. **Producto — imagen:** crear/editar → `.webp` en `storage/app/public/productos/imagenes/`.
5. **Producto:** confirmar que no existe campo de video en el formulario admin.

### 8.3 Verificación de URLs

Abrir en el navegador una ruta `/storage/...` recién generada. Si devuelve 404, ejecutar `php artisan storage:link` y revisar permisos.

---

## 9. Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|----------------|----------|
| «FFmpeg no está instalado o no está en el PATH» | Binario no disponible para `www-data` | `sudo apt install ffmpeg`; definir `FFMPEG_BINARIES=/usr/bin/ffmpeg` en `.env`; `php artisan config:cache` |
| «No se pudo procesar la imagen» | GD sin soporte WebP o extensión ausente | Instalar `php8.4-gd`; verificar `gd_info()['WebP Support']`; reiniciar PHP-FPM |
| Error **413** al subir archivo | `client_max_body_size` en Nginx | Aumentar en vhost; `sudo systemctl reload nginx` |
| Upload vacío / formulario sin archivos | `post_max_size` menor que el POST | Ajustar `php.ini` FPM |
| **404** en `/storage/...` | Falta enlace simbólico | `php artisan storage:link` |
| Permiso denegado al guardar medios | Owner incorrecto en `storage/` | `sudo chown -R www-data:www-data storage bootstrap/cache` |
| Video tarda mucho o timeout | Transcodificación CPU-intensiva | Aumentar `max_execution_time`; subir recursos del VPS; videos muy grandes tardan más |
| «No se pudo comprimir el video al tamaño de salida permitido» | Salida > 10 MB tras 4 intentos | Subir video más corto o con menor resolución/bitrate de origen |
| Assets desactualizados tras deploy | Build no ejecutado | `npm ci && npm run build` en el servidor |
| Rutas TypeScript rotas en frontend | Wayfinder no generado | `php artisan wayfinder:generate --no-interaction` |
| PayPal en sandbox en producción | `PAYPAL_MODE=sandbox` | Cambiar a `PAYPAL_MODE=live` y credenciales live |
| Recordatorios no se envían | Cron del scheduler ausente | Añadir `* * * * * php artisan schedule:run` |
| Error de base de datos tras deploy | Migraciones pendientes | `php artisan migrate --force` |

---

## 10. Desarrollo local (Laragon / Windows) — breve

Referencia rápida para desarrolladores; **no sustituye** esta guía de Ubuntu.

| Tema | Laragon |
|------|---------|
| **PHP** | Activar PHP 8.4 con extensiones GD (WebP) |
| **FFmpeg** | Menú Laragon → FFmpeg → Instalar; o `FFMPEG_BINARIES=C:\laragon\bin\ffmpeg\...\ffmpeg.exe` en `.env` |
| **Base de datos** | SQLite por defecto en `.env.example` |
| **Build** | `composer install`, `npm install`, `npm run dev` o `npm run build` |
| **Storage** | `php artisan storage:link` |

En local, los MP4 pequeños (≤ 10 MB de salida configurada) pueden guardarse sin FFmpeg; videos más grandes requieren FFmpeg instalado igual que en producción.

---

## Referencias en el repositorio

| Archivo | Contenido |
|---------|-----------|
| `config/media.php` | Límites y parámetros de compresión |
| `app/Services/Media/WebpImageStorageService.php` | Conversión imágenes a WebP |
| `app/Services/Media/HistoriaVideoStorageService.php` | Transcodificación de video |
| `.env.example` | Variables de entorno base |
| `.github/workflows/deploy.yml` | Despliegue automático Contabo / CloudPanel |
| `bootstrap/app.php` | Scheduler (`subscriptions:send-renewal-reminders`) |

---

*Última revisión alineada con el código del repositorio sistemaCartas (Laravel 12, compresión WebP + FFmpeg en historias).*
