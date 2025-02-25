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

const TIEMPO_TRABAJO_MS = 5 * 60 * 1000; // 5 minutos en milisegundos

module.exports = {
  name: "trabajo",
  description: "Elige un trabajo y gana monedas en 5 minutos.",
  commands: ["trabajo"],
  usage: `${PREFIX}trabajo`,
  handle: async ({ sendReply, userJid, args }) => {
    const trabajoStatus = readData(commandStatusFilePath);
    if (trabajoStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de trabajos está desactivado.");
      return;
    }

    const trabajoStats = readData(usageStatsFilePath);
    trabajoStats.users = trabajoStats.users || {};
    const userStats = trabajoStats.users[userJid] || { trabajo: null, inicioTrabajo: null };

    if (userStats.trabajo) {
      const tiempoPasado = Date.now() - userStats.inicioTrabajo;
      if (tiempoPasado >= TIEMPO_TRABAJO_MS) {
        // Si ya pasó el tiempo, procesar el pago inmediato
        await pagarTrabajo(userJid, userStats.trabajo, sendReply);
        return;
      } else {
        const tiempoRestante = Math.ceil((TIEMPO_TRABAJO_MS - tiempoPasado) / 1000);
        await sendReply(`❌ Ya estás trabajando como *${userStats.trabajo}*. Te pagarán en ${Math.ceil(tiempoRestante / 60)} minutos.`);
        return;
      }
    }

    if (args.length === 0) {
      const trabajosDisponibles = [
        "Motoconcho",
        "Dembowsero",
        "Banquera",
        "Delivery",
        "Colmadero",
        "Atracador",
        "Pintor",
        "Policia",
        "Cuero",
        "Bachatero"
      ];

      const listaTrabajos = trabajosDisponibles.map((trabajo, index) => `${index + 1}. **${trabajo}**`).join("\n");

      await sendReply(`💼 *Profesiones disponibles:*\n\n${listaTrabajos}\n\nUsa el comando \`#trabajo <profesión>\` para elegir uno.`);
      return;
    }

    const trabajos = [
      { nombre: "Motoconcho", pago: [8, 10, 15] },
      { nombre: "Dembowsero", pago: [8, 10, 15] },
      { nombre: "Banquera", pago: [8, 10, 15] },
      { nombre: "Delivery", pago: [8, 10, 15] },
      { nombre: "Colmadero", pago: [8, 10, 15] },
      { nombre: "Atracador", pago: [8, 10, 15] },
      { nombre: "Pintor", pago: [8, 10, 15] },
      { nombre: "Policia", pago: [8, 10, 15] },
      { nombre: "Cuero", pago: [8, 10, 15] },
      { nombre: "Bachatero", pago: [8, 10, 15] }
    ];

    const trabajoElegido = trabajos.find(t => t.nombre.toLowerCase() === args.join(" ").toLowerCase());
    if (!trabajoElegido) {
      await sendReply("❌ Profesión no válida. Usa el comando #trabajo para ver las profesiones disponibles.");
      return;
    }

    userStats.trabajo = trabajoElegido.nombre;
    userStats.inicioTrabajo = Date.now();
    trabajoStats.users[userJid] = userStats;
    writeData(usageStatsFilePath, trabajoStats);

    await sendReply(`💼 Has comenzado tu trabajo como *${trabajoElegido.nombre}*.\n\n⏳ El pago será en 5 minutos.`);

    setTimeout(async () => {
      await pagarTrabajo(userJid, trabajoElegido.nombre, sendReply);
    }, TIEMPO_TRABAJO_MS);
  }
};

async function pagarTrabajo(userJid, trabajo, sendReply) {
  const trabajos = {
    Motoconcho: { pago: [8, 10, 15], mensajes: { 8: "Diache, solo 8 pesos.", 10: "Buen día, hiciste 10 pesos.", 15: "Coronaste con 15 pesos!" } },
    Dembowsero: { pago: [8, 10, 15], mensajes: { 8: "Solo 8 pesos por tu demo.", 10: "Un party te dejó 10 pesos.", 15: "Pegaste un tema, 15 pesos!" } },
    Banquera: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, floja la venta.", 10: "Te dejaron 10 de propina.", 15: "15 pesos, ¡rompiste la banca!" } },
    Delivery: { pago: [8, 10, 15], mensajes: { 8: "Malas propinas, 8 pesos.", 10: "10 pesos, no está mal.", 15: "Buena propina, 15 pesos!" } },
    Colmadero: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, día flojo.", 10: "Vendiste bien, 10 pesos.", 15: "Colmado lleno, 15 pesos!" } },
    Atracador: { pago: [8, 10, 15], mensajes: { 8: "Mal golpe, solo 8 pesos.", 10: "Coronaste con 10 pesos.", 15: "15 pesos, pero cuídate!" } },
    Pintor: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, desastre de pintura.", 10: "10 pesos por buen trabajo.", 15: "15 pesos, eres un artista!" } },
    Policia: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, día tranquilo.", 10: "10 pesos en multas.", 15: "15 pesos en 'coimas'!" } },
    Cuero: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, poca clientela.", 10: "10 pesos, buen día.", 15: "15 pesos, ¡tú sí sabes!" } },
    Bachatero: { pago: [8, 10, 15], mensajes: { 8: "8 pesos, nadie te oyó.", 10: "10 pesos, algo pegaste.", 15: "15 pesos, ¡Romeo eres tú!" } }
  };

  const pago = trabajos[trabajo].pago[Math.floor(Math.random() * trabajos[trabajo].pago.length)];
  const mensaje = trabajos[trabajo].mensajes[pago];

  let krData = readData(krFilePath);
  let userKr = krData.find(entry => entry.userJid === userJid) || { userJid, kr: 0 };
  userKr.kr += pago;
  krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
  writeData(krFilePath, krData);

  let trabajoStats = readData(usageStatsFilePath);
  delete trabajoStats.users[userJid];
  writeData(usageStatsFilePath, trabajoStats);

  await sendReply(`🛠️ Tu trabajo como *${trabajo}* ha terminado.\n\n💰 ${mensaje}\n\n💵 Saldo: ${userKr.kr} kr.`);
}