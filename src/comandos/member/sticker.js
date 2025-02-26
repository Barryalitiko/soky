Aquí está el script completo con las modificaciones que te mencioné anteriormente:

const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

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
"Indicame que quieres convertir a sticker\n> Krampus OM bot"
);
}

const outputPath = path.resolve(TEMP_DIR, "output.webp");

if (isImage) {
  const inputPath = await downloadImage(webMessage, "input");
  exec(
    `ffmpeg -i "${inputPath}" -vf scale=512:-1 "${outputPath}"`,
    async (error) => {
      if (error) {
        console.log(error);
        fs.unlinkSync(inputPath);
        throw new Error(error);
      }
      await sendSuccessReact();
      await sendStickerFromFile(outputPath);
      fs.unlinkSync(inputPath);
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
  const haveSecondsRule = seconds <= sizeInSeconds;

  if (!haveSecondsRule) {
    fs.unlinkSync(inputPath);
    await sendErrorReply(
      `Este video tiene más de ${sizeInSeconds} segundos! Envia un video más corto!`
    );
    return;
  }

  exec(
    `ffmpeg -i "${inputPath}" -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:-1,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp "${outputPath}"`,
    async (error) => {
      if (error) {
        console.log(error);
        fs.unlinkSync(inputPath);
        throw new Error(error);
      }
      await sendSuccessReact();
      await sendStickerFromFile(outputPath);
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }
  );
}
},
};