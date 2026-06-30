# Agentes

Instrucciones para agentes de IA que trabajan en este repositorio.

## Convención de Commits

Cada mensaje de commit sigue [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```text
<tipo>: Título

Descripción breve.

- Acción concreta 1.
- Acción concreta n.
```

### Tipos

| Tipo    | Cuándo usarlo                                 |
| ------- | --------------------------------------------- |
| `feat`  | Nuevas funcionalidades o capacidades          |
| `fix`   | Corrección de bugs                            |
| `chore` | Herramientas, configuración, dependencias, CI |
| `task`  | Cambios a funcionalidad existente             |
| `spike` | Investigación o exploración                   |

### Reglas

- Línea de asunto: modo imperativo, minúsculas, sin punto final, máximo 72 caracteres
- Cuerpo: descripción breve seguida de puntos listando cada cambio concreto
- Sin líneas `Co-Authored-By` ni atribución de IA

## Contrato de Herramientas

El campo `engines` en `package.json` es la **única** fuente de verdad para runtimes y gestores de paquetes permitidos. Cualquier herramienta no declarada allí está prohibida. Esto aplica a todo agente, sub-agente y orquestador. Sin excepciones.

---

## Prohibiciones para Agentes

Estas reglas son **mecánicas**. No son negociables ni interpretables. Se aplican antes de cualquier acción.

### PROHIB-TOOLS

- **PROHIBIDO:** `gh` (GitHub CLI) — no `gh auth`, `gh pr`, `gh api`. Usar `curl`, `WebFetch` o Playwright.
- **PROHIBIDO:** `npm`, `npx`, `yarn` — solo `pnpm` (declarado en `engines`).
- **PROHIBIDO:** `brew install`, `apt install` — no instalaciones a nivel de sistema.
- **PROHIBIDO:** `cat`, `grep`, `find`, `sed`, `ls` — usar `bat`, `rg`, `fd`, `sd`, `eza`.
- **PROHIBIDO:** creación manual de archivos cuando existe un CLI oficial — usar `pnpm dlx` + scaffolding.

### PROHIB-PATTERNS

- **PROHIBIDO:** valores CSS hardcodeados — siempre `var(--vh-*)`.
- **PROHIBIDO:** imports estáticos de bibliotecas con carga diferida.

**Violación → kill inmediato. No se otorga segundo intento sobre la misma violación.**

---

## Protocolo Anti-Racionalización

Las reglas son **mecánicas**, no consultivas. No son sugerencias que el agente pondera — son restricciones que ejecuta sin análisis de conveniencia.

### Lo que un agente NO puede hacer

- Juzgar si una regla aplica en su caso particular.
- Inventar excepciones no documentadas.
- Reinterpretar la intención de la regla para justificar incumplimiento.
- Diferir el cumplimiento a "cuando tenga más contexto".
- Consultar al usuario si puede saltarse una regla.

### Test de Racionalización

Antes de cualquier acción que parezca contradecir una regla:

1. Citar el texto exacto de la regla que supuestamente no aplica.
2. Si no existe ese texto → la acción no está autorizada.
3. Si el agente está escribiendo internamente "esto no amerita seguir la regla" → **detener. Ejecutar la regla.**

### Reglas de Interpretación

- **Ambigüedad → más cumplimiento**, no menos.
- La escala afecta la profundidad de la aplicación, no su presencia.
- El silencio del documento sobre un caso específico = protocolo por defecto.
- El agente no puede auto-eximirse de ninguna regla de este documento.

### Carga de la Prueba

La carga de la prueba está sobre el **agente**, no sobre el documento. Si el agente no puede citar el texto exacto que autoriza una excepción, la excepción no existe.

---

## Política de Asignación de Modelos

| Nivel       | Modelo   | Usar cuando                                                          |
| ----------- | -------- | -------------------------------------------------------------------- |
| Búsqueda    | `haiku`  | Grep, leer docs, lint checks, formato, lecturas exploratorias        |
| Implementar | `sonnet` | Escribir código, tests, revisiones, verificar quality gates          |
| Arquitecto  | `opus`   | Decisiones de diseño, resolución de conflictos, síntesis multifuente |

> Con 6+ agentes, la disciplina de niveles multiplica los ahorros. **Nunca quemar `opus` en un grep.**

---

## Protocolo de Orquestación

### Principio de Orquestador Puro

El orquestador **coordina**, no ejecuta. Mantiene un hilo de conversación delgado y delega todo trabajo real a sub-agentes.

### Tabla de Decisión: Inline vs. Delegar

| Acción                                      | Inline | Delegar                    |
| ------------------------------------------- | ------ | -------------------------- |
| Leer para decidir (1–3 archivos)            | ✓      | —                          |
| Leer para explorar (4+ archivos)            | —      | ✓                          |
| Leer como preparación para escribir         | —      | ✓ (junto con la escritura) |
| Escribir cualquier archivo                  | —      | ✓                          |
| Actualizar Progress Tracker                 | ✓      | —                          |
| Bash de solo lectura (`git status`, `eza`)  | ✓      | —                          |
| Bash de ejecución (test, build)             | —      | ✓                          |
| Decisiones de arquitectura (sin artefactos) | ✓      | —                          |
| Presentar resultados al usuario (MIM)       | ✓      | —                          |

### Protocolo de Actualización de Estado

Después de cada delegación exitosa, el orquestador actualiza el Progress Tracker en línea:

```text
[x] Tarea completada — resumen de una línea del resultado
[ ] Siguiente tarea pendiente
```

### Circuit Breaker

Si **3 delegaciones consecutivas** fallan o retornan resultados inconsistentes:

1. Detener la secuencia.
2. Reportar el punto de falla al usuario con evidencia.
3. Esperar instrucciones antes de continuar.

No intentar "recuperar" automáticamente más de dos veces en la misma tarea.

### Post-Delegation Checkpoint (PDC)

Después de cada delegación, verificar:

1. ¿El resultado es coherente con la tarea asignada?
2. ¿Hay artefactos prometidos que no se entregaron?
3. ¿El sub-agente reportó algún bloqueador no resuelto?

Si alguna respuesta es "sí" → escalar al usuario antes de continuar.

### Protocolo de Rechazo

Cuando el orquestador recibe un resultado inaceptable de un sub-agente:

1. Documentar qué era inaceptable y por qué.
2. Re-delegar con contexto adicional (máximo 1 re-intento).
3. Si el segundo intento también falla → escalar al usuario con evidencia de ambos intentos.

### MIM Checkpoints

El humano es el nodo de decisión final (MIM). El orquestador hace pausa obligatoria en:

- Cualquier cambio que afecte `package.json` o dependencias.
- Cualquier PR o merge propuesto.
- Cualquier decisión que no tenga precedente en este documento.
- Resultado de verificación con fallos CRITICAL.

### Evidencia como Progreso

El orquestador **no reporta intenciones como logros**. Solo reporta como completado lo que tiene evidencia verificable: output de comandos, artefactos creados, quality gates pasados.

---

## Modelo de Ramas

### Flujo

```text
task/{name} → feature/{epic} → {integration-branch} → PR to master
```

### Ramas de Tarea

- Formato: `task/{nombre-descriptivo}`
- Scope: una tarea del plan de implementación.
- Vida útil: del inicio al merge en la rama de épica o integración.
- Nombre debe coincidir con el archivo de handoff correspondiente.

### Ramas de Épica

- Formato: `feature/{nombre-epica}`
- Agrupa múltiples ramas de tarea relacionadas.
- Se mergea a master mediante PR revisado.

### Sin Commits Directos a Master

No se permiten commits directos a `master` bajo ninguna circunstancia.

### Sin Excepciones

No existe "urgencia suficiente" para saltarse el flujo de ramas. Si el fix es urgente, se crea una rama `task/hotfix-{descripción}` y se abre PR inmediatamente.

### Handoff Coupling

El nombre de la rama de tarea **debe coincidir** con el nombre del archivo de handoff:

- Rama: `task/auth-module`
- Handoff: `.tmp-auth-module-handoff.md`

Esta regla facilita la trazabilidad y el cierre limpio de tareas.

---

## Marco de Quality Gates

### Gates Mínimos para Toda Tarea

| Gate                  | Comando                 | Tipo |
| --------------------- | ----------------------- | ---- |
| Handoff existe        | `eza .tmp-*-handoff.md` | EXE  |
| Lint limpio           | `pnpm test:static`      | EXE  |
| Tipos limpios         | `pnpm test:types`       | EXE  |
| Sin efectos laterales | `git diff --stat`       | EXE  |

**EXE** = ejecutado por el agente con salida verificable.
**MAN** = verificado manualmente por el humano.

### Regla de Secuencia

Los gates se ejecutan **en orden**. No se pasa al siguiente gate si el anterior falla. No existe "paralelizar los gates para ahorrar tiempo".

### Política de Incident Tags

Cada nueva regla añadida a este documento debe incluir un tag de incidente que justifique su existencia:

```text
<!-- INC-{número}: {descripción breve del incidente que motivó esta regla} -->
```

Las reglas importadas de virgenherrera ya tienen su historial de incidentes en ese repositorio. Las reglas **nuevas** añadidas a este documento deben documentar el incidente real que las motivó. Sin incidente real → sin nueva regla.

---

## Handoff

### Gate de Pre-Ejecución (Obligatorio)

Antes de comenzar cualquier tarea de implementación, el agente debe verificar que existe un archivo de handoff válido. Si no existe → detener y solicitar al usuario que lo proporcione o autorice su creación.

```bash
eza .tmp-*-handoff.md
```

### Modelo de Autorización

El agente opera en dos modos:

- **Modo lectura:** puede leer archivos, buscar patrones, analizar código. Sin autorización adicional.
- **Modo ejecución:** puede escribir archivos, ejecutar comandos, crear ramas. Requiere handoff válido.

### Regla de Activación

- **Camino A (responder):** el usuario hace una pregunta → el agente responde en modo lectura. No crea archivos, no ejecuta comandos.
- **Camino B (actuar):** el usuario solicita implementación → el agente verifica handoff → ejecuta en modo ejecución.

La distinción es **semántica**: "¿cómo funciona X?" es Camino A. "Implementa X" es Camino B.

### Estructura Mínima Viable de Handoff

Todo archivo de handoff debe contener exactamente estas 7 secciones:

```markdown
# Handoff: {nombre de la tarea}

## Objetivo

Una oración que describe el resultado esperado.

## Alcance

Lista de archivos o módulos que el agente tiene autorización de modificar.

## Fuera de Alcance

Lista explícita de lo que el agente NO debe tocar.

## Criterios de Aceptación

Lista verificable de condiciones que deben cumplirse para considerar la tarea completa.

## Quality Gates

Lista de comandos y checks obligatorios antes de marcar como hecho.

## Notas de Implementación

Contexto técnico relevante, decisiones previas, advertencias.

## Progress Tracker

- [ ] Paso 1
- [ ] Paso 2
- [ ] Paso n
```

### Obligación de Progress Tracking

El agente actualiza el Progress Tracker **después de cada paso completado**, no al final. El historial de progreso es evidencia de ejecución, no un formalismo.

### Self-Check de Quality Gates

El agente ejecuta los quality gates del handoff **antes de reportar la tarea como completada**. Reportar "listo" sin haber ejecutado los gates es una violación del protocolo.

### Handoffs Portátiles

- Handoffs activos (en ejecución): `.tmp-{nombre}-handoff.md`
- Handoffs completados o archivados: `.handoff-{nombre}.md`

Los archivos `.tmp-*` son ignorados por git por convención. Los archivos `.handoff-*` pueden commitearse si el equipo decide mantener un registro histórico.

---

## Compact Rules for Sub-Agent Injection

The following blocks are pre-digested for injection into sub-agent prompts. The orchestrator selects matching blocks by context and injects them verbatim.

### NEST-TOOLS

```text
FORBIDDEN tools: cat, grep, find, sed, ls → use bat, rg, fd, sd, eza.
FORBIDDEN package managers: npm, npx, yarn → only pnpm (declared in engines).
FORBIDDEN system installs: brew install, apt install.
FORBIDDEN GitHub CLI: gh auth, gh pr, gh api → use curl, WebFetch, or Playwright.
FORBIDDEN manual file creation when an official CLI exists → use pnpm dlx + scaffolding.
```

### NEST-CODE

```text
- Commits follow Conventional Commits (feat/fix/chore/task/spike).
- No Co-Authored-By or AI attribution lines in commits.
- Subject line: imperative, lowercase, no period, max 72 chars.
- No hardcoded CSS values; always use var(--vh-*).
- No direct commits to master; always use task/{name} branches.
```

### NEST-ANTI-DRIFT

```text
Rules are MECHANICAL. You cannot:
- Judge if a rule applies to your case.
- Invent exceptions not in this document.
- Reinterpret intent to justify non-compliance.
- Defer compliance pending more context.
If you cannot cite the exact text authorizing an exception → the exception does not exist.
Ambiguity → more compliance, not less.
```
