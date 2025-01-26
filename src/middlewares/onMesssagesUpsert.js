const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { createWriteStream } = require("fs");
const path = require("path");

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages.length) {
    return;
  }

  for (const webMessage of messages) {
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    if (!commonFunctions) {
      continue;
    }

    // Detectar el tipo de mensaje (imagen, video, etc.)
    const messageType = commonFunctions.webMessage.message 
      ? Object.keys(commonFunctions.webMessage.message)[0] 
      : null;

    if (["imageMessage", "videoMessage"].includes(messageType)) {
      try {
        const mediaType = messageType === "imageMessage" ? "image" : "video";
        const tempFileName = `temp_${Date.now()}.${mediaType === "image" ? "jpeg" : "mp4"}`;
        const tempFilePath = path.join(__dirname, "../temp", tempFileName);

        // Descargar el archivo de medios
        const stream = await downloadMediaMessage(
          webMessage,
          "stream",
          {},
          {
            logger: console, // Log para monitorear
            reuploadRequest: socket.updateMediaMessage, // Re-subir si es necesario
          }
        );

        // Guardar el archivo en la carpeta temporal
        const writeStream = createWriteStream(tempFilePath);
        stream.pipe(writeStream);

        await new Promise((resolve, reject) => {
          writeStream.on("finish", resolve);
          writeStream.on("error", reject);
        });

        console.log(`Archivo ${mediaType} descargado y guardado en: ${tempFilePath}`);

        // Agregar lógica adicional según sea necesario (ejemplo: enviar al comando de sticker)
        commonFunctions.tempFilePath = tempFilePath;
        commonFunctions.mediaType = mediaType;
      } catch (error) {
        console.error("Error al descargar el archivo de medios:", error);
        continue;
      }
    }

    // Ejecutar el comando dinámico
    await dynamicCommand(commonFunctions);
  }
};