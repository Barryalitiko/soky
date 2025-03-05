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

module.exports = {
  name: "inversion",
  description: "Verifica el estado de tu inversión.",
  commands: ["inversion"],
  usage: `${PREFIX}inversion`,
  handle: async ({ sendReply, userJid }) => {
    const investmentStatus = readData(investmentFilePath);
    const userInvestment = investmentStatus[userJid] || null;

    if (!userInvestment) {
      return sendReply("❌ No tienes ninguna inversión activa en este momento.");
    }

    const gananciaOpcion = (userInvestment.saldoInvertido * userInvestment.porcentaje) / 100;
    const saldoFinal = userInvestment.saldoInvertido + gananciaOpcion;
    const estadoInversion = gananciaOpcion >= 0 ? `¡Has ganado ${gananciaOpcion} monedas!` : `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`;

    await sendReply(`💼 @${userJid} tu inversión en *${userInvestment.empresa}* sigue en pie.\n\n${estadoInversion}\n\nSaldo invertido: ${userInvestment.saldoInvertido} monedas.\nSaldo final: ${saldoFinal} monedas.\nSi quieres retirarte, usa \`#retirar\`.`);
  }
};