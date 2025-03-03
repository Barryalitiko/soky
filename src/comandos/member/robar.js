const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const usageStatsFilePath = path.resolve(process.cwd(), "assets/usageStats.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

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
  name: "robar",
  description: "Intenta robar monedas a otro usuario con una tasa de éxito del 30%.",
  commands: ["robar"],
  usage: `${PREFIX}robar @usuario`,
  handle: async ({ sendReply, sendReact, userJid, args }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de robar monedas está desactivado.");
      return;
    }

    const usageStats = readData(usageStatsFilePath);
    const userStats = usageStats.users?.[userJid] || { lastRobbed: null };

    // Verificar si ya han pasado 2 horas desde el último robo
    if (userStats.lastRobbed && Date.now() - userStats.lastRobbed < 2 * 60 * 60 * 1000) {
      await sendReply("❌ Solo puedes robar una vez cada 2 horas.");
      return;
    }

    // Obtener el usuario objetivo
    const targetUser = args[0];
    if (!targetUser) {
      await sendReply("❌ Debes mencionar a un usuario para intentar robarle.");
      return;
    }

    const krData = readData(krFilePath);
    const targetUserKr = krData.find(entry => entry.userJid === targetUser);
    const userKr = krData.find(entry => entry.userJid === userJid);

    // Verificar si el usuario objetivo tiene monedas
    if (!targetUserKr || targetUserKr.kr <= 0) {
      await sendReply("❌ El usuario que intentas robar no tiene monedas.");
      return;
    }

    // Verificar si el usuario tiene monedas para robar
    if (!userKr || userKr.kr <= 0) {
      await sendReply("❌ No tienes suficientes monedas para intentar robar.");
      return;
    }

    // Calcular la cantidad a robar
    const amountToSteal = Math.floor(targetUserKr.kr * 0.15); // 15% de las monedas del objetivo

    // Tasa de éxito del 30%
    const success = Math.random() < 0.30;
    let resultMessage;

    if (success) {
      // Éxito en el robo
      userKr.kr += amountToSteal;
      targetUserKr.kr -= amountToSteal;

      // Actualizar los datos de los usuarios
      krData.forEach(entry => {
        if (entry.userJid === userJid) entry.kr = userKr.kr;
        if (entry.userJid === targetUser) entry.kr = targetUserKr.kr;
      });
      writeData(krFilePath, krData);

      // Actualizar la hora del último robo
      userStats.lastRobbed = Date.now();
      usageStats.users[userJid] = userStats;
      writeData(usageStatsFilePath, usageStats);

      resultMessage = `🎉 ¡Has robado con éxito *${amountToSteal} monedas* a ${targetUser}!\n> Tu saldo actual es *${userKr.kr} monedas* 𝙺𝚛.`;
    } else {
      // Fracaso en el robo
      resultMessage = `❌ El robo a ${targetUser} ha fallado.\n> Tu saldo sigue siendo *${userKr.kr} monedas* 𝙺𝚛.`;
    }

    await sendReply(resultMessage);
  },
};