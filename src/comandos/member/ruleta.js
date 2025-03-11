const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

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
  name: "ruleta",
  description: "Juega a la ruleta y gana o pierde monedas.",
  commands: ["ruleta"],
  usage: `${PREFIX}ruleta`,
  handle: async ({ sendReply, sendReact, userJid }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de ruleta está desactivado.");
      return;
    }

    // Leer el saldo de monedas del usuario
    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    // Si el usuario no existe en kr.json, lo agregamos con 0 monedas
    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    // Verificar si el usuario tiene monedas para jugar
    if (userKr.kr <= 0) {
      await sendReply("❌ No tienes monedas suficientes para jugar. Gana monedas antes de intentarlo.");
      return;
    }

    await sendReply("🏹 Probando tu suerte...");
    await sendReact("💨");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
    await sendReact("🎯");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
    await sendReact("💥");

    const result = Math.random();
    let amount = 0;

    // Aseguramos que las ganancias y pérdidas sean balanceadas
    if (result < 0.2) {
      amount = 100; // Ganancia mayor
    } else if (result < 0.4) {
      amount = 80; // Ganancia media
    } else if (result < 0.6) {
      amount = 30; // Ganancia pequeña
    } else if (result < 0.8) {
      amount = -10; // Pérdida pequeña
    } else {
      amount = -40; // Pérdida media
    }

    userKr.kr += amount;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    if (amount > 0) {
      await sendReply(`🎉 ¡Has ganado ${amount} monedas! 🎉\n💰 Tu saldo actual es ${userKr.kr} 𝙺𝚛`);
    } else {
      await sendReply(`😢 ¡Has perdido ${Math.abs(amount)} monedas! 😢\n💰 Tu saldo actual es ${userKr.kr} 𝙺𝚛`);
    }
  },
};