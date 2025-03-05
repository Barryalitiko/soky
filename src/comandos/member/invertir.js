const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

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

const empresas = [
  { nombre: "Colmado Lewito 🍺", frase: ["*No ai seivicio a dosmicilio er delivery anda endrogao*"] },
  { nombre: "Alofoke Media Group 🔴", frase: ["*Viene nuevo contenido para el canal"] },
  { nombre: "Show de Carlos Durant 🗣️", frase: ["*Por cada inversionista un suscriptor le sobará la 12 a la Piry*"] },
  { nombre: "PRM 🇩🇴", frase: ["*Necesitamos la inversion para ~robar~ mejorar el pais*"] },
  { nombre: "Mr Black la Fama 💔", frase: ["*Necesito el dinero para mi carrera*"] },
];

module.exports = {
  name: "invertir",
  description: "Invierte en una empresa aleatoria.",
  commands: ["invertir"],
  usage: `${PREFIX}invertir`,
  handle: async ({ sendReply, userJid }) => {
    const investmentStatus = readData(investmentFilePath);
    const userInvestment = investmentStatus[userJid] || null;

    if (userInvestment) {
      return sendReply("❌ ¡Parece que ya estás invertido, hermano! Si quieres retirarte, usa el comando `#retirar`.");
    }

    const krData = readData(krFilePath);
    const userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    const saldoInvertido = Math.floor(userKr.kr * 0.25);

    if (userKr.kr < saldoInvertido) {
      await sendReply("❌ No tienes suficientes monedas para invertir.");
      return;
    }

    userKr.kr -= saldoInvertido;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    const empresaElegida = empresas[Math.floor(Math.random() * empresas.length)];
    const porcentaje = Math.floor(Math.random() * 2) === 0 ? 20 : -20;

    investmentStatus[userJid] = {
      empresa: empresaElegida.nombre,
      frase: empresaElegida.frase,
      porcentaje: porcentaje,
      saldoInvertido: saldoInvertido,
      tiempoInicio: Date.now(),
    };

    writeData(investmentFilePath, investmentStatus);

    await sendReply(`💼 ¡Acabas de invertir en *${empresaElegida.nombre}*!\n> Ganancia/pérdida de ${porcentaje}%.\n\n${empresaElegida.frase[0]}\n\n¡Que comience la aventura!`);

    const intervalo = setInterval(async () => {
      const tiempoTranscurrido = Math.floor((Date.now() - investmentStatus[userJid].tiempoInicio) / 60000);
      const gananciaOpcion = (investmentStatus[userJid].saldoInvertido * investmentStatus[userJid].porcentaje) / 100;
      const saldoFinal = investmentStatus[userJid].saldoInvertido + gananciaOpcion;
      const estadoInversion = gananciaOpcion >= 0 ? `¡Has ganado ${gananciaOpcion} monedas!` : `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`;

      if (tiempoTranscurrido >= 5) {
        clearInterval(intervalo);
        krData = readData(krFilePath);
        userKr = krData.find(entry => entry.userJid === userJid);
        userKr.kr += saldoInvertido + gananciaOpcion;
        krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
        writeData(krFilePath, krData);
        await sendReply(`⏳ Tu inversión ha terminado en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTu saldo final es de ${userKr.kr} monedas.`);
      } else {
        await sendReply(`⏳ Han pasado ${tiempoTranscurrido} minuto(s) desde que invertiste en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTe quedan ${5 - tiempoTranscurrido} minutos. Si deseas retirarte antes, usa el comando \`#retirar\`.`);
      }
    }, 60000);
  },
};
