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
  name: "apuesta_caballos",
  description: "Apuesta en una carrera de caballos y gana monedas.",
  commands: ["apuesta"],
  usage: `${PREFIX}apuesta <caballo>`,
  handle: async ({ sendReply, sendReact, userJid, args }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de apuestas de caballos está desactivado.");
      return;
    }

    const validHorses = ["a", "b", "c"];
    const selectedHorse = args[0]?.toLowerCase(); // Convertimos el argumento a minúsculas

    // Si el usuario no elige un caballo
    if (!selectedHorse) {
      await sendReply(
        "🏇 Elige un caballo para apostar:\n\n" +
          `➡️ *${PREFIX}apuesta a*\n` +
          `➡️ *${PREFIX}apuesta b*\n` +
          `➡️ *${PREFIX}apuesta c*\n\n` +
          "💰 La apuesta cuesta *10 monedas*."
      );
      return;
    }

    if (!validHorses.includes(selectedHorse)) {
      await sendReply("❌ Opción inválida. Debes elegir entre: *a, b o c*.");
      return;
    }

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    if (userKr.kr < 10) {
      await sendReply("❌ No tienes suficientes monedas para apostar. Necesitas al menos 10.");
      return;
    }

    // Restar la apuesta de 10 monedas
    userKr.kr -= 10;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await sendReact("🏇"); // Empezamos con una reacción
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("💨"); // Reacción de carrera
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("🏁"); // Reacción de meta

    const winner = Math.floor(Math.random() * 3) + 1;
    let resultMessage;
    let ganancia = 0;

    if (selectedHorse === validHorses[winner - 1]) {
      ganancia = 15;
      userKr.kr += 10 + ganancia;
      resultMessage = `🎉 ¡Tu caballo *${selectedHorse.toUpperCase()}* ganó!\n\n> Has ganado *${ganancia} monedas*.`;
    } else if (Math.abs(validHorses.indexOf(selectedHorse) - winner) === 1) {
      resultMessage = `😐 Tu caballo *${selectedHorse.toUpperCase()}* quedó en segundo lugar.\n\n> No ganaste ni perdiste monedas.`;
      userKr.kr += 10; // Se le devuelve la apuesta
    } else {
      resultMessage = `❌ Tu caballo *${selectedHorse.toUpperCase()}* perdió la carrera.\n\n> Has perdido *10 monedas*.`;
    }

    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(resultMessage);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(`> 💰 Tu saldo es *${userKr.kr} monedas* $k`);
  },
};