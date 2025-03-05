const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

const MARRIAGE_FILE_PATH = path.resolve(process.cwd(), "assets/marriage.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}: ${error.message}`);
  }
};

module.exports = {
  name: "divorce",
  description: "Divorciarte de tu pareja actual.",
  commands: ["divorcio"],
  usage: `${PREFIX}divorce`,
  handle: async ({ sendReply, socket, userJid, remoteJid }) => {
    const marriageData = readData(MARRIAGE_FILE_PATH);

    // Verificar si el usuario está casado
    const marriageIndex = marriageData.findIndex(
      (entry) => entry.userJid === userJid || entry.partnerJid === userJid
    );

    if (marriageIndex === -1) {
      await sendReply("❌ No estás casado actualmente.\n> Krampus OM bot");
      return;
    }

    // Procesar divorcio
    const { userJid: partner1, partnerJid: partner2 } = marriageData[marriageIndex];
    marriageData.splice(marriageIndex, 1); // Eliminar matrimonio
    writeData(MARRIAGE_FILE_PATH, marriageData);

    // Enviar mensaje con menciones
    await socket.sendMessage(remoteJid, {
      text: `📄 *¡Divorcio confirmado!*  
@${partner1.split("@")[0]} y @${partner2.split("@")[0]} ahora están oficialmente divorciados. 💔`,
      mentions: [partner1, partner2]
    });

    // Enviar el GIF de divorcio con el mensaje
    await socket.sendMessage(remoteJid, {
      video: fs.readFileSync("assets/sx/divorcio.mp4"),
      caption: `💔 *El divorcio ha sido procesado* 💔\n@${partner1.split("@")[0]} y @${partner2.split("@")[0]} ahora están separados. ¡Que siga la vida!`,
      gifPlayback: true,
      mentions: [partner1, partner2]
    });
  },
};