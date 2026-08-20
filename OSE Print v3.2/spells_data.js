const SPELLS_CLERIGO = {
  1: [
    {
      n: "Curar heridas leves ↔ Causar heridas leves",
      a: "El lanzador o la criatura tocada",
      d: "Instantáneo",
      f: "1d6+1 PG",
      x: "Este hechizo tiene dos usos:\n\n1. Curar a un sujeto vivo: Recupera 1d6+1 puntos de golpe. No puede superarse el máximo de puntos de golpe del sujeto.\n2. Curar parálisis: Niega cualquier efecto paralizante.\n\nReversible: Causar heridas leves\nCausa 1d6+1 puntos de daño a la criatura tocada. Durante el combate, debe realizarse una tirada de ataque cuerpo a cuerpo."
    },
    {
      n: "Detectar el mal",
      a: "120’",
      d: "6 turnos",
      f: null,
      x: "Los objetos encantados con intención maligna o criaturas malvadas brillan mágicamente.\n\n- Intención: Este hechizo no permite leer pensamientos, solo otorga una idea general de intención maligna.\n- Definición de mal: El Árbitro debe decidir qué considera «maligno». Algunas cosas son potencialmente peligrosas, como las trampas, pero no «malignas»."
    },
    {
      n: "Detectar magia",
      a: "60’",
      d: "2 turnos",
      f: null,
      x: "Cualquier objeto, área o criatura encantada brilla. Se muestran tanto los encantamientos permanentes como temporales."
    },
    {
      n: "Luz ↔ Oscuridad",
      a: "120’",
      d: "12 turnos",
      f: null,
      x: "Este hechizo tiene tres usos:\n\n1. Invocar luz: Tiene un radio de 15’. La luz es lo suficientemente poderosa para leer, pero no tanto como la luz diurna. Este hechizo puede lanzarse sobre un objeto, lo que hará que la luz se mueva con este.\n2. Cegar a una criatura: Si el hechizo se lanza sobre sus ojos, la criatura es cegada durante su duración si falla una tirada de salvación contra hechizos. Una criatura cegada no puede atacar.\n3. Cancelar oscuridad: Luz puede cancelar el hechizo Oscuridad (ver a continuación).\n\nReversible: Oscuridad\nCrea un radio de 15’ de oscuridad mágica que impide la visión normal (pero no la infravisión). Al igual que luz, se puede usar para cegar a una criatura o para cancelar el hechizo luz."
    },
    {
      n: "Protección contra el mal",
      a: "El lanzador",
      d: "12 turnos",
      f: null,
      autoEffect: { name: "Prot. contra el mal", ac: 1, atk: 0, dmg: 0, save: 1, type: "buff" },
      x: "Este hechizo protege al lanzador de ataques de criaturas de otro alineamiento de la siguiente manera:\n\n- Bonificaciones: El lanzador gana una bonificación de +1 a sus tiradas de salvación contra ataques o habilidades de las criaturas afectadas.\n- Ataques de las criaturas afectadas: Sufren una penalización de -1 contra el lanzador.\n- Criaturas encantadas, construidas o invocadas: Este hechizo impide que estas criaturas ataquen cuerpo a cuerpo al lanzador, aunque pueden realizar ataques a distancia. Si el lanzador ataca cuerpo a cuerpo a esta criatura, la protección se rompe (aunque el lanzador sigue recibiendo las bonificaciones)."
    },
    {
      n: "Purificar agua y comida",
      a: "10’",
      d: "Permanente",
      f: null,
      x: "Este hechizo hace que la comida y agua podrida, venenosa o contaminada sea pura y adecuada para comer y beber. Puede usarse sobre los siguientes objetos:\n\n- Bebida: 6 cuartos de galón.\n- Raciones: Una ración (de hierro o estándar).\n- Comida sin conservar: La cantidad suficiente para 12 seres de tamaño humano."
    },
    {
      n: "Quitar el miedo ↔ Causar miedo",
      a: "El lanzador o la criatura tocada",
      d: "2 turnos",
      f: null,
      x: "La criatura tocada se calma y es libre de todo miedo. Se puede quitar el miedo de naturaleza mágica, pero esto requiere que el sujeto realice una tirada de salvación contra hechizos. Esta tirada está modificada en +1 por cada nivel del lanzador.\n\nReversible: Causar miedo\nUn objetivo a 120’ huye durante 2 turnos a menos que realice una tirada de salvación contra hechizos."
    },
    {
      n: "Resistir frío",
      a: "30’",
      d: "6 turnos",
      f: null,
      x: "Todas las criaturas dentro del alcance están protegidas contra el frío de la siguiente manera:\n\n- Frío normal: No se ven afectados por temperaturas gélidas no mágicas.\n- Bonificación a la salvación: Obtienen +2 a todas las tiradas de salvación contra hechizos o ataques de aliento de frío.\n- Daño de frío: Se reduce en 1 punto por cada dado lanzado (cada dado causa un mínimo de 1 punto de daño)."
    }
  ],
  2: [
    {
      n: "Bendición ↔ Infortunio",
      a: "60’",
      d: "6 turnos",
      f: null,
      autoEffect: { name: "Bendición", ac: 0, atk: 1, dmg: 1, save: 0, type: "buff" },
      x: "Se puede usar en dos situaciones:\n\n- Combate: Los aliados en un área de 20’ que no estén cuerpo a cuerpo obtienen un +1 a las tiradas de ataque y daño y +1 a su moral.\n- Ritual: Se puede lanzar bendición como parte de un ritual de purificación o consagración, a discreción del Árbitro.\n\nReversible: Infortunio\nPenaliza en -1 los chequeos de moral, tiradas de ataque y daño de los enemigos en un área de 20’. Se puede realizar una tirada de salvación contra hechizos para resistir los efectos de infortunio."
    },
    {
      n: "Conocer alineamiento",
      a: "10’",
      d: "1 ronda",
      f: null,
      x: "El lanzador sabe de inmediato el alineamiento de un personaje, monstruo, objeto o lugar dentro del alcance. La mayoría de los objetos y lugares no tienen alineamiento, pero los objetos mágicos y lugares sagrados pueden tenerlo."
    },
    {
      n: "Encantar serpiente",
      a: "60’",
      d: "1d4+1 rondas o turnos",
      f: "1d4+1",
      x: "Una o más serpientes se vuelven dóciles, moviéndose de un lado a otro, pero sin atacar.\n\n- DG afectados: El hechizo afecta a serpientes con un total de Dados de Golpe que no supere al nivel del lanzador. Por ejemplo, un clérigo de nivel 7 puede afectar a un total de 7 DG de serpientes: siete serpientes de 1 DG, dos serpientes de 3 DG y una de 1 DG, o cualquier otra combinación.\n- Duración: Si se lanza contra serpientes que ya están atacando, el hechizo dura 1d4+1 rondas. Por lo demás, dura 1d4+1 turnos."
    },
    {
      n: "Encontrar trampas",
      a: "30’",
      d: "2 turnos",
      f: null,
      x: "Las trampas dentro del alcance brillan con una mágica luz azul.\n\n- Trampas mágicas y mecánicas: Ambas son detectadas.\n- Incertidumbre: El hechizo no permite conocer la naturaleza de la trampa o cómo desactivarla."
    },
    {
      n: "Hablar con los animales",
      a: "30’",
      d: "6 turnos",
      f: null,
      x: "El lanzador puede comunicarse con un tipo de animal que esté dentro del alcance cuando se lanza el hechizo.\n\n- Tipo de animal: Se puede hacer objetivo animales o versiones gigantes de animales comunes.\n- Preguntas: El lanzador puede hacer preguntas y recibir respuestas de los animales del tipo elegido, aunque el hechizo no hace que los animales sean más amigables o cooperativos de lo normal (puede ser necesaria una tirada de reacción).\n- Servicios: Si un animal es amigable con el personaje, puede realizar algún favor o servicio."
    },
    {
      n: "Resistir fuego",
      a: "30’",
      d: "2 turnos",
      f: null,
      x: "Una única criatura obtiene resistencia sobrenatural al fuego:\n\n- Calor normal: Inmune al calor o fuego no mágico.\n- Bonificación a la salvación: Obtiene +2 a todas las tiradas de salvación contra hechizos o ataques de aliento de fuego.\n- Daño de fuego: Se reduce en 1 punto por cada dado lanzado (cada dado causa un mínimo de 1 punto de daño)."
    },
    {
      n: "Retener persona",
      a: "180’",
      d: "9 turnos",
      f: "1d4 objetivos",
      x: "Este hechizo paraliza a uno o más humanos, semihumanos o monstruos humanoides si fallan una tirada de salvación contra hechizos. Puede lanzarse de dos maneras:\n\n- Contra un individuo: La tirada de salvación del objetivo recibe un penalizador de -2.\n- Contra un grupo: Afecta a 1d4 individuos del grupo.\n- Restricciones: Los humanoides de más de 4+1 DG y los no muertos no se ven afectados."
    },
    {
      n: "Silencio en un radio de 15’",
      a: "180’",
      d: "12 turnos",
      f: null,
      x: "Un área de 15’ entra en un completo silencio.\n\n- Dentro del área: Todo el sonido desaparece. No se puede hablar ni lanzar hechizos.\n- Ruido fuera del área: Aquellos que estén dentro del área pueden oírlo.\n- Lanzar a una criatura: Se puede lanzar silencio a una criatura, pero debe hacer una tirada de salvación contra hechizos. Si la salvación falla, el área de silencio de 15’ se mueve con la criatura. Si tiene éxito, el hechizo se mantiene estático: el objetivo puede salir del área."
    }
  ],
  3: [
    {
      n: "Crecimiento animal",
      a: "120’",
      d: "12 turnos",
      f: null,
      x: "Tras lanzar este hechizo, un animal común que no tenga naturaleza mágica duplica su tamaño y fuerza.\n\n- Daño: El daño infligido por los ataques del animal se duplica.\n- Carga: También se duplica la cantidad de peso que puede soportar el animal.\n- Restricciones: Este hechizo puede usarse en versiones gigantes de animales normales, pero los animales inteligentes y monstruos fantásticos no se ven afectados."
    },
    {
      n: "Curar enfermedad ↔ Causar enfermedad",
      a: "30’",
      d: "Instantáneo / Permanente (Causar)",
      f: "2d12 días",
      x: "Este hechizo tiene dos usos:\n\n1. Curar a un sujeto de cualquier enfermedad: Incluso aquellas de origen mágico.\n2. Matar lodo verde: Este monstruo muere de forma instantánea.\n\nReversible: Causar enfermedad\nInflige una enfermedad terrible e incapacitante a su víctima si se falla una tirada de salvación contra hechizos. La enfermedad tiene los siguientes efectos:\n\n- Muerte: En 2d12 días.\n- Penalización al ataque: -2 a tiradas de ataque.\n- Sanación natural: Toma el doble del tiempo habitual.\n- Sanación mágica: Es completamente inútil.\n- Curación: Esta enfermedad puede curarse con curar enfermedad."
    },
    {
      n: "Encontrar objeto",
      a: "120’",
      d: "6 turnos",
      f: null,
      x: "El lanzador puede sentir la dirección (pero no la distancia) en la que se encuentra un objeto. Se puede localizar uno de estos dos tipos de objetos:\n\n- Tipo de objeto: Un tipo de objeto sin especificar (una escalera, un altar, etc.). En este caso, se localiza el objeto más cercano de ese tipo.\n- Objeto específico: Un objeto específico que el lanzador puede visualizar y describir con detalle.\n- Restricciones: Este hechizo no puede localizar criaturas."
    },
    {
      n: "Extirpar maldición ↔ Maldición",
      a: "El lanzador o la criatura tocada",
      d: "Instantáneo / Permanente (Maldición)",
      f: null,
      x: "Extirpar maldición elimina inmediatamente una maldición de una criatura. Puede usarse para deshacerse de un objeto mágico maldito.\n\nReversible: Maldición\nImpone un efecto perjudicial sobre una criatura si esta falla una tirada de salvación contra hechizos.\n\n- Efectos: El lanzador determina la forma exacta y los efectos de la maldición.\n- Ejemplos: -2 a tiradas de salvación, -4 a tiradas de impactar, reducir una característica en un 50%.\n- Múltiples maldiciones: Pueden afectar a una criatura, siempre y cuando cada una tenga un efecto diferente.\n- Juicio del Árbitro: El Árbitro debe considerar los efectos de este hechizo, ¡incluso podría enviar de vuelta al lanzador una maldición demasiado poderosa!"
    },
    {
      n: "Golpear",
      a: "30’",
      d: "1 turno",
      f: null,
      isWeaponBuff: true,
      buffDamage: "1d6",
      buffDurationTurns: 1,
      x: "Este hechizo encanta un arma:\n\n- Daño: Causa 1d6 de daño adicional.\n- Arma mágica: El arma se considera mágica, por lo que afecta a monstruos que solo reciben daño de armas mágicas."
    },
    {
      n: "Luz continua ↔ Oscuridad continua",
      a: "120’",
      d: "Permanente",
      f: null,
      x: "Este hechizo tiene tres usos:\n\n1. Invocar luz: En un radio de 30’. La luz mágica es tan fuerte como la luz diurna (las criaturas que sufren penalizaciones al ataque bajo la luz diurna se ven afectadas). Este hechizo puede lanzarse sobre un objeto, lo que hará que la luz se mueva con este.\n2. Cegar a una criatura: Si el hechizo se lanza sobre sus ojos, la criatura queda cegada si falla una tirada de salvación contra hechizos. Una criatura cegada no puede atacar.\n3. Cancelar oscuridad: Luz continua puede cancelar el hechizo oscuridad continua.\n\nReversible: Oscuridad continua\nCrea un radio de 30’ de oscuridad mágica, que impide la visión normal y la infravisión. Cualquier fuente de luz que entre en esta área de oscuridad no arroja luz. Al igual que luz continua, se puede usar para cegar a una criatura o para cancelar un hechizo luz continua."
    }
  ],
  4: [
    {
      n: "Conjurar agua",
      a: "Tocar",
      d: "Permanente",
      f: null,
      x: "Este hechizo hace que una fuente mágica brote del suelo o de una pared.\n\n- Volumen: La fuente produce aproximadamente 50 galones de agua, suficiente para mantener a doce humanos y sus monturas por un día.\n- Lanzadores de nivel superior: Si el nivel del lanzador es superior a 8, la fuente conjura agua suficiente para doce humanos adicionales y sus monturas por cada nivel adicional."
    },
    {
      n: "Curar heridas graves ↔ Causar heridas graves",
      a: "El lanzador o la criatura tocada",
      d: "Instantáneo",
      f: "2d6+2 PG",
      x: "Este hechizo cura 2d6+2 puntos de golpe a una criatura viva. No puede superarse el máximo de puntos de golpe del sujeto.\n\nReversible: Causar heridas graves\nCausa 2d6+2 puntos de daño a la criatura tocada. Durante el combate debe realizarse una tirada de ataque cuerpo a cuerpo."
    },
    {
      n: "Hablar con las plantas",
      a: "30’",
      d: "3 turnos",
      f: null,
      x: "Este hechizo tiene dos usos:\n\n1. Plantas normales: Permite comunicarse con plantas normales. El lanzador puede realizar preguntas y recibir respuestas, así como pedir pequeños favores. Las plantas pueden ayudar si el favor es algo que puedan realizar. Por ejemplo, una maleza demasiado densa puede apartarse para crear un camino por el que el lanzador pueda pasar.\n2. Plantas monstruosas: Permite comunicarse con plantas monstruosas o monstruos basados en plantas."
    },
    {
      n: "Neutralizar veneno",
      a: "El lanzador, la criatura o el objeto tocado",
      d: "Instantáneo",
      f: null,
      x: "Este hechizo tiene dos usos:\n\n1. Personajes: Neutraliza los efectos de un veneno en un personaje. Un personaje que haya muerto a causa del veneno puede ser revivido si se lanza neutralizar veneno en menos de diez rondas tras la muerte.\n2. Objetos: Extirpa el veneno de un objeto."
    },
    {
      n: "Palos a serpientes",
      a: "120’",
      d: "6 turnos",
      f: "2d8 serpientes",
      x: "2d8 palos se convierten en serpientes que siguen las órdenes del lanzador.\n\n- Reversión: Las serpientes vuelven a convertirse en palos si mueren o acaba la duración del hechizo.\n\nSerpientes conjuradas:\nCA 6 [13], DG 1 (4 PG), Atq 1 x mordisco (1d4), GAC0 19 [0], MV 90’ (30’), TS M12 V13 P14 A15 H16 (1), ML 7, AL Neutral, PX 10 (13 si son venenosas), NA Ver hechizo, TT -\n\n- Veneno: Hay un 50% de probabilidades de que las serpientes sean venenosas.\n- Al morir: Se convierten en palos."
    },
    {
      n: "Protección contra el mal en un radio de 10’",
      a: "10’ alrededor del lanzador",
      d: "12 turnos",
      f: null,
      autoEffect: { name: "Prot. Mal 10'", ac: 1, atk: 0, dmg: 0, save: 1, type: "buff" },
      x: "Este hechizo protege al lanzador y sus aliados en un radio de 10’ de ataques de criaturas de otro alineamiento de la siguiente manera:\n\n- Bonificaciones: Los personajes protegidos ganan una bonificación de +1 a sus tiradas de salvación contra ataques o habilidades de las criaturas afectadas.\n- Ataques de las criaturas afectadas: Sufren un penalizador de -1 contra los que estén en el área.\n- Criaturas encantadas, construidas o invocadas: Este hechizo impide que estas criaturas ataquen cuerpo a cuerpo a los personajes protegidos, aunque pueden realizar ataques a distancia. Si alguno de los personajes protegidos ataca cuerpo a cuerpo a una de estas criaturas, la protección se rompe (aunque los personajes siguen recibiendo las bonificaciones)."
    }
  ],
  5: [
    {
      n: "Alzar a los muertos ↔ Rayo de la muerte",
      a: "120’",
      d: "Instantáneo",
      f: null,
      x: "Este hechizo tiene dos usos:\n\n1. Devolver a la vida: A un humano o semihumano que haya muerto recientemente (ver más adelante).\n2. Destruir no muertos: Un único monstruo no muerto es destruido si falla una tirada de salvación contra hechizos.\n\nDevolver a la vida: Se aplican las siguientes restricciones:\n- Límite de tiempo: El lanzador puede devolver la vida a una persona que lleve muerta no más de cuatro días por cada nivel del lanzador por encima de nivel 7. Por ejemplo, un lanzador de nivel 10 puede devolver la vida a un personaje que lleve muerto doce días (tres niveles por encima de 7 x cuatro días).\n- Debilidad: Volver de la muerte supone una experiencia muy dura. Hasta que el sujeto no descanse durante dos semanas completas, tiene 1 punto de golpe, se mueve a mitad de su movimiento, no puede llevar objetos pesados y no puede atacar, lanzar hechizos o usar habilidades de clase. Este período de debilidad no se puede reducir de ninguna manera.\n\nReversible: Rayo de la muerte\nDirige un rayo de magia necrótica contra un único objetivo. El objetivo muere si falla una tirada de salvación contra muerte. Lanzar rayo de la muerte es un acto puramente caótico; un personaje legal solo empleará este hechizo en situaciones desesperadas."
    },
    {
      n: "Comulgar",
      a: "El lanzador",
      d: "3 turnos",
      f: null,
      x: "El lanzador puede invocar un poder divino en busca de conocimiento.\n\n- Preguntas: El lanzador puede realizar tres preguntas cada vez que lanza este hechizo. Una vez al año, se pueden realizar seis preguntas.\n- Respuestas: Cada pregunta recibe un simple «sí» o «no» como respuesta.\n- Límite: Solo se puede lanzar comulgar una vez por semana. Este límite puede aumentar a una vez cada mes si el Árbitro piensa que el hechizo se usa en exceso."
    },
    {
      n: "Conjurar comida",
      a: "Aparece frente al lanzador",
      d: "Permanente",
      f: null,
      x: "Este hechizo crea comida de la nada.\n\n- Volumen: Se crea comida suficiente para alimentar a doce humanos y monturas durante un día.\n- Lanzadores de nivel superior: Si el nivel del lanzador es superior a 8, este hechizo crea comida suficiente para doce humanos adicionales y sus monturas por cada nivel adicional."
    },
    {
      n: "Disipar el mal",
      a: "30’",
      d: "Concentración (hasta 1 turno) o instantáneo",
      f: null,
      x: "Este hechizo tiene tres usos:\n\n1. Sello de protección: Al concentrarse y permanecer inmóvil, cualquier monstruo encantado o no muerto que esté dentro del alcance pueden ser desterrado o destruido. Cada monstruo debe realizar una tirada de salvación contra hechizos para evitar ser destruido. Si la salvación tiene éxito, el monstruo huirá del área afectada.\n2. Contra un único monstruo: Destruye o destierra instantáneamente a un único monstruo encantado o no muerto que esté al alcance. El monstruo realiza una tirada de salvación contra hechizos (con una penalización de -2) para evitar ser destruido. Si la salvación tiene éxito, el monstruo huirá del área afectada.\n3. Disipar maldición: Disipa instantáneamente la influencia de un objeto maldito sobre un personaje."
    },
    {
      n: "Misión ↔ Abandonar misión",
      a: "30’",
      d: "Hasta que se completa la misión / Instantánea (Abandonar)",
      f: null,
      x: "El lanzador obliga a un único sujeto a realizar una búsqueda o tarea específica.\n\n- Ejemplos: Rescatar a un prisionero, matar a un monstruo específico, traer un objeto mágico al lanzador o peregrinar a un lugar sagrado.\n- Misiones suicidas: La misión no debe ser obviamente suicida.\n- Tirada de salvación: El sujeto puede realizar una tirada de salvación contra hechizos. Si tiene éxito, misión no tiene ningún efecto.\n- Rechazo: El sujeto debe realizar la misión o sufre una maldición (con el mismo efecto que el hechizo maldición, aunque el Árbitro establece su naturaleza).\n- Fin del hechizo: El hechizo acaba una vez se haya cumplido la tarea.\n\nReversible: Abandonar misión\nPuede disipar un hechizo misión activo. Si el personaje que lanza abandonar misión es de un nivel más bajo que el lanzador del hechizo misión, existe una probabilidad de que este hechizo no tenga efecto. La probabilidad de fallo es de un 5% por cada nivel de diferencia entre ambos personajes."
    },
    {
      n: "Plaga de insectos",
      a: "480’",
      d: "Concentración (hasta 1 día)",
      f: null,
      x: "Si se lanza sobre la superficie, este hechizo invoca un enjambre de insectos voladores de 60’ de diámetro con las siguientes características:\n\n- Movimiento: 20’ por ronda. Si el enjambre está dentro del alcance del hechizo, el lanzador puede dirigir sus movimientos.\n- Visión: La visión dentro del área está oscurecida.\n- Criaturas de 2 DG o menos: Son alejadas si se ven atrapadas dentro del enjambre.\n- Concentración: Si el lanzador se mueve o pierde la concentración, el hechizo termina y el enjambre se disipa.\n- Restricciones: Este hechizo no tiene efecto si se lanza bajo tierra."
    }
  ]
};

