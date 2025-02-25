const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const MARRIAGE_FILE_PATH = path.resolve(process.cwd(), "assets/marriage.json");
const HEARTS_FILE_PATH = path.resolve(process.cwd(), "assets/hearts.json");

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
  name: "tequiero",
  description: "Expresa amor a tu pareja y mantén una racha diaria.",
  commands: ["tequiero"],
  usage: `${PREFIX}tequiero`,
  handle: async ({ socket, sendReply, userJid, remoteJid }) => {
    let marriageData = readData(MARRIAGE_FILE_PATH);
    let userMarriage = marriageData.find(entry => entry.userJid === userJid || entry.partnerJid === userJid);

    if (!userMarriage) {
      await sendReply("❌ No tienes pareja. Encuentra el amor antes de usar este comando.");
      return;
    }

    let { userJid: partner1, partnerJid: partner2, loveStreak, hearts, lastUsed } = userMarriage;
    let partnerJid = userJid === partner1 ? partner2 : partner1;

    let today = new Date().toISOString().split("T")[0];

    // Si ya se usó el comando hoy, muestra un mensaje
    if (lastUsed === today) {
      await sendReply("💖 Ya expresaste tu amor hoy. Vuelve mañana para mantener la racha.");
      return;
    }

    // Si el comando no se usó ayer, reiniciamos la racha
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastUsed !== yesterdayStr) {
      loveStreak = 1;  // Si no se usó el comando el día anterior, la racha comienza de nuevo
    } else {
      loveStreak += 1;  // Si se usó el comando ayer, sumamos un día a la racha
    }

    hearts += 1;  // Sumar un corazón

    // Actualizar los datos de la pareja
    userMarriage.loveStreak = loveStreak;
    userMarriage.hearts = hearts;
    userMarriage.lastUsed = today;  // Actualizamos la fecha de uso

    writeData(MARRIAGE_FILE_PATH, marriageData);

    // Enviar mensaje al usuario y a la pareja
    let message = `❤️ @${partnerJid.split("@")[0]}, tu pareja @${userJid.split("@")[0]} te ha dicho #tequiero.\n`;
    message += `🔥 Racha de amor: ${loveStreak} días\n💖 Corazones acumulados: ${hearts}\n`;
    message += `No olviden mantener la llama viva cada día.`;

    await socket.sendMessage(remoteJid, { text: message, mentions: [userJid, partnerJid] });
  },
};