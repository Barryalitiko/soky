const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");
const { investmentIntervals } = require("./invertir");

const investmentFilePath = path.resolve(process.cwd(), "assets/investment.json");
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
  name: "retirar",
  description: "Retirar tu inversión antes de que termine el tiempo.",
  commands: ["retirar"],
  usage: `${PREFIX}retirar`,
  handle: async ({ sendReply, userJid }) => {
    let investmentStatus = readData(investmentFilePath);
    if (!investmentStatus[userJid]) {
      return sendReply("❌ No tienes ninguna inversión activa para retirar.");
    }

    if (investmentIntervals[userJid]) {
      clearInterval(investmentIntervals[userJid]);
      delete investmentIntervals[userJid];
    }

    const userInvestment = investmentStatus[userJid];
    const tiempoTranscurrido = Math.floor((Date.now() - userInvestment.tiempoInicio) / 60000);

    let gananciaOpcion = 0;
    if (tiempoTranscurrido > 0) {
      gananciaOpcion = Math.floor((userInvestment.saldoInvertido * userInvestment.porcentaje) / 100);
    }

    const saldoFinal = userInvestment.saldoInvertido + gananciaOpcion;

    delete investmentStatus[userJid];
    writeData(investmentFilePath, investmentStatus);

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (userKr) {
      userKr.kr += saldoFinal;
      krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
      writeData(krFilePath, krData);
    }

    const estadoInversion = gananciaOpcion > 0
      ? `¡Has ganado ${gananciaOpcion} monedas!`
      : gananciaOpcion < 0
      ? `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`
      : `No ha pasado suficiente tiempo, por lo que no has generado ni perdido nada.`;

    await sendReply(`💼 ¡Has retirado tu inversión de *${userInvestment.empresa}*!\n\n${estadoInversion}\n> Lo generado es: ${saldoFinal} monedas.\n\n¡Buena suerte con el siguiente negocio!\n> Krampus OM bot`);
  },
};