const { PREFIX } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "enviar",
  description: "Envía una imagen o vídeo como archivo normal",
  commands: ["enviar", "send"],
  usage: `${PREFIX}enviar (etiqueta imagen/gif/vídeo) o ${PREFIX}enviar (responde a imagen/gif/vídeo)`,
  
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendSuccessReact,
    sendMessage,
  }) => {
    try {
      if (!isImage && !isVideo) {
        throw new InvalidParameterError(
          "Debes marcar la foto/video que se envió en 'ver una sola vez' para reenviarlo.\n\n> Krampus OM bot"
        );
      }

      let inputBuffer;
      let messageType;
      let mimetype;

      if (isImage) {
        inputBuffer = await downloadImage(webMessage);
        messageType = "image";
        mimetype = "image/jpeg";
      } else {
        inputBuffer = await downloadVideo(webMessage);
        messageType = "video";
        mimetype = "video/mp4";
      }

      if (!inputBuffer || inputBuffer.length === 0) {
        throw new Error("No se pudo descargar el archivo correctamente.");
      }

      await sendSuccessReact();

      await sendMessage({
        messageType,
        buffer: inputBuffer,
        mimetype,
      });

    } catch (error) {
      console.error("Error en el comando enviar:", error);
      await sendErrorReply("❌ Hubo un error al procesar el archivo.");
    }
  },
};