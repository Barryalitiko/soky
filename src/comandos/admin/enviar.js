const { PREFIX } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
name: "enviar",
description: "Envía una imagen o vídeo como archivo normal",
commands: ["enviar", "send"],
usage: `${PREFIX}enviar (etiqueta imagen/gif/vídeo) o ${PREFIX}enviar (responde a imagen/gif/vídeo)`,
handle: async ({
isImage,
isVideo,
downloadImage,
downloadVideo,
webMessage,
sendErrorReply,
sendSuccessReact,
sendMessage,
}) => {
if (!isImage && !isVideo) {
throw new InvalidParameterError(
"Debes marcar la foto/video que se envio en ver una sola vez que quieres que reenvie\n\n> Krampus OM bot"
);
}

if (isImage) {
  const inputBuffer = await downloadImage(webMessage);
  await sendSuccessReact();
  await sendMessage(inputBuffer, "image/jpeg");
} else {
  const inputBuffer = await downloadVideo(webMessage);
  await sendSuccessReact();
  await sendMessage(inputBuffer, "video/mp4");
}
},
};

