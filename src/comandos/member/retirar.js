const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const investmentFilePath = path.resolve(process.cwd(), "assets/investment.json");

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
    const investmentStatus = readData(investmentFilePath);
    const userInvestment = investmentStatus[userJid] || null;

    if (!userInvestment) {
      return sendReply("❌ No tienes ninguna inversión activa para retirar.");
    }

    const gananciaOpcion = (userInvestment.saldoInvertido * userInvestment.porcentaje) / 100;
    const saldoFinal = userInvestment.saldoInvertido + gananciaOpcion;

    // Retirar la inversión y limpiar datos
    delete investmentStatus[userJid];
    writeData(investmentFilePath, investmentStatus);

    const estadoInversion = gananciaOpcion >= 0 ? `¡Has ganado ${gananciaOpcion} monedas!` : `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`;

    await sendReply(`💼 @${userJid} ¡Has retirado tu inversión de *${userInvestment.empresa}*!\n\n${estadoInversion}\nSaldo final: ${saldoFinal} monedas.\n\n¡Buena suerte con el siguiente negocio!`);
  }
};