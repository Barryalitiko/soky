const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { exec } = require("child_process");

module.exports = {
  name: "sticker",
  description: "Crea stickers de imagen/gif/vídeo",
  commands: ["s", "sticker"],
  usage: `${PREFIX}sticker (etiqueta imagen/gif/vídeo) o ${PREFIX}sticker (responde a imagen/gif/vídeo)`,
  handle: async ({
    socket,
    remoteJid,
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendErrorReply,
    sendPuzzleReact,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        "ummm...Debes indicarme lo que quieres que convierta a sticker\n> Krampus OM bot"
      );
    }

    const outputPath = path.resolve(TEMP_DIR, "output.webp");

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");

      // Convertir imagen a WebP con sharp
      await sharp(inputPath)
        .resize(512, 512, { fit: "contain" })
        .toFormat("webp")
        .toFile(outputPath);

      fs.unlinkSync(inputPath);

      await sendPuzzleReact();
      await socket.sendMessage(remoteJid, { sticker: fs.readFileSync(outputPath) });

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

      await sendPuzzleReact();

      // Convertir video a sticker (webp animado) con ffmpeg
      exec(
        `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -loop 0 -preset default -an -vsync 0 -s 512:512 ${outputPath}`,
        async (error) => {
          fs.unlinkSync(inputPath);
          if (error) {
            await sendErrorReply("Ocurrió un error al convertir el video a sticker.");
            return;
          }

          await socket.sendMessage(remoteJid, { sticker: fs.readFileSync(outputPath) });

          fs.unlinkSync(outputPath);
        }
      );
    }
  },
};