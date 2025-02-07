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
isImage,
isVideo,
downloadImage,
downloadVideo,
webMessage,
sendReply,
sendImageFromFile,
}) => {
if (!isImage) {
throw new InvalidParameterError(
"ummm...Debes indicarme la imagen que quieres que envíe > Krampus OM bot"
);
}

const inputPath = await downloadImage(webMessage, "input");
const imageBuffer = fs.readFileSync(inputPath);

await sendReply("", { react: "" });
await sendImageFromFile(inputPath);

fs.unlinkSync(inputPath);
},
};

