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
  { nombre: "Colmado Lewito ", frase: ["*No ai seivicio a dosmicilio er delivery anda endrogao*"] },
  { nombre: "Alofoke Media Group ", frase: ["*Viene nuevo contenido para el canal*"] },
  { nombre: "Show de Carlos Durant ", frase: ["*Por cada inversionista un suscriptor le sobará la 12 a la Piry*"] },
  { nombre: "PRM ", frase: ["*Necesitamos la inversion para ~robar~ mejorar el pais*"] },
  { nombre: "Mr Black la Fama ", frase: ["*Necesito el dinero para mi carrera*"] },
];

module.exports = {
  name: "invertir",
  description: "Invierte en una empresa aleatoria.",
  commands: ["invertir"],
  usage: `${PREFIX}invertir`,
  handle: async ({ sendReply, socket, userJid, remoteJid }) => {
    let investmentStatus = readData(investmentFilePath);
    const userInvestment = investmentStatus[userJid] || null;

    if (userInvestment) {
      return sendReply(" No puedes invertir de nuevo. Si deseas retirarte, usa el comando `#retirar`.");
    }

    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    const saldoInvertido = Math.floor(userKr.kr * 0.25);  // Redondeamos el saldo invertido

    if (userKr.kr < saldoInvertido) {
      await sendReply(" No tienes suficientes monedas para invertir.");
      return;
    }

    // Restando el saldo invertido
    userKr.kr -= saldoInvertido;
    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry)); // Reasignando el objeto modificado
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

    await sendReply(` Acabas de invertir en *${empresaElegida.nombre}*!\n> Ganancia/pérdida de ${porcentaje}%.\n\n${empresaElegida.frase[0]}\n\n¡Que comience la aventura!`);

    const intervalo = setInterval(async () => {
      const tiempoTranscurrido = Math.floor((Date.now() - investmentStatus[userJid].tiempoInicio) / 60000);
      const gananciaOpcion = Math.floor((investmentStatus[userJid].saldoInvertido * investmentStatus[userJid].porcentaje) / 100);  // Redondeamos la ganancia
      const saldoFinal = Math.floor(investmentStatus[userJid].saldoInvertido + gananciaOpcion);  // Redondeamos el saldo final
      const estadoInversion = gananciaOpcion >= 0 ? `¡Has ganado ${gananciaOpcion} monedas!` : `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`;

      if (tiempoTranscurrido >= 5) {
        clearInterval(intervalo);
        krData = readData(krFilePath);
        userKr = krData.find(entry => entry.userJid === userJid);
        userKr.kr += saldoFinal;  // Actualizamos el saldo final con el valor redondeado

        // Reasignando el objeto modificado
        krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
        writeData(krFilePath, krData);

        // Enviar el mensaje de inversión con el estilo reenviado
        await socket.sendMessage(remoteJid, {
          text: `⏳ @${userJid.split("@")[0]} Tu inversión ha terminado en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTu saldo final es de ${userKr.kr} monedas.`,
          mentions: [userJid],
          contextInfo: {
            isForwarded: true, // Marca como mensaje reenviado
            forwardingScore: 2, // Hace que parezca más reenviado
            participant: "1203630250000000@c.us", // Reemplaza con el JID del canal o grupo
            externalAdReply: {
              title: "Krampus OM bot",
              body: "Operación Marshall",
              thumbnailUrl: `file://${path.resolve(__dirname, "../../../assets/images/celda2.png")}`, // Cambia la ruta de la imagen si es necesario
              sourceUrl: "https://www.instagram.com/KrampusOM/", // URL de origen
            },
          },
        });
      } else {
        await socket.sendMessage(remoteJid, {
          text: `⏳ @${userJid.split("@")[0]} Han pasado ${tiempoTranscurrido} minuto(s) desde que invertiste en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTe quedan ${5 - tiempoTranscurrido} minutos. Si deseas retirarte antes, usa el comando \`#retirar\`.`,
          mentions: [userJid],
          contextInfo: {
            isForwarded: true, // Marca como mensaje reenviado
            forwardingScore: 2, // Hace que parezca más reenviado
            participant: "1203630250000000@c.us", // Reemplaza con el JID del canal o grupo
            externalAdReply: {
              title: "Krampus OM bot",
              body: "Operación Marshall",
              thumbnailUrl: `file://${path.resolve(__dirname, "../../../assets/images/celda2.png")}`, // Cambia la ruta de la imagen si es necesario
              sourceUrl: "https://www.instagram.com/KrampusOM/", // URL de origen
            },
          },
        });
      }
    }, 60000);
  },
};