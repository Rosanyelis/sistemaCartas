# Cálculo de la siguiente fecha de suscripción (historia + `duracion_meses`)

Este documento describe **cómo implementar** el cálculo de “cuándo tocaría la siguiente” entrega o cobro, usando la duración en meses de la historia y el estado actual de la suscripción del usuario.

## Contexto en el proyecto

- **`historias.duracion_meses`**: entero que indica cuántos meses dura el ciclo total contratado (ver migración `database/migrations/2026_03_30_201937_create_historias_table.php`).
- **`suscripciones`**: `fecha_adquisicion`, `proximo_cobro`, `fecha_finalizacion`, `estado`, `tipo`, `cantidad`, relación con `historia` y `user` (ver `database/migrations/2026_03_30_202120_create_suscripciones_table.php` y `app/Models/Suscripcion.php`).
- **`entregas`**: entregas numeradas por historia (`historia_id`, `numero_entrega`, …) — útil si la “siguiente” es una **entrega** y no solo un cobro.

## Principio de diseño

1. **Regla de dominio en el modelo (o servicio dedicado)**, no dispersa en controladores ni en el front.
2. **Fecha de referencia** para “ahora”: normalmente `Carbon::now()` en la zona horaria de la app (`config('app.timezone')`).
3. **Ancla del calendario**: `fecha_adquisicion` (inicio del contrato).
4. **Fin del contrato**: `fecha_adquisicion` + `duracion_meses` meses (ver sección de Carbon más abajo).

## Recomendación: snapshot en `suscripciones`

Si `historia.duracion_meses` puede cambiar después de vender suscripciones, los cálculos históricos se invalidan.

**Acción recomendada:** al crear la suscripción (pago confirmado, alta manual, etc.), guardar en la fila de `suscripciones`:

| Campo sugerido | Uso |
|----------------|-----|
| `duracion_meses_contratada` | Copia de `historia.duracion_meses` al momento de la compra |
| `periodicidad_meses` (opcional) | Ej. `1` mensual, `3` trimestral; por defecto `1` si solo existe “mensual” |

Así el cálculo no depende de ediciones futuras de la historia.

## Algoritmo base (cobro / hito mensual)

Entrada: `inicio = fecha_adquisicion`, `duracion = duracion_meses_contratada` (o `historia.duracion_meses` si aún no migras snapshot), `hoy = now()->startOfDay()`.

1. `fin = inicio->copy()->addMonthsNoOverflow(duracion)`  
   - Usar **`addMonthsNoOverflow`** para evitar saltos raros (ej. 31 ene → 28/29 feb).
2. Si `hoy >= fin` → **no hay siguiente** (`null`); marcar suscripción como finalizada o inactiva según reglas de negocio.
3. Calcular el **próximo hito** como el primer día de cobro/entrega **estrictamente posterior** a `hoy` y **≤ fin**:
   - Opción simple con bucle (clara y testeable): partir de `cursor = inicio`, mientras `cursor <= hoy`, `cursor->addMonthNoOverflow()`; luego `siguiente = cursor` si `cursor <= fin`, si no `null`.
   - Opción analítica: `mesesTranscurridos` entre `inicio` y `hoy` y sumar meses; cuidar bordes de fin de mes y comparación con `fin`.

**Salida:** `Carbon|null` = próxima fecha; opcionalmente también `int` = “número de ciclo” (1-based) para enlazar con `entregas.numero_entrega`.

## Dónde colocar el código

| Ubicación | Rol |
|-----------|-----|
| `app/Models/Suscripcion.php` | Métodos de instancia: `calcularProximaFecha(?Carbon $referencia = null): ?Carbon`, `calcularFechaFinContrato(): Carbon`, etc. |
| `App\Services\Suscripciones\SuscripcionScheduler` (opcional) | Si crece la lógica (PayPal, reintentos, entregas, notificaciones). |
| Comando Artisan + `schedule()` | Recalcular `proximo_cobro` masivamente o marcar vencidas una vez al día. |
| Listener tras captura de pago / alta de suscripción | Inicializar `proximo_cobro`, `fecha_finalizacion` y snapshot. |

## Integración con `entregas`

Si “siguiente” = **siguiente entrega**:

- Definir si `numero_entrega` 1 coincide con `fecha_adquisicion` o con el primer mes siguiente.
- Mapear `k` = índice del ciclo → `Entrega` con `numero_entrega = k` y fecha planificada coherente con el mismo calendario.

## Panel usuario / admin

- En listados (ej. `User\SuscripcionController` cuando deje de ser mock), exponer `proximo_cobro_calculado` o persistir `proximo_cobro` actualizado por el job.
- Mostrar “—” o “Finalizada” si no hay siguiente.

## Pruebas (Pest)

Casos mínimos sugeridos:

- Inicio 2026-01-31, duración 1 mes, hoy 2026-01-15 → siguiente dentro del contrato.
- Inicio 2026-01-31, duración 1 mes, hoy 2026-02-15 → sin siguiente si ya pasó `fin`.
- Cambio de `timezone` no rompe comparaciones si siempre normalizas a `startOfDay()` en la misma TZ.

## Resumen de acciones concretas

1. Migración: añadir `duracion_meses_contratada` (y `periodicidad_meses` si aplica) a `suscripciones`.
2. Al crear suscripción: copiar duración desde `historia` al snapshot.
3. Implementar cálculo en `Suscripcion` (o servicio) con `Carbon` y `addMonthsNoOverflow`.
4. Comando diario opcional: sincronizar `proximo_cobro` / estados.
5. Tests Pest para bordes de calendario y contratos vencidos.

---

*Documento orientado a implementación; ajustar nombres de columnas y reglas de negocio (`tipo`, `cantidad`) cuando estén cerradas en producto.*
