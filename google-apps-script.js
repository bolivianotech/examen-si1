// ============================================
// GOOGLE APPS SCRIPT - SUBIDA DE EXÁMENES A DRIVE
// Universidad Privada Domingo Savio - UPDS
// Sistemas de Información I
// Docente: Ing. M.Sc. Jimmy Nataniel Requena Llorentty
// ============================================
//
// INSTRUCCIONES DE USO:
// 1. Ve a https://script.google.com y crea un nuevo proyecto
// 2. Copia TODO este código y pégalo
// 3. Reemplaza 'TU_FOLDER_ID_AQUI' con el ID de tu carpeta de Drive
// 4. Despliega como "Aplicación web" con acceso "Cualquier usuario"
// 5. Copia la URL que termina en /exec y pégala en config.js
//
// ============================================

// ⚠️ IMPORTANTE: Reemplaza este ID con el de tu carpeta de Google Drive
// Para obtener el ID:
// 1. Abre la carpeta en Google Drive
// 2. Mira la URL: drive.google.com/drive/folders/ESTE_ES_EL_ID
// 3. Copia ese ID y pégalo aquí abajo
const FOLDER_ID = 'TU_FOLDER_ID_AQUI';

/**
 * Maneja las solicitudes POST (subida de archivos)
 */
function doPost(e) {
  try {
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    
    // Extraer información
    const studentName = sanitizeFilename(data.studentName || 'Estudiante');
    const studentCI = sanitizeFilename(data.studentCI || 'SinCI');
    const originalFileName = data.fileName || 'examen.pdf';
    const fileData = data.fileData;
    
    // Validar que hay datos
    if (!fileData) {
      throw new Error('No se recibieron datos del archivo');
    }
    
    // Crear nombre de archivo único con fecha
    const timestamp = Utilities.formatDate(new Date(), 'America/La_Paz', 'yyyy-MM-dd_HH-mm');
    const newFileName = `${studentName}_${studentCI}_${timestamp}.pdf`;
    
    // Decodificar el archivo base64
    const decodedFile = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(decodedFile, 'application/pdf', newFileName);
    
    // Obtener la carpeta de destino
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Crear el archivo en Drive
    const file = folder.createFile(blob);
    
    // Agregar descripción al archivo
    file.setDescription(`Examen de: ${studentName}\nCI: ${studentCI}\nSubido: ${timestamp}`);
    
    // Log para depuración
    console.log(`✅ Archivo subido exitosamente: ${file.getName()}`);
    console.log(`   Estudiante: ${studentName}`);
    console.log(`   CI: ${studentCI}`);
    console.log(`   ID del archivo: ${file.getId()}`);
    
    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Archivo subido correctamente',
        fileId: file.getId(),
        fileName: file.getName(),
        fileUrl: file.getUrl()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log del error
    console.error('❌ Error al procesar archivo:', error);
    
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Maneja las solicitudes GET (verificación del servicio)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Servicio de subida de exámenes UPDS activo',
      version: '1.0',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Limpia el nombre de archivo para evitar caracteres problemáticos
 */
function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}

/**
 * Función de prueba (ejecutar manualmente para verificar permisos)
 */
function testPermissions() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    console.log('✅ Conexión exitosa a la carpeta: ' + folder.getName());
    console.log('   ID: ' + folder.getId());
    console.log('   URL: ' + folder.getUrl());
    return true;
  } catch (error) {
    console.error('❌ Error de permisos: ' + error);
    console.error('   Verifica que el FOLDER_ID sea correcto');
    return false;
  }
}
