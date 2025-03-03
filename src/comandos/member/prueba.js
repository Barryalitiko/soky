const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

module.exports = {
  name: "sticker",
  description: "Faço figurinhas de imagem/gif/vídeo",
  commands: ["kjk"],
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

    const packName = "MiPackDeStickers"; // Nombre del pack
    const authorName = "TuNombre"; // Autor del sticker
    const stickerName = `sticker_${Date.now()}.webp`; // Generamos un nombre único para el sticker
    const outputPath = path.resolve(TEMP_DIR, stickerName);

    if (isImage) {
      const inputPath = await downloadImage(webMessage, "input");

      exec(
        `ffmpeg -i ${inputPath} -vf scale=512:512 -metadata title="${packName}" -metadata artist="${authorName}" ${outputPath}`,
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

      exec(
        `ffmpeg -i ${inputPath} -y -vcodec libwebp -fs 0.99M -filter_complex "[0:v] scale=512:512,fps=12,pad=512:512:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -metadata title="${packName}" -metadata artist="${authorName}" -f webp ${outputPath}`,
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