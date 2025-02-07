const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

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
const imageBuffer = await sharp(inputPath)
.webp()
.toBuffer();
await sendPuzzleReact();
await socket.sendMessage(remoteJid, { sticker: imageBuffer });
fs.unlinkSync(inputPath);
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
const videoBuffer = await sharp(inputPath)
.webp()
.toBuffer();
await sendPuzzleReact();
await socket.sendMessage(remoteJid, { sticker: videoBuffer });
fs.unlinkSync(inputPath);
}
},
};