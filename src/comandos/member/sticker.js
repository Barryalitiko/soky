const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
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
  exec(
    `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease" -q:v 80 ${outputPath}`,
    async (error) => {
      fs.unlinkSync(inputPath);
      if (error) {
        await sendErrorReply("Ocurrió un error al convertir la imagen a sticker.");
        return;
      }
      await sendPuzzleReact();
      await socket.sendMessage(remoteJid, {
        sticker: {
          url: outputPath,
        },
      });
      fs.unlinkSync(outputPath);
    }
  );
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
  exec(
    `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,fps=10" -loop 0 -preset default -an -vsync 0 ${outputPath}`,
    async (error) => {
      fs.unlinkSync(inputPath);
      if (error) {
        await sendErrorReply("Ocurrió un error al convertir el video a sticker.");
        return;
      }
      await socket.sendMessage(remoteJid, {
        sticker: {
          url: outputPath,
        },
      });
      fs.unlinkSync(outputPath);
    }
  );
}
},
};