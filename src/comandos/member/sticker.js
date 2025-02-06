const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
  name: "sticker",
  description: "Crea stickers de imagen/gif/vídeo",
  commands: ["s", "sticker"],
  usage: `${PREFIX}sticker (etiqueta imagen/gif/vídeo) o ${PREFIX}sticker (responde a imagen/gif/vídeo)`,
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendPuzzleReact,
    sendStickerFromFile,
  }) => {
    try {
      if (!isImage && !isVideo) {
        throw new InvalidParameterError(
          "ummm...Debes indicarme lo que quieres que convierta a sticker\n> Krampus OM bot"
        );
      }

      if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
      }

      const outputPath = path.resolve(TEMP_DIR, "output.webp");

      if (isImage) {
        const inputPath = await downloadImage(webMessage, "input");
        const imageBuffer = fs.readFileSync(inputPath);

        // Crear sticker directamente en buffer
        const stickerBuffer = await createSticker(imageBuffer, {
          pack: "Operacion Marshall",
          author: "Krampus OM bot",
          type: StickerTypes.FULL,
        });

        await sendPuzzleReact();
        await sendStickerFromFile(stickerBuffer);

        fs.unlinkSync(inputPath);
      } else {
        const inputPath = await downloadVideo(webMessage, "input");
        const sizeInSeconds = 10;

        const seconds =
          webMessage.message?.videoMessage?.seconds ||
          webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.seconds;

        if (seconds > sizeInSeconds) {
          fs.unlinkSync(inputPath);
          await sendErrorReply(`¡ABUSADOR! Este video tiene más de ${sizeInSeconds} segundos. Envía un video más corto.`);
          return;
        }

        const videoBuffer = fs.readFileSync(inputPath);

        // Crear sticker desde video en buffer
        const stickerBuffer = await createSticker(videoBuffer, {
          pack: "Operacion Marshall",
          author: "Krampus OM bot",
          type: StickerTypes.FULL,
        });

        await sendPuzzleReact();
        await sendStickerFromFile(stickerBuffer);

        fs.unlinkSync(inputPath);
      }
    } catch (error) {
      console.error("Error al crear sticker:", error);
      await sendErrorReply("Hubo un error al crear el sticker. Intenta de nuevo.");
    }
  },
};
