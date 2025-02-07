const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");

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
console.log("Ejecutando comando sticker");

if (!isImage && !isVideo) {
  console.log("No es imagen ni video");
  throw new InvalidParameterError(
    "ummm...Debes indicarme lo que quieres que convierta a sticker\n> Krampus OM bot"
  );
}

const outputPath = path.resolve(TEMP_DIR, "output.webp");

if (isImage) {
  console.log("Descargando imagen...");
  const inputPath = await downloadImage(webMessage, "input");
  console.log("Imagen descargada:", inputPath);
  const imageBuffer = fs.readFileSync(inputPath);
  console.log("Imagen leída");
  await sendPuzzleReact();
  console.log("Enviando sticker...");
  await socket.sendMessage(remoteJid, { sticker: imageBuffer });
  console.log("Sticker enviado");
  fs.unlinkSync(inputPath);
} else {
  console.log("Descargando video...");
  const inputPath = await downloadVideo(webMessage, "input");
  console.log("Video descargado:", inputPath);
  const sizeInSeconds = 10;
  const seconds =
    webMessage.message?.videoMessage?.seconds ||
    webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.videoMessage?.seconds;
  if (seconds > sizeInSeconds) {
    console.log("Video demasiado largo");
    fs.unlinkSync(inputPath);
    await sendErrorReply(
      `¡ABUSADOR! Este video tiene más de ${sizeInSeconds} segundos. Envía un video más corto.`
    );
    return;
  }
  const videoBuffer = fs.readFileSync(inputPath);
  console.log("Video leído");
  await sendPuzzleReact();
  console.log("Enviando sticker...");
  await socket.sendMessage(remoteJid, { sticker: videoBuffer });
  console.log("Sticker enviado");
  fs.unlinkSync(inputPath);
}
},
};