const { PREFIX } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const fs = require("fs");
const path = require("path");

module.exports = {
name: "sticker",
description: "Convierte imágenes o videos en stickers",
commands: ["s", "sticker"],
usage: `${PREFIX}sticker (responde a imagen/gif/vídeo)`,
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
throw new InvalidParameterError("Debes responder a una imagen, GIF o video.");
}
const tempPath = path.resolve(process.cwd(), "assets/temp");
if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });
const filePath = path.join(tempPath, `sticker_${Date.now()}.webp`);
let buffer;
if (isImage) {
buffer = await downloadImage(webMessage, "sticker_input");
} else {
buffer = await downloadVideo(webMessage, "sticker_input");
}
fs.writeFileSync(filePath, buffer);
await sendPuzzleReact();
await socket.sendMessage(remoteJid, { sticker: fs.readFileSync(filePath) });
fs.unlinkSync(filePath);
},
};