# ⚔️ Old-School Essentials (OSE) — Hoja de Personaje Universal Automatizada

Una aplicación web progresiva y modular diseñada para la creación, gestión y automatización de personajes para el juego de rol **Old-School Essentials (OSE)** bajo las reglas oficiales del SRD.

---

## 📋 Tabla de Contenidos
1. [Características Principales](#-características-principales)
2. [Asistente de Creación de Personaje (Wizard)](#-asistente-de-creación-de-personaje-wizard)
3. [Automatización de Reglas y Cálculo de Ficha](#-automatización-de-reglas-y-cálculo-de-ficha)
4. [Sistema de Combate y Efectos Temporales](#-sistema-de-combate-y-efectos-temporales)
5. [Parser Inteligente de Inventario y Objetos Mágicos](#-parser-inteligente-de-inventario-y-objetos-mágicos)
6. [Grimorio y Sistema de Magia](#-grimorio-y-sistema-de-magia)
7. [Motor de Tiradas y Dados Vectoriales](#-motor-de-tiradas-y-dados-vectoriales)
8. [Impresión Calibrada (A4 / PDF) y Persistencia](#-impresión-calibrada-a4--pdf-y-persistencia)
9. [Estructura Técnica y Archivos](#-estructura-técnica-y-archivos)

---

## 🌟 Características Principales

- **Fiel a las reglas oficiales OSE (SRD)**: Tablas de salvación, combate, progresión de PX, habilidades de clase, expulsión de muertos y sobrecarga.
- **Doble modo de inicio**:
  - *Modo Guiado (Paso a paso)* para principiantes y partidas rápidas.
  - *Modo Directo* para jugadores avanzados con edición libre.
- **Motor de dados interactivo**: Animaciones de dados poliédricos (d4, d6, d8, d10, d20, d100) vectoriales y desglose didáctico de cada tirada.
- **Parser de equipo mágico**: Detección automática de bonificadores a características, CA, TS, Ataque, Daño, PG y PX a partir de descripciones escritas en el inventario.
- **Calibración exacta para impresión/PDF**: Hoja A4 a dos columnas con recuadro de retrato y maquetación idéntica a la ficha clásica de OSE.
- **Persistencia total**: Autoguardado en `localStorage`, importación y exportación de fichas en formato `.json`.

---

## 🧙 Asistente de Creación de Personaje (Wizard)

El asistente guía al jugador a través de las etapas clásicas de creación:

1. **Características**:
   - Generación automática mediante tirada de **3d6** por característica o introducción manual (rango 3-18).
2. **Clase y Alineamiento**:
   - Selección de las 7 clases canónicas: *Guerrero, Clérigo, Enano, Elfo, Mediano, Ladrón y Mago*.
   - Validación en tiempo real de los prerrequisitos de características (ej. Enano requiere CON ≥ 9, Elfo requiere INT ≥ 9, Mediano requiere CON ≥ 9 y DES ≥ 9).
3. **Idiomas y Alfabetización**:
   - Determinación del nivel de alfabetización según la Inteligencia (*Analfabeto, Educación Básica, Instruido*).
   - Asignación automática de idiomas nativos según raza, clase y alineamiento.
   - Selección dinámica de idiomas adicionales permitidos con posibilidad de marcar/desmarcar con un solo clic.
4. **Puntos de Golpe (DG)**:
   - Identificación del Dado de Golpe de la clase (1d4, 1d6 o 1d8).
   - Botón interactivo de tirada y chip de Modificador de Constitución con indicación de color semántico (verde: positivo, rojo: negativo, gris: neutro).
   - Previsualización del total de PG idéntica a la casilla de la hoja principal.
5. **Oro Inicial**:
   - Tirada clásica de **3d6 × 10 mo** con asignación directa al tesoro.
6. **Tienda de Creación**:
   - Catálogo de equipo oficial OSE con costes, pesos, valores de CA (armaduras/escudos) y fórmulas de daño (armas).
   - Compra con descuento automático del monedero y confirmación visual instantánea.

---

## ⚙️ Automatización de Reglas y Cálculo de Ficha

- **Soporte multiclase y niveles**: Progresión de niveles del 1 al máximo permitido por clase (Nv 14 para humanos, 12 para Enanos, 10 para Elfos y 8 para Medianos).
- **Subida y bajada de nivel interactiva**:
  - Cálculo de ganancia o pérdida de PG guardando el historial de tiradas por nivel.
  - Asignación automática de los PG actuales al máximo al subir de nivel o tirar dados de golpe.
- **Modificadores universales**: Aplicación automática de los bonos y penalizadores de características (FUE, INT, SAB, DES, CON, CAR) de -3 a +3 en todas las secciones correspondientes.
- **Sistemas de CA dual**:
  - Soporte conmutable entre **CA Ascendente (CAA)** y **CA Descendente (CAD)**.
  - Selector dinámico de armadura equipada y checkbox para escudo.
  - Bloqueo y adaptación de armaduras según la clase (Magos sin armadura, Ladrones restringidos a cuero).
- **Sobrecarga y Movimiento**:
  - Conversión del tesoro en peso (10 monedas = 1 mo de peso).
  - Cálculo de franjas de velocidad: *Viaje/Diario (millas)*, *Exploración (pies/turno)* y *Encuentro (pies/asalto)* según la carga total (0-400, 401-600, 601-800, 801-1600 mo).
- **Habilidades de Ladrón**: Porcentajes oficiales automáticos según nivel (AC, ET, RB, MS, ES, EM, ER).
- **Expulsión de Muertos vivientes**: Matriz de Clérigo con resolución automática por tipo de no-muerto (*Esqueletos a Vampiros*) con estados D (Destruido), E (Expulsado) o tirada numérica.
- **Habilidades de Aventura**: Pruebas automáticas sobre 1d6 (*Recolectar, Encontrar Trampas, Cazar, Escuchar Puerta, Abrir Puerta con bono de FUE, Puertas Secretas*).

---

## ⚔️ Sistema de Combate y Efectos Temporales

- **Matriz de Impacto y GAC0 / BA**: Cálculo automático de la Base de Ataque (BA) y la tabla de matrices CAD de 9 a 0 según la clase y el nivel.
- **Ataques Melé y Proyectiles**:
  - Detección automática de armas en el inventario con sus fórmulas de daño (*1d4, 1d6, 1d8, 1d10*).
  - Aplicación de bono de FUE a melé y bono de DES (+1 racial a Medianos) a proyectiles.
- **Apuñalamiento de Ladrón (+4)**: Tirada especial de ataque a traición que aplica el multiplicador de daño correspondiente por nivel (x2, x3, x4, x5).
- **Gestión de Armas Arrojadas**:
  - Seguimiento de dagas, hachas de mano, lanzas y jabalinas lanzadas.
  - Banner en la ficha de combate que permite **Recoger** o **Descartar** las armas que quedaron en el suelo.
- **Gestor de Efectos Temporales**:
  - Efectos predefinidos: *Bendición, Infortunio, Protección contra el mal, Escudo, Celeridad*.
  - Creación de efectos personalizados que suman o restan a CA, Ataque, Daño y Tiradas de Salvación en tiempo real.
  - Conjuro *Golpear*: Encantamiento de arma melé (+1d6 daño adicional y consideración de arma mágica).

---

## 🎒 Parser Inteligente de Inventario y Objetos Mágicos

El sistema analiza el texto escrito en las filas de inventario para detectar propiedades mágicas:

- **Interruptor de Equipado/Mochila**: Cada accesorio mágico dispone de un interruptor para activarlo (equipado) o desactivarlo (guardado en la mochila).
- **Detección de bonos**:
  - Bonos a características: `Anillo FUE +4`, `Cinto de Fuerza +2`, `Guanteletes de Destreza +1`.
  - Bonos directos a combate: `+1 a la CA`, `+2 a las TS`, `+1 al ataque`, `+2 al daño`.
  - Multiplicadores o bonos de vida: `x2 PG`, `+5 PG`.
  - Modificadores de experiencia: `+10% PX`.
- **Desglose didáctico en tiradas**: Al realizar tiradas de ataque o de característica, el resultado desglosa de forma visual la puntuación base y el bono aportado por el objeto.

---

## 📖 Grimorio y Sistema de Magia

- **Espacios de Conjuro**: Gestión de espacios disponibles por nivel según las tablas de progresión de Clérigo, Mago y Elfo.
- **Base de datos completa (SRD OSE)**:
  - Base de datos integrada con todos los conjuros arcanos (niveles 1 al 6) y divinos (niveles 1 al 5).
  - Fórmulas de tirada, alcances, duraciones y descripciones completas en castellano.
- **Conjuros Reversibles (↔)**: Conmutador directo para cambiar entre la versión normal y la reversible (ej. *Curar heridas leves ↔ Causar heridas leves*, *Luz ↔ Oscuridad*).
- **Lanzamiento interactivo**: El botón de tirar descuenta el espacio de conjuro, lanza los dados de daño/curación o aplica los efectos temporales correspondientes.

---

## 🎲 Motor de Tiradas y Dados Vectoriales

- **Animación física 3D**: Dados vectoriales con efecto de volteo y giro (*tumbling animation*) en pantalla completa.
- **Dados soportados**: `d4`, `d6`, `d8`, `d10`, `d20` y `d100` (percentil).
- **Evaluación contextual**:
  - **Pruebas de Característica**: Éxito si `1d20 ≤ Característica efectiva`.
  - **Tiradas de Salvación**: Éxito si `1d20 + Modificadores ≥ Valor de TS`.
  - **Ataques**: Determinación de impacto en CAA y CAD, con detección de **Crítico (20 natural)** y **Pifia (1 natural)** y tirada simultánea de daño.
  - **Habilidades de Ladrón**: Resolución percentil `1d100 ≤ % de habilidad`.

---

## 🖨️ Impresión Calibrada (A4 / PDF) y Persistencia

- **Disposición idéntica a la hoja original OSE (Página 1)**:
  - **Columna Izquierda**: *Características*, *Combate*, *Rasgos de Clase* e *Idiomas*.
  - **Columna Derecha**: *Recuadro de Retrato* (con la leyenda *"Retrato del personaje, símbolo o descripción"*), *Tiradas de Salvación*, *Movimiento* y *Habilidades de Aventura*.
  - Ambas columnas calibradas para quedar perfectamente niveladas y alineadas en el borde inferior.
- **Página 2**: Magia Arcana/Divina, Sobrecarga, Tesoro, Inventario y Registro de Experiencia.
- **Exportación en JSON / PDF / Impresión directa**:
  - Modal de exportación con descarga directa del archivo `.json` para copia de seguridad.
  - Importador de personajes desde archivo local.
  - Ocultación automática de elementos interactivos y botones durante la impresión.

---

## 📂 Estructura Técnica y Archivos

```plaintext
├── index.html       # Estructura semántica, modal overlays, wizard y maquetación de la ficha
├── styles.css       # Sistema de diseño, fuentes (Oswald, Noto Serif), responsividad y reglas @media print
├── spells_data.js   # Base de datos completa de conjuros de Clérigo y Mago del SRD en español
├── app.js           # Lógica de autocalculado, asistente, combate, parser de inventario y motor de dados
├── manifest.json    # Configuración para soporte PWA (Progressive Web App)
└── icon-192.png     # Icono de la aplicación
```

---

## 📜 Créditos y Licencia

- **Old-School Essentials (OSE)** es una marca registrada de **Necrotic Gnome**.
- Basado en el **System Reference Document (SRD)** de Old-School Essentials bajo licencia abierta (OGL / CC).
- Hoja de Personaje Web Universal creada para la comunidad hispanohablante de juegos de rol de la vieja escuela (OSR).
