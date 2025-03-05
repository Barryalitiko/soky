const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const investmentFilePath = path.resolve(process.cwd(), "assets/investment.json");

const empresas = [
  {
    nombre: "Peluquería La Mejor",
    frase: ["¡Te cortamos el cabello y te dejamos con la pela!", "¡Cuidado con el look que esta inversión es peligrosa!"]
  },
  {
    nombre: "Muebles Los Reyes",
    frase: ["¡Venta de muebles que te hacen rey, pero ojo, no todo brilla!", "Si te caen las ganancias, no digas que no te avisé."]
  },
  {
    nombre: "Supermercado El Chevere",
    frase: ["¡Compra tu inversión aquí, las frutas te salen caras pero ricas!", "¿Te vas a arriesgar con las gallinas o buscas algo más sólido?"]
  },
  {
    nombre: "Electrodomésticos SuperFast",
    frase: ["Tu inversión puede explotar como una olla de presión, o puede salir bien. ¡Eso solo lo sabremos con el tiempo!", "¿Qué vas a comprar? ¿Lavadora o un electrodoméstico de lujo?"]
  },
  {
    nombre: "Tienda La Bonita",
    frase: ["Te venden de todo, pero la ganancia es incierta, el mercado está impredecible.", "¿Vas a comprar un celular o un televisor? Cualquier cosa puede salir mal."]
  },
];

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
  name: "invertir",
  description: "Invierte en una empresa aleatoria.",
  commands: ["invertir"],
  usage: `${PREFIX}invertir`,
  handle: async ({ socket, userJid, remoteJid, sendReply }) => {
    const investmentStatus = readData(investmentFilePath);
    const userInvestment = investmentStatus[userJid] || null;

    if (userInvestment) {
      return sendReply("❌ ¡Parece que ya estás invertido, hermano! Si quieres retirarte, usa el comando `#retirar`.");
    }

    const empresaElegida = empresas[Math.floor(Math.random() * empresas.length)];
    const porcentaje = Math.floor(Math.random() * 2) === 0 ? 8 : -8;

    investmentStatus[userJid] = {
      empresa: empresaElegida.nombre,
      frase: empresaElegida.frase,
      porcentaje: porcentaje,
      saldoInvertido: 25,
      tiempoInicio: Date.now(),
    };

    writeData(investmentFilePath, investmentStatus);

    await sendReply(`💼 ¡Te has invertido con *${empresaElegida.nombre}*! Aquí vamos con una ganancia/pérdida de ${porcentaje}%.\n\n${empresaElegida.frase[0]}\n\n¡Que comience la aventura!`);

    const intervalo = setInterval(async () => {
      const tiempoTranscurrido = Math.floor((Date.now() - investmentStatus[userJid].tiempoInicio) / 60000);
      const gananciaOpcion = (investmentStatus[userJid].saldoInvertido * investmentStatus[userJid].porcentaje) / 100;
      const saldoFinal = investmentStatus[userJid].saldoInvertido + gananciaOpcion;
      const estadoInversion = gananciaOpcion >= 0 ? `¡Has ganado ${gananciaOpcion} monedas!` : `¡Has perdido ${Math.abs(gananciaOpcion)} monedas!`;

      if (tiempoTranscurrido >= 5) {
        clearInterval(intervalo);
        await socket.sendMessage(remoteJid, {
          text: `⏳ @${userJid} Tu inversión ha terminado en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTu saldo final es de ${saldoFinal} monedas.`
        });
      } else {
        await socket.sendMessage(remoteJid, {
          text: `⏳ @${userJid} Han pasado ${tiempoTranscurrido} minuto(s) desde que invertiste en *${empresaElegida.nombre}*.\n\n${estadoInversion}\n\nTe quedan ${5 - tiempoTranscurrido} minutos. Si deseas retirarte antes, usa el comando \`#retirar\`.`
        });
      }
    }, 60000);
  },
};
