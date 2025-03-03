const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
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
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8"));
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}: ${error.message}`);
  }
};

module.exports = {
  name: "apuesta_caballos",
  description: "Apuesta en una carrera de caballos y gana monedas.",
  commands: ["apuesta"],
  usage: `${PREFIX}apuesta <a|b|c>`,
  handle: async ({ sendReply, sendReact, userJid, args }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de apuestas de caballos está desactivado.");
      return;
    }

    if (!args[0]) {
      await sendReply("🏇 Elige tu caballo para apostar:\n\n#apuesta a\n#apuesta b\n#apuesta c\n\n💰 La apuesta cuesta 10 monedas.");
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

    // Nombres de los caballos
    const horses = {
      "a": "Gavilán",
      "b": "Relámpago",
      "c": "Tormenta"
    };

    const selectedHorse = args[0]?.toLowerCase();
    if (!horses[selectedHorse]) {
      await sendReply("❌ Opción inválida. Elige un caballo:\n\n#apuesta a\n#apuesta b\n#apuesta c");
      return;
    }

    // Restar la apuesta
    userKr.kr -= 10;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    // Iniciar la carrera
    await sendReact("🏇");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("💨");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReact("🏁");

    const horseList = Object.keys(horses);
    const winnerIndex = Math.floor(Math.random() * horseList.length);
    const winner = horseList[winnerIndex];

    let resultMessage;
    let ganancia = 0;

    if (selectedHorse === winner) {
      ganancia = 15;
      resultMessage = `🎉 ¡Tu caballo *${horses[selectedHorse]}* ganó! Has ganado 15 monedas.`;
    } else {
      resultMessage = `❌ Apostaste por *${horses[selectedHorse]}*, pero perdió la carrera. Has perdido 10 monedas.`;
    }

    userKr.kr += ganancia;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(resultMessage);

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply(`> 💰 Tu saldo es *${userKr.kr} monedas* kr`);
  },
};