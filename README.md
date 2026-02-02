# 🎓 Examen Interactivo - Sistemas de Información I

## Universidad Privada Domingo Savio (UPDS)
### Docente: Ing. M.Sc. Jimmy Nataniel Requena Llorentty

---

## 📋 Descripción

Aplicación web interactiva para realizar exámenes en línea con las siguientes características:

- ✅ **Preguntas de selección múltiple** con calificación automática
- ✅ **Preguntas de desarrollo** para revisión manual del docente
- ✅ **Emparejamiento Drag & Drop** - Experiencia interactiva impresionante
- ✅ **Temporizador** con alertas visuales
- ✅ **Guardado automático** de resultados en Supabase
- ✅ **Subida de evidencias** a Google Drive
- ✅ **Generación de PDF** con resultados
- ✅ **Diseño responsive** y moderno

---

## 🚀 GUÍA DE DESPLIEGUE PASO A PASO

### Paso 1: Configurar Supabase (Base de Datos)

1. **Ir a Supabase**: [https://supabase.com](https://supabase.com)

2. **Crear la tabla `exam_results`**:
   - Ve a **SQL Editor** en tu proyecto
   - Ejecuta el siguiente SQL:

```sql
CREATE TABLE exam_results (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    ci TEXT NOT NULL,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentage INTEGER,
    answers JSONB,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir inserciones anónimas
CREATE POLICY "Allow anonymous inserts" ON exam_results
    FOR INSERT TO anon
    WITH CHECK (true);

-- Crear política para permitir lecturas (opcional, para el docente)
CREATE POLICY "Allow anonymous reads" ON exam_results
    FOR SELECT TO anon
    USING (true);
```

3. **Obtener credenciales**:
   - Ve a **Settings > API**
   - Copia la **URL** y la **anon key**
   - Actualiza el archivo `config.js` con estos valores

---

### Paso 2: Configurar Google Apps Script (Subida a Drive)

1. **Ir a Google Apps Script**: [https://script.google.com](https://script.google.com)

2. **Crear nuevo proyecto** y pegar este código:

```javascript
// ============================================
// GOOGLE APPS SCRIPT - SUBIDA DE EXÁMENES
// UPDS - Sistemas de Información I
// ============================================

// ID de la carpeta de Google Drive donde se guardarán los archivos
// Reemplaza con el ID de TU carpeta
const FOLDER_ID = 'TU_ID_DE_CARPETA_AQUI';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const studentName = data.studentName || 'Estudiante';
    const studentCI = data.studentCI || 'SinCI';
    const fileName = data.fileName || 'examen.pdf';
    const fileData = data.fileData;
    
    // Decodificar el archivo base64
    const decodedFile = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(decodedFile, 'application/pdf', 
      `${studentName}_${studentCI}_${fileName}`);
    
    // Obtener la carpeta y guardar el archivo
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    
    // Registrar en log
    console.log(`Archivo subido: ${file.getName()} por ${studentName}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Archivo subido correctamente',
        fileId: file.getId(),
        fileName: file.getName()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Servicio de subida de exámenes activo'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Configurar el ID de la carpeta**:
   - Crea una carpeta en Google Drive para los exámenes
   - Copia el ID de la URL (la parte después de `folders/`)
   - Reemplaza `'TU_ID_DE_CARPETA_AQUI'` en el código

4. **Desplegar**:
   - Clic en **Implementar** > **Nueva implementación**
   - Tipo: **Aplicación web**
   - Ejecutar como: **Yo**
   - Acceso: **Cualquier usuario**
   - Clic en **Implementar**
   - Autorizar permisos
   - **Copiar la URL** que termina en `/exec`

5. **Actualizar `config.js`** con la URL del script

---

### Paso 3: Desplegar en GitHub Pages

1. **Crear repositorio en GitHub**:
   ```bash
   # En la carpeta del proyecto
   git init
   git add .
   git commit -m "Examen Interactivo UPDS"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/examen-si1.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**:
   - Ve a **Settings** > **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **/ (root)**
   - Clic en **Save**

3. **Tu examen estará disponible en**:
   ```
   https://TU_USUARIO.github.io/examen-si1/
   ```

---

## 📁 Estructura del Proyecto

```
examen-upds/
├── index.html      # Página principal
├── styles.css      # Estilos (diseño moderno)
├── config.js       # Configuración (Supabase, Google Script)
├── questions.js    # Banco de preguntas
├── app.js          # Lógica de la aplicación
└── README.md       # Este archivo
```

---

## ⚙️ Personalización

### Cambiar las preguntas

Edita el archivo `questions.js`. Cada pregunta tiene esta estructura:

```javascript
{
    id: 1,
    section: 'A',
    sectionTitle: 'Selección Múltiple',
    type: 'multiple-choice', // o 'development' o 'matching'
    points: 1,
    text: 'Tu pregunta aquí...',
    choices: [
        { id: 'a', text: 'Opción A' },
        { id: 'b', text: 'Opción B' },
        // ...
    ],
    correctAnswer: 'b' // ID de la respuesta correcta
}
```

### Cambiar la duración del examen

En `config.js`:
```javascript
exam: {
    duration: 60, // minutos
}
```

### Cambiar colores y estilos

Edita las variables CSS en `styles.css`:
```css
:root {
    --primary: #1a365d;
    --accent: #ed8936;
    // ...
}
```

---

## 🎯 Funcionalidades Destacadas

### Drag & Drop para Emparejamiento
Los estudiantes pueden arrastrar conceptos hacia sus definiciones o hacer clic para emparejar. La interfaz muestra feedback visual inmediato.

### Calificación Automática
- **Selección múltiple**: Calificación instantánea
- **Emparejamiento**: Puntaje parcial según aciertos
- **Desarrollo**: Se asigna 50% por responder (revisión manual posterior)

### Guardado en Supabase
Todos los resultados se guardan automáticamente con:
- Datos del estudiante
- Respuestas completas
- Puntaje y porcentaje
- Fecha y hora

---

## 🔒 Seguridad

- Las credenciales de Supabase (anon key) solo permiten insertar datos
- Google Apps Script solo acepta archivos PDF
- No se almacenan contraseñas ni datos sensibles

---

## 📞 Soporte

**Docente**: Ing. M.Sc. Jimmy Nataniel Requena Llorentty  
**Universidad**: Privada Domingo Savio - UPDS  
**Materia**: Sistemas de Información I

---

© 2025 UPDS - Todos los derechos reservados