const SPELLS_MAGO = {
  1: [
    {
      n: "Detectar magia",
      a: "60’",
      d: "2 turnos",
      f: null,
      x: "Cualquier objeto, área o criatura encantada brilla. Se muestran tanto los encantamientos permanentes como temporales."
    },
    {
      n: "Disco flotante",
      a: "6’",
      d: "6 turnos",
      f: null,
      x: "El mago invoca un disco ligeramente cóncavo de fuerza mágica que lo sigue.\n\n- Dimensiones: El disco tiene 3’ de diámetro y 1 pulgada de profundidad en el centro.\n- Carga: Puede transportar un máximo de 5 000 monedas (500 libras).\n- Movimiento: El disco flota a la altura de la cintura y paralelo al suelo, siempre dentro del alcance del hechizo.\n- Fin: El disco parpadea justo antes de desaparecer y deja caer cualquier carga que esté trasportando."
    },
    {
      n: "Dormir",
      a: "240’",
      d: "4d4 turnos",
      f: "2d8 DG, 4d4 turnos",
      x: "Dormir causa un sueño mágico sobre cualquier criatura, excepto no muertos. Puede hacer objetivo a:\n\n- Una única criatura: De 4+1 Dados de Golpe.\n- Un grupo: Un grupo de criaturas con un total de 2d8 Dados de Golpe o de 4 DG o menos cada criatura.\n- Asesinar: Las criaturas bajo los efectos de este hechizo están indefensas y pueden morir instantáneamente con un arma con filo.\n- Despertar: Una bofetada o una herida despierta a la criatura afectada.\n\nSi se lanza contra un grupo de criaturas de 4 DG o menos, se aplican las siguientes reglas:\n- Las más débiles primero: Las criaturas con menos DG son afectadas primero.\n- DG: Los monstruos con menos de 1 DG se consideran como si tuviesen 1 DG y solo los DG básicos de los monstruos con una bonificación de DG.\n- Exceso: Los Dados de Golpe que no sean suficientes para afectar a una criatura se pierden."
    },
    {
      n: "Encantar persona",
      a: "120’",
      d: "Uno o más días",
      f: null,
      x: "Una criatura humanoide es hechizada si falla una tirada de salvación contra hechizos:\n\n- Amistad: El sujeto considera al lanzador como su amigo y aliado de confianza, y acudirá siempre a defenderlo.\n- Órdenes: Si hablan el mismo idioma, el lanzador puede dar órdenes a la criatura encantada.\n- Naturaleza del sujeto: La criatura ignorará cualquier orden que contradiga sus hábitos o alineamiento.\n- Órdenes suicidas: La criatura encantada nunca obedecerá cualquier orden claramente suicida o dañina.\n- Restricciones: Los humanoides de más de 4+1 DG y los no muertos no se ven afectados.\n\nDuración: El encantamiento dura indefinidamente, pero el sujeto puede hacer más tiradas de salvación contra hechizos cada cierto tiempo, según su INT.\n- INT 3-8: Salvación mensual.\n- INT 9-12: Salvación semanal.\n- INT 13-18: Salvación diaria."
    },
    {
      n: "Escudo",
      a: "El lanzador",
      d: "2 turnos",
      f: null,
      autoEffect: { name: "Escudo", ac: 0, atk: 0, dmg: 0, save: 0, type: "buff" },
      x: "Escudo crea un campo de fuerza invisible que protege al lanzador:\n\n- Contra ataques a distancia: El hechicero posee CA 2 [17].\n- Contra el resto de ataques: El hechicero posee CA 4 [15]."
    },
    {
      n: "Leer idiomas",
      a: "El lanzador",
      d: "2 turnos",
      f: null,
      x: "Mientras el hechizo esté activo, el lanzador puede leer cualquier idioma, mensaje codificado, mapa o cualquier conjunto de instrucciones escritas. Este hechizo no otorga la habilidad de hablar idiomas desconocidos."
    },
    {
      n: "Leer magia",
      a: "El lanzador",
      d: "1 turno",
      f: null,
      x: "El lanzador puede descifrar inscripciones mágicas o runas de la siguiente manera:\n\n- Pergaminos: Permite entender la escritura mágica de cualquier pergamino arcano.\n- Grimorios: Posibilita descifrar un grimorio escrito por otro hechicero arcano.\n- Inscripciones: Permite leer cualquier runa o palabra mágica inscrita sobre un objeto o superficie.\n- Leer de nuevo: Una vez leída una inscripción mediante este hechizo, puede volver a leer ese texto en particular sin necesidad de usar este hechizo de nuevo."
    },
    {
      n: "Luz ↔ Oscuridad",
      a: "120’",
      d: "6 turnos + 1/nv",
      f: null,
      x: "Este hechizo tiene tres usos:\n\n1. Invocar luz: En un radio de 15’. La luz es lo suficientemente poderosa para leer, pero no tanto como la luz diurna. Este hechizo puede lanzarse sobre un objeto, lo que hará que la luz se mueva con este.\n2. Cegar a una criatura: Si el hechizo se lanza sobre sus ojos, la criatura queda cegada si falla una tirada de salvación contra hechizos. Una criatura cegada no puede atacar.\n3. Cancelar oscuridad: Luz puede cancelar el hechizo oscuridad.\n\nReversible: Oscuridad\nCrea un radio de 15’ de oscuridad mágica que impide la visión normal (pero no la infravisión). Al igual que luz, se puede usar para cegar a una criatura o para cancelar el hechizo luz."
    },
    {
      n: "Mantener portal",
      a: "10’",
      d: "2d6 turnos",
      f: "2d6 turnos",
      x: "Este hechizo mantiene cerrada mágicamente cualquier puerta, ventana u otro tipo de portal.\n\n- Abrir con magia: El hechizo abrir abre el portal al instante.\n- Abrir con fuerza: Las criaturas con 3 DG o más que el lanzador pueden abrir el portal tras una ronda forzándolo."
    },
    {
      n: "Protección contra el mal",
      a: "El lanzador",
      d: "6 turnos",
      f: null,
      autoEffect: { name: "Prot. contra el mal", ac: 1, atk: 0, dmg: 0, save: 1, type: "buff" },
      x: "Este hechizo protege al lanzador de ataques de criaturas de otro alineamiento de la siguiente manera:\n\n- Bonificaciones: El lanzador gana una bonificación +1 a sus tiradas de salvación contra ataques o habilidades de las criaturas afectadas.\n- Ataques de las criaturas afectadas: Sufren una penalización de -1 contra el lanzador.\n- Criaturas encantadas, construidas o invocadas: Este hechizo impide que estas criaturas ataquen cuerpo a cuerpo al lanzador, aunque pueden realizar ataques a distancia. Si el lanzador ataca cuerpo a cuerpo a estas criaturas, la protección se rompe (aunque sigue recibiendo las bonificaciones)."
    },
    {
      n: "Proyectil mágico",
      a: "150’",
      d: "1 turno",
      f: "1d6+1 daño",
      x: "Este hechizo invoca un dardo de energía mágica que el lanzador puede usar para atacar a distancia a sus enemigos.\n\n- Impacto: El proyectil impacta automáticamente (no se requiere ninguna tirada de ataque ni de salvación).\n- Daño: Proyectil mágico inflige un daño de 1d6+1.\n- Lanzadores de nivel superior: Pueden invocar más proyectiles: dos proyectiles adicionales por cada 5 niveles de experiencia que tenga el lanzador (tres proyectiles para los niveles 6-10, cinco proyectiles para los niveles 11-15, etc.). Los proyectiles adicionales atacan al mismo objetivo."
    },
    {
      n: "Ventriloquía",
      a: "60’",
      d: "2 turnos",
      f: null,
      x: "El hechicero puede hacer que su voz parezca provenir de cualquier lugar dentro del alcance."
    }
  ],
  2: [
    {
      n: "Abrir",
      a: "60’",
      d: "1 ronda",
      f: null,
      x: "Este hechizo abre puertas, portones, cofres y demás.\n\n- Puertas cerradas mágicamente: Pueden abrirse (por ejemplo: mantener portal, bloqueo mágico).\n- Puertas secretas: Pueden abrirse, pero el lanzador debe saber dónde están."
    },
    {
      n: "Bloqueo mágico",
      a: "10’",
      d: "Permanente",
      f: null,
      x: "Bloqueo mágico cierra mágicamente una puerta, portón, portal o cualquier objeto que tenga una cerradura.\n\nIgnorar: Un bloqueo mágico puede ignorarse de la siguiente manera:\n- El lanzador: Puede ignorar su propio bloqueo mágico.\n- Hechizo abrir: Abre cualquier bloqueo mágico.\n- Lanzadores de nivel superior: Cualquier lanzador de hechizos con 3 niveles o más por encima del lanzador de bloqueo mágico puede pasar sin impedimentos.\n- Temporal: Ignorar un bloqueo mágico no lo destruye."
    },
    {
      n: "Detectar el mal",
      a: "60’",
      d: "2 turnos",
      f: null,
      x: "Los objetos encantados con intención maligna o criaturas malvadas brillan mágicamente.\n\n- Intención: Este hechizo no permite leer pensamientos, solo otorga una idea general de intención maligna.\n- Definición de mal: El Árbitro debe decidir qué considera «maligno». Algunas cosas son potencialmente peligrosas, como las trampas, pero no «malignas»."
    },
    {
      n: "Detectar lo invisible",
      a: "10’ por nivel",
      d: "6 turnos",
      f: null,
      x: "El lanzador puede ver cualquier criatura u objeto invisible."
    },
    {
      n: "Encontrar objeto",
      a: "60’ + 10’/nv",
      d: "2 turnos",
      f: null,
      x: "El lanzador puede sentir la dirección (pero no la distancia) a la que se encuentra un objeto. Se puede localizar uno de estos dos tipos de objetos:\n\n- Tipo de objeto: Un tipo de objeto sin especificar (una escalera, un altar, etc.). En este caso, se localiza el objeto más cercano de ese tipo.\n- Objeto específico: Un objeto específico que conoce el lanzador.\n- Restricciones: Este hechizo no puede localizar criaturas."
    },
    {
      n: "Fuerza fantasmal",
      a: "240’",
      d: "Concentración",
      f: null,
      x: "Una ilusión visual se manifiesta en un área de 20’ cúbicos. Se pueden crear tres tipos de ilusiones:\n\n- Monstruo ilusorio: Puede atacar. El monstruo tiene CA 9 [10] y desaparece si es golpeado en combate.\n- Ataque ilusorio: Como una avalancha, un techo que cae, un proyectil mágico, etc. Los objetivos que superen una tirada de salvación contra hechizos no se ven afectados.\n- Una escena: Puede cambiar la apariencia del área afectada o crear la apariencia de algo nuevo. Esta escena desaparece si se toca.\n\nRestricciones:\n- Concentración: Necesaria para mantener la ilusión.\n- Daño: Nunca infligen un daño real (caen inconscientes o paralizados 1d4 turnos).\n- Imaginación: Si es algo nunca visto por el lanzador, los objetivos reciben bonificación a su salvación."
    },
    {
      n: "Invisibilidad",
      a: "240’",
      d: "Permanente",
      f: null,
      x: "El lanzador u otra criatura u objeto dentro del alcance se vuelve invisible:\n\n- Si se lanza sobre una criatura: Cualquier equipo que lleve se vuelve invisible. Si el sujeto ataca o lanza un hechizo, la invisibilidad acaba.\n- Si se lanza sobre un objeto: La invisibilidad es permanente.\n- Fuentes de luz: Si una fuente de luz se vuelve invisible, la luz que emite es visible."
    },
    {
      n: "Leer pensamientos",
      a: "60’",
      d: "12 turnos",
      f: null,
      x: "Este hechizo otorga al lanzador la capacidad de percibir y comprender los pensamientos de otras criaturas vivientes.\n\n- Concentración durante 1 turno: Para captar los pensamientos en una dirección concreta.\n- Múltiples criaturas: El hechicero debe gastar un turno adicional para discernir los pensamientos de una criatura en concreto.\n- Obstrucciones: Bloqueado por una fina capa de plomo o roca de 2’ de espesor.\n- Significado: Entiende el significado incluso si no conoce la lengua."
    },
    {
      n: "Levitar",
      a: "El lanzador",
      d: "6 turnos + 1/nv",
      f: null,
      x: "Este encantamiento permite al lanzador moverse por el aire:\n\n- Horizontal: El lanzador se puede empujar contra objetos sólidos para moverse horizontalmente.\n- Vertical: El lanzador se mueve verticalmente a 20’ por ronda.\n- Peso: Se puede llevar una cantidad normal de peso mientras se levita."
    },
    {
      n: "Luz continua ↔ Oscuridad continua",
      a: "120’",
      d: "Permanente",
      f: null,
      x: "Este hechizo tiene tres usos:\n\n1. Invocar luz: En un radio de 30’. La luz es lo suficientemente poderosa para leer, pero no tanto como la luz diurna. Este hechizo puede lanzarse sobre un objeto, lo que hará que la luz se mueva con este.\n2. Cegar a una criatura: Si el hechizo se lanza sobre sus ojos, la criatura queda cegada si falla una tirada de salvación contra hechizos. Una criatura cegada no puede atacar.\n3. Cancelar oscuridad: Luz continua puede cancelar el hechizo oscuridad continua.\n\nReversible: Oscuridad continua\nCrea un radio de 30’ de oscuridad mágica, que impide la visión normal y la infravisión. Cualquier fuente de luz que entre en esta área de oscuridad no arroja luz. Al igual que luz continua, se puede usar para cegar a una criatura o para cancelar un luz continua."
    },
    {
      n: "Reflejo",
      a: "El lanzador",
      d: "6 turnos",
      f: "1d4 copias",
      x: "El lanzador invoca 1d4 ilusiones de sí mismo.\n\n- Ataques al lanzador: Destruyen una de las ilusiones (incluso si el ataque falla).\n- Comportamiento: Las ilusiones se ven y se comportan exactamente como el lanzador."
    },
    {
      n: "Telaraña",
      a: "10’",
      d: "48 turnos",
      f: null,
      x: "Este hechizo crea una telaraña de fuertes y pegajosos hilos que bloquean un área de 10’ cúbicos.\n\n- Atrapados: Las criaturas no se pueden mover.\n- FUE mágica > 18: Se libera en 4 rondas.\n- Fuerza gigantesca: Se libera en 2 rondas.\n- Humano común: Se libera en 2d4 turnos.\n- Inflamable: El fuego destruye la telaraña en 2 rondas; las criaturas atrapadas sufren 1d6 puntos de daño por llamas."
    }
  ],
  3: [
    {
      n: "Bola de fuego",
      a: "240’",
      d: "Instantáneo",
      f: "Xd6 daño",
      x: "El hechicero invoca una bola de fuego a un punto que detona en una esfera de 20’ de radio.\n\n- Daño: Las criaturas afectadas sufren 1d6 puntos de daño por cada nivel del lanzador. Este daño se reduce a la mitad si realizan una tirada de salvación contra hechizos exitosa."
    },
    {
      n: "Celeridad",
      a: "240’",
      d: "3 turnos",
      f: null,
      autoEffect: { name: "Celeridad", ac: 0, atk: 0, dmg: 0, save: 0, type: "buff" },
      x: "Hasta 24 criaturas en un área de 60’ de diámetro pueden moverse y actuar el doble de rápido de lo normal:\n\n- Movimiento: El movimiento máximo de cada criatura se duplica.\n- Ataques: Las criaturas encantadas pueden realizar el doble de ataques por ronda.\n- Hechizos y artefactos: No se duplican los hechizos ni el uso de varitas por ronda."
    },
    {
      n: "Clarividencia",
      a: "60’",
      d: "12 turnos",
      f: null,
      x: "El hechicero obtiene la habilidad de ver a través de los ojos de otros seres vivos tras 1 turno de concentración.\n\n- Cambiar: Una vez establecida la conexión, el lanzador puede mantenerla o cambiar a otra criatura.\n- Obstrucciones: Bloqueado por una fina capa de plomo o roca de 2’ de espesor."
    },
    {
      n: "Disipar magia",
      a: "120’",
      d: "Instantáneo",
      f: null,
      x: "Disipar magia disipa cualquier hechizo no instantáneo en un área de 20’ cúbicos.\n\n- Diferencia de niveles: Si el lanzador del efecto a disipar es de mayor nivel, existe un 5% de probabilidad de fallo por nivel de diferencia.\n- Objetos mágicos: No se ven afectados."
    },
    {
      n: "Infravisión",
      a: "El lanzador o la criatura tocada",
      d: "1 día",
      f: null,
      x: "El sujeto gana infravisión, lo que le permite ver 60’ en la oscuridad."
    },
    {
      n: "Invisibilidad en un radio de 10’",
      a: "120’",
      d: "Permanente",
      f: null,
      x: "La criatura objetivo y todas las criaturas a 10’ se vuelven invisibles:\n\n- Área: El área de 10’ se mueve con la criatura objetivo.\n- Entrar/Salir: Quienes entran después no se afectan; quienes salen se vuelven visibles.\n- Romper la invisibilidad: Si un sujeto invisible ataca o lanza un hechizo, la invisibilidad acaba."
    },
    {
      n: "Protección contra el mal en un radio de 10’",
      a: "10’ alrededor del lanzador",
      d: "12 turnos",
      f: null,
      autoEffect: { name: "Prot. Mal 10'", ac: 1, atk: 0, dmg: 0, save: 1, type: "buff" },
      x: "Este hechizo protege al lanzador y sus aliados en un radio de 10’ de ataques de criaturas de otro alineamiento:\n\n- Bonificaciones: +1 a tiradas de salvación contra ataques o habilidades de las criaturas afectadas.\n- Penalización enemiga: -1 a tiradas de ataque contra los protegidos.\n- Criaturas encantadas o invocadas: No pueden atacar cuerpo a cuerpo a los protegidos."
    },
    {
      n: "Protección contra proyectiles normales",
      a: "30’",
      d: "12 turnos",
      f: null,
      x: "Un único sujeto dentro del alcance obtiene inmunidad completa contra pequeños proyectiles no mágicos (no funciona contra grandes rocas o flechas encantadas)."
    },
    {
      n: "Relámpago",
      a: "180’",
      d: "Instantáneo",
      f: "Xd6 daño",
      x: "El hechicero invoca un rayo eléctrico de 60’ de largo y 5’ de ancho.\n\n- Daño: 1d6 puntos de daño por nivel del lanzador (mitad si supera tirada de salvación contra hechizos).\n- Rebote: Si impacta contra una barrera sólida antes de alcanzar toda su extensión, rebota y viaja la distancia restante hacia el lanzador."
    },
    {
      n: "Respirar bajo el agua",
      a: "30’",
      d: "1 día",
      f: null,
      x: "El sujeto puede respirar agua gracias a este hechizo. No afecta a la habilidad de respirar aire ni otorga habilidades adicionales de natación."
    },
    {
      n: "Retener persona",
      a: "120’",
      d: "1 turno por nivel",
      f: "1d4 objetivos",
      x: "Este hechizo paraliza a uno o más humanos, semihumanos o monstruos humanoides si fallan una tirada de salvación contra hechizos.\n\n- Contra un individuo: La tirada de salvación del objetivo está penalizada en -2.\n- Contra un grupo: Afecta a 1d4 individuos del grupo.\n- Restricciones: Los humanoides de más de 4+1 DG y los no muertos no se ven afectados."
    },
    {
      n: "Volar",
      a: "El lanzador o la criatura tocada",
      d: "1d6 turnos + 1/nv",
      f: "1d6+X turnos",
      x: "El sujeto gana la habilidad de volar.\n\n- Movimiento: Hasta 360’ (120’).\n- Movimiento libre: Puede moverse en cualquier dirección, así como levitar y mantenerse estático en el aire."
    }
  ],
  4: [
    {
      n: "Confusión",
      a: "120’",
      d: "12 rondas",
      f: "3d6 criaturas",
      x: "Hace que 3d6 sujetos en un área de 60’ de diámetro se confundan y sean incapaces de tomar decisiones:\n\n- Comportamiento: Cada asalto, el Árbitro tira 2d6 para determinar el comportamiento de los sujetos afectados:\n  • 2–5: Ataca al grupo del lanzador.\n  • 6–8: No realiza ninguna acción.\n  • 9–12: Ataca al grupo del sujeto.\n- Tirada de salvación: Las criaturas con 2+1 Dados de Golpe o más pueden realizar una tirada de salvación contra hechizos cada asalto para resistir el hechizo durante ese asalto. Las criaturas con 2 DG o menos no reciben tirada de salvación."
    },
    {
      n: "Crecimiento vegetal",
      a: "120’",
      d: "Permanente",
      f: null,
      x: "Este hechizo hace que la vegetación en un área de hasta 3 000 pies cuadrados crezca de forma desmesurada, formando una jungla densa e impenetrable.\n\n- Paso: Solo las criaturas de tamaño gigantesco pueden abrirse paso a través de esta maleza, y se mueven a velocidad reducida.\n- Tipo de vegetación: Afecta a cualquier tipo de vegetación normal existente en el área."
    },
    {
      n: "Encantar monstruos",
      a: "120’",
      d: "Uno o más días",
      f: "3d6 criaturas",
      x: "Este hechizo afecta a una o más criaturas vivas, de la siguiente manera:\n\n- Criaturas de 3 DG o menos: Afecta a 3d6 criaturas de 3 DG o menos si fallan una tirada de salvación contra hechizos.\n- Criaturas de más de 3 DG: Afecta a una única criatura de más de 3 DG si falla una tirada de salvación contra hechizos.\n- Efecto: La criatura encantada considera al lanzador como un amigo de confianza y obedecerá sus órdenes (no suicidas).\n- Salvaciones adicionales: Las criaturas pueden realizar tiradas de salvación adicionales según su INT (INT 3–8: mensual; INT 9–12: semanal; INT 13–18: diaria).\n- Restricciones: Los monstruos no muertos son inmunes."
    },
    {
      n: "Extirpar maldición ↔ Maldición",
      a: "El lanzador o la criatura tocada",
      d: "Instantáneo / Permanente (Maldición)",
      f: null,
      x: "Extirpar maldición elimina inmediatamente una maldición de una criatura. Puede usarse para deshacerse de un objeto mágico maldito.\n\nReversible: Maldición\nImpone un efecto perjudicial sobre una criatura si esta falla una tirada de salvación contra hechizos.\n\n- Efectos: El lanzador determina la forma exacta y los efectos de la maldición.\n- Ejemplos: -2 a tiradas de salvación, -4 a tiradas de impactar, reducir una característica en un 50%.\n- Múltiples maldiciones: Pueden afectar a una criatura, siempre y cuando cada una tenga un efecto diferente.\n- Juicio del Árbitro: El Árbitro debe considerar los efectos de este hechizo, ¡incluso podría enviar de vuelta al lanzador una maldición demasiado poderosa!"
    },
    {
      n: "Masamorfismo",
      a: "240’",
      d: "Permanente",
      f: null,
      x: "Un grupo de criaturas de tamaño humano en un área de hasta 240’ de diámetro se transforma ilusoriamente en un bosque.\n\n- Movimiento: Si las criaturas se mueven o abandonan el área, la ilusión se desvanece para ellas.\n- Detección: La ilusión engaña la visión normal y la infravisión. El hechizo detectar magia revela la presencia de magia, pero no la verdadera forma de las criaturas."
    },
    {
      n: "Muro de fuego",
      a: "60’",
      d: "Concentración",
      f: null,
      x: "Invoca una barrera vertical y opaca de fuego de hasta 1 200 pies cuadrados.\n\n- Criaturas de menos de 4 DG: No pueden atravesar el muro de fuego.\n- Criaturas de 4 DG o más: Sufren 1d6 puntos de daño al cruzarlo (el daño se duplica contra criaturas basadas en frío o no muertos de hielo).\n- Concentración: El muro permanece mientras el lanzador se mantenga inmóvil y concentrado en el hechizo."
    },
    {
      n: "Muro de hielo",
      a: "120’",
      d: "12 turnos",
      f: null,
      x: "Invoca un muro sólido y vertical de hielo translúcido de hasta 1 200 pies cuadrados.\n\n- Criaturas de menos de 4 DG: No pueden cruzar ni romper el muro de hielo.\n- Criaturas de 4 DG o más: Pueden romper el muro sufriendo 1d6 puntos de daño (el daño se duplica contra criaturas de fuego).\n- Fuego: El fuego mágico derrite el muro de hielo en 1 ronda."
    },
    {
      n: "Ojo de mago",
      a: "240’",
      d: "6 turnos",
      f: null,
      x: "Invoca un ojo mágico e invisible que flota a través del aire a una velocidad de hasta 120’ por turno.\n\n- Visión: Otorga al lanzador visión normal e infravisión en un radio de 60’ desde la posición del ojo.\n- Paso: Puede atravesar cualquier agujero o grieta de al menos 1 pulgada de diámetro.\n- Concentración: El lanzador debe concentrarse para ver a través del ojo y dirigir su movimiento."
    },
    {
      n: "Polimorfizar a otro",
      a: "60’",
      d: "Permanente",
      f: null,
      x: "Transforma a una criatura viva en otra forma biológica distinta (con un máximo de Dados de Golpe igual al doble de la forma original).\n\n- Tirada de salvación: La criatura puede realizar una tirada de salvación contra hechizos para resistir la transformación.\n- Características: La criatura mantiene sus puntos de golpe originales, pero adopta las habilidades físicas, capacidades naturales, instintos e inteligencia de la nueva forma."
    },
    {
      n: "Polimorfizarse a sí mismo",
      a: "El lanzador",
      d: "6 turnos + 1/nv",
      f: null,
      x: "El lanzador adopta la forma de cualquier criatura viviente con un número de Dados de Golpe igual o inferior a su propio nivel.\n\n- Habilidades adquiridas: Obtiene las capacidades físicas de la nueva forma (fuerza, vuelo, natación, respiración, etc.).\n- Características retenidas: Mantiene sus puntos de golpe, tiradas de salvación, tiradas de ataque e inteligencia original.\n- Magia: No puede lanzar hechizos mientras esté bajo una forma diferente a la suya."
    },
    {
      n: "Puerta dimensional",
      a: "10’",
      d: "1 ronda",
      f: null,
      x: "Teletransporta instantáneamente al lanzador (y a cualquier criatura u objeto que toque y no supere su peso máximo) a cualquier destino visible o especificado por coordenadas a una distancia de hasta 360’.\n\n- Obstáculos: Si el destino cae dentro de un objeto sólido, el hechizo falla y las criaturas transportadas quedan atrapadas o aturdidas 1 asalto."
    },
    {
      n: "Terreno alucinatorio",
      a: "240’",
      d: "Hasta ser tocado",
      f: null,
      x: "Crea una ilusión geográfica que altera la apariencia de un terreno exterior (por ejemplo, hace que una colina parezca un pantano o un bosque parezca una llanura despejada).\n\n- Fin: La ilusión persiste hasta que una criatura inteligente la toca directamente, momento en el que el engaño desaparece por completo."
    }
  ],
  5: [
    {
      n: "Alzar a los muertos",
      a: "60’",
      d: "Permanente",
      f: null,
      x: "Reanima los restos de cadáveres humanos o monstruosos como esqueletos o zombis que obedecen ciegamente las órdenes del mago.\n\n- Límite de DG: El total de Dados de Golpe de no muertos animados no puede superar el nivel del lanzador.\n- Esqueletos: CA 7 [12], DG equivalentes a la criatura en vida.\n- Zombis: CA 8 [11], DG equivalentes a la criatura en vida + 1 DG adicional."
    },
    {
      n: "Atravesar pared",
      a: "30’",
      d: "3 turnos",
      f: null,
      x: "Abre temporalmente un pasaje de 5’ de ancho por 10’ de profundidad en piedra, madera o mampostería sólida.\n\n- Fin: Al concluir la duración del hechizo, el pasaje se cierra instantáneamente. Cualquier criatura u objeto que quede atrapado dentro muere o es expulsado al lado más cercano."
    },
    {
      n: "Conjurar elemental",
      a: "240’",
      d: "Permanente",
      f: null,
      x: "Invoca a un elemental de 16 DG (aire, tierra, fuego o agua) de otro plano que obedece las órdenes del mago.\n\nEstadísticas del elemental:\nCA -2 [21], DG 16* (72 PG), Atq 1 x golpe (3d8), GAC0 8 [+11], ML 10, AL Neutral.\n\n- Concentración: Requiere concentración total e ininterrumpida. Si el lanzador recibe daño, se mueve o pierde la concentración, el elemental se vuelve hostil y atacará al mago."
    },
    {
      n: "Contactar plano superior",
      a: "El lanzador",
      d: "1 conversación",
      f: null,
      x: "Permite contactar con entidades cósmicas de planos superiores (del 3º al 12º plano) para realizar preguntas de sí/no.\n\n- Riesgo de locura: Cada plano conlleva una probabilidad de locura temporal para el lanzador si falla su tirada.\n- Veracidad: Cuanto más alto sea el plano contactado, mayor es la probabilidad de que la respuesta sea verídica y sabia."
    },
    {
      n: "Imbecilidad",
      a: "240’",
      d: "Permanente",
      f: null,
      x: "Un hechicero o criatura con capacidad mágica dentro del alcance debe superar una tirada de salvación contra hechizos con una penalización de -4 o pierde toda capacidad mental, volviéndose incapaz de hablar, pensar lógicamente o lanzar magia."
    },
    {
      n: "Muro de piedra",
      a: "60’",
      d: "Permanente",
      f: null,
      x: "Invoca un muro sólido y permanente de roca de hasta 1 000 pies cúbicos sobre una base sólida.\n\n- Dimensiones: El grosor mínimo es de 2 pies.\n- Resistencia: El muro es roca natural no mágica y puede ser derribado o picado mediante fuerza física normal."
    },
    {
      n: "Nube letal",
      a: "30’",
      d: "6 turnos",
      f: null,
      x: "Invoca una nube densa y venenosa de vapores pesados de 30’ de diámetro que desciende hacia el suelo y avanza a 20’ por turno.\n\n- Criaturas de menos de 5 DG: Mueren de inmediato si fallan su tirada de salvación contra muerte cada asalto.\n- Criaturas de 5 DG o más: Sufren 1 punto de daño por cada asalto dentro de la nube tóxica."
    },
    {
      n: "Receptáculo mágico",
      a: "El lanzador",
      d: "Especial",
      f: null,
      x: "El cuerpo del mago entra en un trance inmóvil y transfiere su alma a un recipiente inanimado a una distancia de hasta 30’.\n\n- Posesión: Desde el receptáculo, el alma del mago puede intentar poseer el cuerpo de cualquier criatura viviente a una distancia de hasta 120’ si esta falla una tirada de salvación contra hechizos."
    },
    {
      n: "Retener monstruo",
      a: "120’",
      d: "6 turnos + 1/nv",
      f: "1d4 objetivos",
      x: "Paraliza a uno o más monstruos o criaturas vivientes si fallan una tirada de salvación contra hechizos:\n\n- Contra un individuo: La tirada de salvación del objetivo recibe una penalización de -2.\n- Contra un grupo: Afecta a 1d4 monstruos en el área.\n- Restricciones: Los no muertos no se ven afectados."
    },
    {
      n: "Telequinesis",
      a: "120’",
      d: "Concentración",
      f: null,
      x: "Permite mover mentalmente objetos o criaturas vivientes a una velocidad de hasta 20’ por asalto mediante concentración.\n\n- Peso máximo: El lanzador puede mover hasta 200 monedas (20 libras) de peso por cada nivel de experiencia que posea."
    },
    {
      n: "Teletransporte",
      a: "10’",
      d: "Instantáneo",
      f: null,
      x: "Teletransporta instantáneamente al lanzador (y a quienes toque sin superar su carga máxima) a cualquier destino conocido.\n\n- Probabilidad de error: El Árbitro tira 1d100 según el grado de familiaridad con el destino:\n  • Muy familiar: 01–95 Éxito | 96–99 Demasiado alto/bajo | 00 En el suelo (muerte).\n  • Visto una vez: 01–80 Éxito | 81–96 Desviación | 97–00 Muerte.\n  • Descripción: 01–50 Éxito | 51–75 Desviación | 76–00 Muerte."
    },
    {
      n: "Transmutar roca en lodo ↔ Transmutar lodo en roca",
      a: "120’",
      d: "3d6 días / Perm.",
      f: "3d6 días",
      x: "Convierte un área de hasta 3 000 pies cuadrados de roca sólida en lodo profundo de varios pies de grosor, reduciendo el movimiento de quienes lo crucen al 10% de su velocidad normal.\n\nReversible: Transmutar lodo en roca\nConvierte un área de lodo en piedra sólida permanente, atrapando a las criaturas sumergidas en él."
    }
  ],
  6: [
    {
      n: "Abrir las aguas",
      a: "120’",
      d: "6 turnos",
      f: null,
      x: "Separa una masa de agua formando un corredor seco y despejado de 10’ de ancho y hasta 120’ de largo a través del cual se puede caminar.\n\n- Fin: Al concluir la duración del hechizo, las aguas vuelven a unirse con fuerza torrencial."
    },
    {
      n: "Acechador invisible",
      a: "Frente al lanzador",
      d: "Una misión",
      f: null,
      x: "Invoca un acechador invisible del plano elemental del aire obligado a cumplir una misión específica designada por el mago.\n\nEstadísticas del acechador invisible:\nCA 3 [16], DG 8* (36 PG), Atq 1 x golpe (4d4), GAC0 12 [+7], MV 120’ (40’), TS M8 V9 P10 A10 H12 (F8), ML 12, AL Neutral, PX 1 200.\n\n- Sorpresa: Sorprende con un resultado de 1–5 en 1d6.\n- Rastreo: Rastreador infalible que nunca pierde el rastro de su objetivo."
    },
    {
      n: "Calmar las aguas",
      a: "240’",
      d: "10 turnos",
      f: null,
      x: "Reduce el nivel del agua a la mitad en un área de hasta 10 000 pies cuadrados, calmando corrientes violentas o permitiendo vadear ríos profundos."
    },
    {
      n: "Concha antimágica",
      a: "El lanzador",
      d: "12 turnos",
      f: null,
      x: "Crea una barrera invisible e impenetrable en un radio de 10’ alrededor del lanzador que anula por completo cualquier hechizo o efecto mágico que intente cruzarla, tanto desde el exterior como desde el interior."
    },
    {
      n: "Conjuro de muerte",
      a: "240’",
      d: "Instantáneo",
      f: "4d8 DG",
      x: "Mata de forma instantánea a criaturas vivas dentro de un área de 60’ cúbicos si fallan su tirada de salvación contra muerte.\n\n- Dados de Golpe afectados: Afecta a un total de 4d8 Dados de Golpe de criaturas.\n- Límite individual: Solo afecta a criaturas de menos de 8 Dados de Golpe.\n- Inmunidades: Los monstruos no muertos son inmunes."
    },
    {
      n: "Controlar el clima",
      a: "240 yardas",
      d: "Concentración",
      f: null,
      x: "Permite al lanzador manipular y alterar las condiciones climáticas en un área exterior extensa mediante concentración continua:\n\n- Efectos posibles: Calma absoluta, calor extremo, niebla espesa, vientos huracanados, lluvia torrencial, nieve o un tornado de 12 DG."
    },
    {
      n: "Desintegrar",
      a: "60’",
      d: "Instantáneo",
      f: null,
      x: "Destruye y reduce a polvo fino la materia de cualquier objeto no mágico (hasta 1 000 pies cúbicos) o a una criatura viva si falla una tirada de salvación contra muerte."
    },
    {
      n: "Geas ↔ Extirpar geas",
      a: "30’",
      d: "Permanente",
      f: null,
      x: "Obliga a un objetivo a obedecer una orden o cumplir una misión estricta impuesta por el hechicero.\n\n- Desobediencia: Si el sujeto desobedece o ignora la orden, sufre penalizaciones progresivas a sus características y salud hasta morir o cumplir la tarea.\n\nReversible: Extirpar geas\nDisipa un geas activo si el nivel del lanzador es igual o superior al lanzador original."
    },
    {
      n: "Mover la tierra",
      a: "240’",
      d: "6 turnos",
      f: null,
      x: "Permite desplazar, excavar o reorganizar masas de tierra, barro o colinas a una velocidad de hasta 60’ por turno.\n\n- Limitaciones: No afecta a la roca sólida o mampostería construida."
    },
    {
      n: "Piedra a carne ↔ Carne a piedra",
      a: "120’",
      d: "Permanente",
      f: null,
      x: "Transforma piedra en carne viva, restaurando a seres petrificados junto con todo el equipo que llevasen en el momento de su petrificación.\n\nReversible: Carne a piedra\nConvierte a una criatura viva y todo su equipo en una estatua de piedra sólida si falla una tirada de salvación contra parálisis."
    },
    {
      n: "Proyectar imagen",
      a: "240’",
      d: "6 turnos",
      f: null,
      x: "Crea una réplica ilusoria tangible e idéntica del mago a través de la cual este puede originar magia, hablar y percibir el entorno como si estuviese físicamente allí.\n\n- Ataques: Los ataques físicos que impacten al clon lo atraviesan sin destruirlo."
    },
    {
      n: "Reencarnación",
      a: "Aparece frente al lanzador",
      d: "Permanente",
      f: null,
      x: "Un personaje fallecido es devuelto a la vida en una nueva forma física que se manifiesta frente al lanzador. El nuevo cuerpo del personaje no es necesariamente el mismo que el original: se determina según la tabla de Reencarnación: clase.\n\nLa tirada indica una clase de personaje o un monstruo:\n\n► Clase de personaje: El personaje tiene 1d6 niveles de experiencia (o como máximo el mismo nivel que alcanzó antes de su muerte). El personaje reencarnado puede seguir ganando Experiencia y subiendo de nivel con su nueva clase.\n\n► Monstruo: El Árbitro determina su tipo. El monstruo debe ser al menos parcialmente inteligente, no tener más Dados de Golpe que el nivel del personaje que se reencarna (máximo 6 DG), y ser del mismo alineamiento. Se pueden utilizar las tablas de la siguiente página o el Árbitro puede crear sus propias tablas. Los monstruos no pueden ganar Experiencia o subir de nivel.\n\nReencarnación: Clase (d10)\n1: Clérigo\n2: Enano\n3: Elfo\n4: Guerrero\n5: Mediano\n6: Mago\n7: Ladrón\n8: Monstruo (tira en la tabla de alineamiento)\n9–10: Misma clase\n\nReencarnación: Monstruos legales (d6)\n1: Gnomo (1 DG)\n2: Neandertal (2 DG)\n3: Pegaso (2 DG)\n4: Perro intermitente (4 DG)\n5: Unicornio (4 DG)\n6: Roc pequeño (6 DG)\n\nReencarnación: Monstruos neutrales (d6)\n1: Pixie o hada (1 DG)\n2: Hombre lagarto (2 DG)\n3: Gran babuino (2 DG)\n4: Simio blanco (4 DG)\n5: Centauro (4 DG)\n6: Hombre-oso (6 DG)\n\nReencarnación: Monstruos caóticos (d10)\n1: Goblin (1 DG)\n2: Hobgoblin (1 DG)\n3: Kobold (1 DG)\n4: Orco (1 DG)\n5: Gnoll (2 DG)\n6: Osgo (3 DG)\n7: Hombre-rata (3 DG)\n8: Ogro (4 DG)\n9: Hombre-lobo (4 DG)\n10: Minotauro (6 DG)\n\nTablas de reencarnación alternativas:\nLas clases y monstruos que aparecen en estas tablas han sido tomados de Fantasía clásica: Reglas de género y Fantasía clásica: Bestiario. Si se usan otras clases o monstruos, el Árbitro puede crear tablas de reencarnación alternativas."
    }
  ]
};

// ENLACE GLOBAL PARA LA APP Y SUS CLASES
if (typeof window.SPELLS_DB === 'undefined') {
  window.SPELLS_DB = {};
}
window.SPELLS_DB.clerigo = SPELLS_CLERIGO;
window.SPELLS_DB.mago = SPELLS_MAGO;
window.SPELLS_DB.elfo = SPELLS_MAGO;