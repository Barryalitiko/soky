const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const usageStatsFilePath = path.resolve(process.cwd(), "assets/usageStats.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");
const ruletaPendienteFilePath = path.resolve(process.cwd(), "assets/ruletaPendiente.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
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
  handle: async ({ sendReply, SendReact, userJid }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de ruleta está desactivado.");
      return;
    }

    const usageStats = readData(usageStatsFilePath);
    const ruletaPendiente = readData(ruletaPendienteFilePath);

    const userStats = usageStats.users?.[userJid] || { attempts: 0 };

    if (userStats.attempts >= 3) {
      await sendReply("❌ Ya has alcanzado el límite de intentos diarios en la ruleta.");
      return;
    }

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    if (userKr.kr <= 0) {
      await sendReply("❌ No tienes monedas suficientes para jugar. Gana monedas antes de intentarlo.");
      return;
    }

    const ahora = Date.now();

    if (ruletaPendiente[userJid] && ahora - ruletaPendiente[userJid].tiempoInicio >= 5000) {
      // **Si el bot se reinició, y el usuario ya había jugado, se le da su recompensa**
      const pagoPendiente = ruletaPendiente[userJid].recompensa;
      userKr.kr += pagoPendiente;
      krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
      writeData(krFilePath, krData);

      delete ruletaPendiente[userJid];
      writeData(ruletaPendienteFilePath, ruletaPendiente);

      await sendReply(`🎯 Tu ruleta anterior se completó tras el reinicio.\n\n> Has recibido ${pagoPendiente} monedas.`);
      await sendReply(`💰 Tu saldo actual es ${userKr.kr} 𝙺𝚛.`);
      return;
    }

    // **Restar intento**
    userStats.attempts += 1;
    usageStats.users = usageStats.users || {};
    usageStats.users[userJid] = userStats;
    writeData(usageStatsFilePath, usageStats);

    // **Enviar reacciones dinámicas en lugar de mensajes**
    await SendReact("⚪");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await SendReact("🔄");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await SendReact("🎯");

    const result = Math.random();
    let amount = 0;

    if (result < 0.25) {
      amount = 1;
    } else if (result < 0.5) {
      amount = 2;
    } else if (result < 0.75) {
      amount = 3;
    } else if (result < 0.875) {
      amount = -2;
    } else {
      amount = -4;
    }

    // **Guardar la jugada en caso de reinicio**
    ruletaPendiente[userJid] = {
      recompensa: amount,
      tiempoInicio: ahora
    };
    writeData(ruletaPendienteFilePath, ruletaPendiente);

    // **Dar la recompensa después de 5 segundos**
    setTimeout(async () => {
      userKr.kr += amount;
      krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
      writeData(krFilePath, krData);

      delete ruletaPendiente[userJid];
      writeData(ruletaPendienteFilePath, ruletaPendiente);

      if (amount > 0) {
        await sendReply(`🎉 ¡Has ganado ${amount} monedas! 🎉`);
      } else {
        await sendReply(`😢 ¡Has perdido ${Math.abs(amount)} monedas! 😢`);
      }

      await sendReply(`💰 Tu saldo actual es ${userKr.kr} 𝙺𝚛.`);
    }, 5000);
  },
};