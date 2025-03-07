const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Función para ejecutar comandos de forma eficiente
const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
};

module.exports = {
  name: "sticker",
  description: "Faço figurinhas de imagem/gif/vídeo",
  commands: ["s", "sticker", "fig", "f"],
  usage: `${PREFIX}sticker (etiqueta imagen/gif/vídeo) o ${PREFIX}sticker (responde a imagen/gif/vídeo)`,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendSuccessReact,
    sendStickerFromFile,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        "👻 Krampus 👻 Debes marcar imagen/gif/vídeo o responder a una imagen/gif/vídeo"
      );
    }

    const outputPath = path.resolve(TEMP_DIR, "output.webp");

    try {
      if (isImage) {
        const inputPath = await downloadImage(webMessage, "input");

        // Comando optimizado para imágenes
        const command = `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -qscale 100 ${outputPath}`;
        await execPromise(command);

        await sendSuccessReact();
        await sendStickerFromFile(outputPath);

        // Eliminar archivos después del uso
        fs.unlink(inputPath, () => {});
        fs.unlink(outputPath, () => {});
      } else {
        const inputPath = await downloadVideo(webMessage, "input");

        const maxDuration = 10; // Tiempo máximo en segundos
        const videoSeconds =
          webMessage.message?.videoMessage?.seconds ||
          webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.videoMessage?.seconds;

        if (videoSeconds > maxDuration) {
          fs.unlink(inputPath, () => {});
          await sendErrorReply(
            `👻 Krampus 👻 Este video tiene más de ${maxDuration} segundos! Envia un video más corto!`
          );
          return;
        }

        // Comando optimizado para videos
        const command = `ffmpeg -i ${inputPath} -y -vcodec libwebp -preset fast -loop 0 -fs 0.99M -filter_complex "[0:v] scale=512:512:force_original_aspect_ratio=decrease,fps=10,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`;
        await execPromise(command);

        await sendSuccessReact();
        await sendStickerFromFile(outputPath);

        // Eliminar archivos después del uso
        fs.unlink(inputPath, () => {});
        fs.unlink(outputPath, () => {});
      }
    } catch (error) {
      console.error("Error al crear sticker:", error);
      await sendErrorReply("👻 Krampus 👻 Hubo un error al procesar el sticker.");
    }
  },
};