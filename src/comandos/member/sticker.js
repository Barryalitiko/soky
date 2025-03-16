const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
  name: "sticker",
  description: "Faço figurinhas de imagen/gif/vídeo",
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

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");

      const sticker = new Sticker(inputPath, {
        pack: "Krampus Pack",
        author: "Krampus Bot",
        type: StickerTypes.FULL, // Opciones: CIRCLE, CROP, FULL
        quality: 70, // Calidad del sticker (1-100)
      });

      await sticker.toFile(outputPath);
      await sendSuccessReact();
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
          `👻 Krampus 👻 Este video tiene más de ${sizeInSeconds} segundos! Envía un video más corto!`
        );
        return;
      }

      const command = `ffmpeg -i ${inputPath} -y -vcodec libwebp -loop 0 -fs 0.99M -filter_complex "[0:v] scale=512:512:force_original_aspect_ratio=decrease,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -f webp ${outputPath}`;

      exec(command, async (error) => {
        if (error) {
          console.log(error);
          fs.unlinkSync(inputPath);
          throw new Error(error);
        }

        await sendSuccessReact();
        await sendStickerFromFile(outputPath);

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    }
  },
};