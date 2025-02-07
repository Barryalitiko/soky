const { PREFIX, TEMP_DIR } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const path = require("path");
const fs = require("fs");

module.exports = {
name: "imagen",
description: "Envía la imagen indicada",
commands: ["i", "imagen"],
usage: `${PREFIX}imagen (etiqueta imagen)`,
handle: async ({
socket,
remoteJid,
isImage,
downloadImage,
webMessage,
sendErrorReply,
}) => {
console.log("Ejecutando comando imagen");

if (!isImage) {
  console.log("No es imagen");
  throw new InvalidParameterError(
    "ummm...Debes indicarme la imagen que quieres que envíe\n> Krampus OM bot"
  );
}

const inputPath = await downloadImage(webMessage, "input");
console.log("Imagen descargada:", inputPath);
const imageBuffer = fs.readFileSync(inputPath);
console.log("Imagen leída");

await socket.sendMessage(remoteJid, {
  image: imageBuffer,
  caption: "Imagen enviada",
});
console.log("Imagen enviada");

fs.unlinkSync(inputPath);
},
};

Con este comando, en lugar de enviar un sticker, se enviará la imagen original que se indicó. Esto nos permitirá verificar si el comando está procesando correctamente la imagen que se le indica.