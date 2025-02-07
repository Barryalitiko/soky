const { PREFIX } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "sticker",
  description: "Convierte imágenes o videos en stickers",
  commands: ["s", "sticker"],
  usage: `${PREFIX}sticker (responde a imagen/gif/vídeo)`,
  handle: async ({ socket, remoteJid, isImage, isVideo, downloadImage, downloadVideo, webMessage, sendErrorReply, sendPuzzleReact }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError("Debes responder a una imagen, GIF o video.");
    }

    const tempPath = path.resolve(__dirname, "../../assets/temp");
    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });

    const filePath = path.join(tempPath, `sticker_${Date.now()}.webp`);

    let buffer;
    if (isImage) {
      buffer = fs.readFileSync(await downloadImage(webMessage, "sticker_input"));
    } else {
      buffer = fs.readFileSync(await downloadVideo(webMessage, "sticker_input"));
    }

    // Enviar el sticker directamente con Baileys
    await sendPuzzleReact();
    await socket.sendMessage(remoteJid, { sticker: buffer });

    // Eliminar archivos temporales después de enviarlo
    fs.unlinkSync(filePath);
  },
};