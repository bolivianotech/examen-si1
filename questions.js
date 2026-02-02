// ============================================
// BANCO DE PREGUNTAS - EXAMEN
// Sistemas de Información I
// UPDS - Universidad Privada Domingo Savio
// ============================================

const QUESTIONS = [
    // === SECCIÓN A: SELECCIÓN MÚLTIPLE (Básico) - 5 puntos ===
    {
        id: 1,
        section: 'A',
        sectionTitle: 'Selección Múltiple - Básico',
        type: 'multiple-choice',
        points: 1,
        text: '¿Cuál es la característica principal que distingue a un sistema abierto de uno cerrado?',
        choices: [
            { id: 'a', text: 'La cantidad de componentes que posee' },
            { id: 'b', text: 'La interacción con su entorno' },
            { id: 'c', text: 'La velocidad de procesamiento' },
            { id: 'd', text: 'El tamaño de sus subsistemas' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 2,
        section: 'A',
        sectionTitle: 'Selección Múltiple - Básico',
        type: 'multiple-choice',
        points: 1,
        text: 'El principio de entropía en un sistema se refiere a:',
        choices: [
            { id: 'a', text: 'La capacidad de autorregulación' },
            { id: 'b', text: 'La tendencia al desorden y desintegración' },
            { id: 'c', text: 'El trabajo conjunto de los componentes' },
            { id: 'd', text: 'La jerarquía de los subsistemas' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 3,
        section: 'A',
        sectionTitle: 'Selección Múltiple - Básico',
        type: 'multiple-choice',
        points: 1,
        text: 'Un Sistema de Soporte a la Toma de Decisiones (DSS) está diseñado principalmente para:',
        choices: [
            { id: 'a', text: 'Procesar transacciones diarias' },
            { id: 'b', text: 'Generar reportes operativos estándar' },
            { id: 'c', text: 'Apoyar decisiones semiestructuradas y no estructuradas' },
            { id: 'd', text: 'Automatizar procesos de manufactura' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 4,
        section: 'A',
        sectionTitle: 'Selección Múltiple - Básico',
        type: 'multiple-choice',
        points: 1,
        text: '¿Cuál es la secuencia correcta de las fases del SDLC tradicional?',
        choices: [
            { id: 'a', text: 'Diseño → Análisis → Planificación → Implementación → Mantenimiento' },
            { id: 'b', text: 'Planificación → Análisis → Diseño → Implementación → Mantenimiento' },
            { id: 'c', text: 'Análisis → Planificación → Diseño → Mantenimiento → Implementación' },
            { id: 'd', text: 'Implementación → Diseño → Análisis → Planificación → Mantenimiento' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 5,
        section: 'A',
        sectionTitle: 'Selección Múltiple - Básico',
        type: 'multiple-choice',
        points: 1,
        text: 'En un DFD, ¿qué símbolo representa un almacén de datos?',
        choices: [
            { id: 'a', text: 'Círculo o elipse' },
            { id: 'b', text: 'Rectángulo' },
            { id: 'c', text: 'Líneas paralelas abiertas' },
            { id: 'd', text: 'Flecha' }
        ],
        correctAnswer: 'c'
    },

    // === SECCIÓN B: DESARROLLO (Básico) - 5 puntos ===
    {
        id: 6,
        section: 'B',
        sectionTitle: 'Preguntas de Desarrollo',
        type: 'development',
        points: 2.5,
        text: 'Explique las diferencias entre un Sistema de Procesamiento de Transacciones (TPS) y un Sistema de Información Gerencial (MIS). Incluya ejemplos.',
        placeholder: 'Escriba su respuesta aquí. Incluya las características de cada sistema y al menos un ejemplo de cada uno...',
        rubric: 'TPS: transacciones diarias, nivel operativo, ejemplo POS. MIS: reportes gerenciales, nivel táctico, ejemplo dashboards.'
    },
    {
        id: 7,
        section: 'B',
        sectionTitle: 'Preguntas de Desarrollo',
        type: 'development',
        points: 2.5,
        text: 'Describa tres técnicas de recopilación de información y cuándo es apropiado usar cada una.',
        placeholder: 'Mencione tres técnicas y explique cuándo es apropiado usar cada una...',
        rubric: 'Entrevistas (pocos stakeholders), Cuestionarios (muchas personas), Observación directa (procesos reales).'
    },

    // === SECCIÓN C: EJERCICIO PRÁCTICO - 5 puntos ===
    {
        id: 8,
        section: 'C',
        sectionTitle: 'Ejercicio Práctico - DFD',
        type: 'development',
        points: 5,
        text: 'Dado el caso de una clínica dental que necesita un sistema para gestionar citas:\n\n• Los pacientes solicitan citas\n• El sistema verifica disponibilidad y registra la cita\n• Envía confirmación al paciente\n• El dentista consulta su agenda diaria\n• Al finalizar, se genera factura\n\nEnumere: las entidades externas, el proceso central y al menos 3 flujos de datos para un DFD de Contexto.',
        placeholder: 'Entidades externas:\n1. ...\n2. ...\n\nProceso central:\n...\n\nFlujos de datos:\n1. ...\n2. ...\n3. ...',
        rubric: 'Entidades: Paciente, Dentista. Proceso: Sistema Gestión Citas. Flujos: Solicitud cita, Confirmación, Consulta agenda, Agenda diaria, Factura.'
    },

    // === SECCIÓN D: CONCEPTOS DE DISEÑO (Avanzado) - 4 puntos ===
    {
        id: 9,
        section: 'D',
        sectionTitle: 'Conceptos de Diseño - Avanzado',
        type: 'multiple-choice',
        points: 1,
        text: '¿Qué principio de diseño se viola cuando un módulo realiza múltiples funciones no relacionadas?',
        choices: [
            { id: 'a', text: 'Bajo acoplamiento' },
            { id: 'b', text: 'Alta cohesión' },
            { id: 'c', text: 'Encapsulamiento' },
            { id: 'd', text: 'Abstracción' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 10,
        section: 'D',
        sectionTitle: 'Conceptos de Diseño - Avanzado',
        type: 'multiple-choice',
        points: 1,
        text: 'En el modelo Entidad-Relación, una cardinalidad M:N indica que:',
        choices: [
            { id: 'a', text: 'Una entidad se relaciona con exactamente una de otra' },
            { id: 'b', text: 'Múltiples instancias de ambas entidades pueden relacionarse entre sí' },
            { id: 'c', text: 'La relación es opcional en ambos lados' },
            { id: 'd', text: 'Se requiere una entidad débil' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 11,
        section: 'D',
        sectionTitle: 'Conceptos de Diseño - Avanzado',
        type: 'development',
        points: 2,
        text: 'Explique la diferencia entre la arquitectura de 2 capas y 3 capas. ¿Cuándo es preferible usar cada una?',
        placeholder: 'Arquitectura 2 capas:\n...\n\nArquitectura 3 capas:\n...\n\nCuándo usar cada una:\n...',
        rubric: '2 capas: Cliente + Servidor, apps pequeñas. 3 capas: Presentación + Lógica + Datos, apps empresariales.'
    },

    // === SECCIÓN E: DISEÑO DE BASE DE DATOS - 3 puntos ===
    {
        id: 12,
        section: 'E',
        sectionTitle: 'Diseño de Base de Datos',
        type: 'development',
        points: 3,
        text: 'Normalice la siguiente tabla hasta 3FN:\n\nPEDIDO(id_pedido, fecha, cliente_nombre, cliente_direccion, producto1_nombre, producto1_precio, producto1_cantidad, producto2_nombre, producto2_precio, producto2_cantidad, total)\n\nListe las tablas resultantes con sus atributos.',
        placeholder: 'Tablas resultantes:\n\n1FN:\n...\n\n2FN:\n...\n\n3FN (Tablas finales):\n- TABLA1(...)\n- TABLA2(...)\n- ...',
        rubric: 'CLIENTE(id, nombre, direccion), PRODUCTO(id, nombre, precio), PEDIDO(id, fecha, id_cliente), DETALLE_PEDIDO(id, id_pedido, id_producto, cantidad).'
    },

    // === SECCIÓN F: DISEÑO DE INTERFACES - 3 puntos ===
    {
        id: 13,
        section: 'F',
        sectionTitle: 'Diseño de Interfaces',
        type: 'development',
        points: 3,
        text: 'Liste y explique 4 de las 10 heurísticas de usabilidad de Nielsen y cómo aplicarlas en un formulario de registro de usuario.',
        placeholder: 'Heurística 1:\n- Nombre: ...\n- Aplicación: ...\n\nHeurística 2:\n...\n\nHeurística 3:\n...\n\nHeurística 4:\n...',
        rubric: 'Visibilidad estado (indicador progreso), Correspondencia mundo real (etiquetas claras), Control libertad (botón cancelar), Prevención errores (validación tiempo real).'
    },

    // === SECCIÓN G: EMPAREJAMIENTO - 4 puntos ===
    {
        id: 14,
        section: 'G',
        sectionTitle: 'Emparejamiento de Conceptos',
        type: 'matching',
        points: 4,
        text: 'Relacione cada concepto de Teoría General de Sistemas con su definición correcta. Arrastre los conceptos hacia la definición correspondiente.',
        matchingPairs: [
            { 
                id: 'm1', 
                concept: 'Caja Negra', 
                definition: 'Se conocen las entradas y salidas pero no el proceso interno.' 
            },
            { 
                id: 'm2', 
                concept: 'Sinergia', 
                definition: 'El todo es mayor que la suma de sus partes.' 
            },
            { 
                id: 'm3', 
                concept: 'Homeostasis', 
                definition: 'Capacidad de un sistema para mantener el equilibrio.' 
            },
            { 
                id: 'm4', 
                concept: 'Equifinalidad', 
                definition: 'Llegar al mismo estado final por diferentes caminos.' 
            }
        ]
    }
];

// Calcular total de puntos
const TOTAL_POINTS = QUESTIONS.reduce((sum, q) => sum + q.points, 0);

// Obtener preguntas por sección
function getQuestionsBySection(section) {
    return QUESTIONS.filter(q => q.section === section);
}

// Obtener pregunta por ID
function getQuestionById(id) {
    return QUESTIONS.find(q => q.id === id);
}
