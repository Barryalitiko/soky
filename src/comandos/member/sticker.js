const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { writeExifImg, writeExifVid } = require("@bochilteam/scraper");

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
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        "ummm...Debes indicarme lo que quieres que convierta a sticker\n> Krampus OM bot"
      );
    }

    const outputPath = path.resolve(TEMP_DIR, "output.webp");

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");
      const imageBuffer = fs.readFileSync(inputPath);

      // Convertir a sticker con metadatos
      const stickerBuffer = await writeExifImg(imageBuffer, {
        packname: "Operacion Marshall",
        author: "Krampus OM bot",
      });

      fs.writeFileSync(outputPath, stickerBuffer);

      await sendPuzzleReact();
      await sendStickerFromFile(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    } else {
      const inputPath = await downloadVideo(webMessage, "input");

      const sizeInSeconds = 10;
      const seconds =
        webMessage.message?.videoMessage?.seconds ||
        webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.videoMessage?.seconds;

      if (seconds > sizeInSeconds) {
        fs.unlinkSync(inputPath);
        await sendErrorReply(
          `¡ABUSADOR! Este video tiene más de ${sizeInSeconds} segundos. Envía un video más corto.`
        );
        return;
      }

      const videoBuffer = fs.readFileSync(inputPath);

      // Convertir a sticker animado con metadatos
      const stickerBuffer = await writeExifVid(videoBuffer, {
        packname: "Operacion Marshall",
        author: "Krampus OM bot",
      });

      fs.writeFileSync(outputPath, stickerBuffer);

      await sendPuzzleReact();
      await sendStickerFromFile(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }
  },
};