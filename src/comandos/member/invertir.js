const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const investmentFilePath = path.resolve(process.cwd(), "assets/investment.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

// Variable global para almacenar los intervalos de inversión
const investmentIntervals = {};

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
  { nombre: "Colmado Lewito", frase: ["*No ai seivicio a dosmicilio er delivery anda endrogao*"] },
  { nombre: "Alofoke Media Group", frase: ["*Viene nuevo contenido para el canal*"] },
  { nombre: "Show de Carlos Durant", frase: ["*Por cada inversionista un suscriptor le sobará la 12 a la Piry*"] },
  { nombre: "PRM", frase: ["*Necesitamos la inversion para ~robar~ mejorar el país*"] },
  { nombre: "Mr Black la Fama", frase: ["*Necesito el dinero para mi carrera*"] },
];

module.exports = {
  name: "invertir",
  description: "Invierte en una empresa aleatoria.",
  commands: ["invertir"],
  usage: `${PREFIX}invertir`,
  handle: async ({ sendReply, socket, userJid, remoteJid }) => {
    let investmentStatus = readData(investmentFilePath);
    if (investmentStatus[userJid]) {
      return sendReply("No puedes invertir de nuevo. Si deseas retirarte, usa el comando `#retirar`.");
    }

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    const saldoInvertido = Math.floor(userKr.kr * 0.25);

    if (userKr.kr < saldoInvertido) {
      return sendReply("No tienes suficientes monedas para invertir.");
    }

    userKr.kr -= saldoInvertido;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    const empresaElegida = empresas[Math.floor(Math.random() * empresas.length)];
    const porcentaje = Math.random() < 0.5 ? 20 : -20;

    investmentStatus[userJid] = {
      empresa: empresaElegida.nombre,
      frase: empresaElegida.frase[0],
      porcentaje,
      saldoInvertido,
      tiempoInicio: Date.now(),
    };

    writeData(investmentFilePath, investmentStatus);

    await sendReply(`Acabas de invertir en *${empresaElegida.nombre}*!\n> Ganancia/pérdida de ${porcentaje}%.\n\n${empresaElegida.frase}\n\n¡Que comience la aventura!`);

    const intervalo = setInterval(async () => {
      const investmentData = readData(investmentFilePath);
      if (!investmentData[userJid]) {
        clearInterval(intervalo);
        delete investmentIntervals[userJid];
        return;
      }

      const tiempoTranscurrido = Math.floor((Date.now() - investmentData[userJid].tiempoInicio) / 60000);
      if (tiempoTranscurrido >= 5) {
        clearInterval(intervalo);
        delete investmentIntervals[userJid];
      }

      await sendReply(`⏳ @${userJid.split("@")[0]} Han pasado ${tiempoTranscurrido} minuto(s) desde que invertiste en *${empresaElegida.nombre}*.\nTe quedan ${5 - tiempoTranscurrido} minutos.`);
    }, 60000);

    investmentIntervals[userJid] = intervalo;
  },
};

module.exports.investmentIntervals = investmentIntervals;