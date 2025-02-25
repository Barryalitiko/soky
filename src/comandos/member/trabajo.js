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
    return [];
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
    const userStats = trabajoStats.users?.[userJid] || { trabajo: null };

    if (userStats.trabajo) {
      await sendReply("❌ Ya estás trabajando en una profesión, termina tu trabajo actual.");
      return;
    }

    if (args.length === 0) {
      // Si no se especifica profesión, enviar la lista de trabajos disponibles
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
      {
        nombre: "Motoconcho",
        pago: [8, 10, 15],
        mensajes: {
          8: "Diache, te pasaste el día dando carrera y na’ más hiciste 8 pesos. Hoy no fue tu día, manito.",
          10: "Bobo, te cogieron lucha con los tapones, pero hiciste 10 pesos. Sigue dándole pa’ lo tuyo.",
          15: "Tú sí coronaste hoy, pa’! 15 pesos en el motoconcho, sigue así y te compras un motor nuevo."
        }
      },
      {
        nombre: "Dembowsero",
        pago: [8, 10, 15],
        mensajes: {
          8: "Loco, nadie te quiere en el estudio, na’ más hiciste 8 pesos. Mejor ve a practicar más.",
          10: "Sonaste en un party de barrio y te dieron 10 pesos. Algo es algo, mi loco.",
          15: "Tamo' rompiendo! Pegaste un tema y te cayeron 15 pesos. El próximo Tokischa eres tú."
        }
      },
      {
        nombre: "Banquera",
        pago: [8, 10, 15],
        mensajes: {
          8: "Ay mi madre, jugaste unos numeritos y lo que hiciste fueron 8 pesos. Mejor suerte pa' la próxima.",
          10: "Te dejaron una buena propina y subiste a 10 pesos. Vas bien, sigue vendiendo sueños.",
          15: "Oye, tú sí eres dura! Rompiste la banca con 15 pesos, sigue así y montas tu propio negocio."
        }
      },
      {
        nombre: "Delivery",
        pago: [8, 10, 15],
        mensajes: {
          8: "Diablo, loco, la propina hoy estuvo floja. Solo hiciste 8 pesos, pero no te quilles.",
          10: "Repartiste pila de órdenes y te quedaron 10 pesos. Al menos te dieron algo extra.",
          15: "Prrrr, te dieron la gran propina y terminaste con 15 pesos. Sigue dándole duro!"
        }
      },
      {
        nombre: "Colmadero",
        pago: [8, 10, 15],
        mensajes: {
          8: "Compai, hoy la venta estuvo floja, solo hiciste 8 pesos. Reza pa’ que mañana vengan más clientes.",
          10: "Vendiste un par de frias y alcanzaste los 10 pesos. No está mal, pero falta pa’ la moña.",
          15: "La gente hizo fila en el colmado y te dejaste caer con 15 pesos. Vas bien, patrón!"
        }
      },
      {
        nombre: "Atracador",
        pago: [8, 10, 15],
        mensajes: {
          8: "Diablo, manito, te tumbaste solo y solo sacaste 8 pesos. ¿De verdad era worth?",
          10: "Le quitaste la moña a un turista y saliste con 10 pesos. Medio arriesgado, pero coronaste.",
          15: "Manín, hoy sí te pusiste pal’ problema, hiciste 15 pesos. Cuidado con la poli!"
        }
      },
      {
        nombre: "Pintor",
        pago: [8, 10, 15],
        mensajes: {
          8: "Loco, la pintura se te regó y el jefe te pagó solo 8 pesos. Un día difícil en la obra.",
          10: "Pintaste par de casas y te dieron 10 pesos. Poco a poco se va llenando el saquito.",
          15: "¡Tu arte vale oro! Te dieron 15 pesos por tu trabajo, sigue así."
        }
      },
      {
        nombre: "Policia",
        pago: [8, 10, 15],
        mensajes: {
          8: "Coño, na' más hiciste 8 pesos hoy. Parece que la gente se portó bien.",
          10: "Multaste un par de gente y subiste a 10 pesos. Sigue con el ticket en mano!",
          15: "Te llegó la grasa hoy, 15 pesos de 'coimas'. La patrulla te respeta!"
        }
      },
      {
        nombre: "Cuero",
        pago: [8, 10, 15],
        mensajes: {
          8: "Te la pasaste rompiendo corazones, pero solo hiciste 8 pesos. ¿Será que no sabes seducir?",
          10: "Te dieron 10 pesos por tus encantos. No te quejes, algo es algo.",
          15: "Hoy la rompiste! Te ganaste 15 pesos por tu habilidad. ¡Así es que se hace!"
        }
      },
      {
        nombre: "Bachatero",
        pago: [8, 10, 15],
        mensajes: {
          8: "Te tiraste un par de notas desafinadas y solo hiciste 8 pesos. Sigue practicando.",
          10: "Lograste pegar un tema en el barrio y te dejaron 10 pesos. Vamos bien.",
          15: "Te coronaste con 15 pesos. Eres el nuevo Romeo Santos, sigue así."
        }
      }
    ];

    const trabajoElegido = trabajos.find(t => t.nombre.toLowerCase() === args.join(" ").toLowerCase());
    if (!trabajoElegido) {
      await sendReply("❌ Profesión no válida. Usa el comando #trabajo para ver las profesiones disponibles.");
      return;
    }

    userStats.trabajo = trabajoElegido.nombre;
    trabajoStats.users = trabajoStats.users || {};
    trabajoStats.users[userJid] = userStats;
    writeData(usageStatsFilePath, trabajoStats);

    await sendReply(`💼 Has comenzado tu trabajo como *${trabajoElegido.nombre}*.\n\n> El pago sera en 5 min`);

    setTimeout(async () => {
      const pago = trabajoElegido.pago[Math.floor(Math.random() * trabajoElegido.pago.length)];

      let krData = readData(krFilePath);
      let userKr = krData.find(entry => entry.userJid === userJid);

      if (!userKr) {
        userKr = { userJid, kr: 0 };
        krData.push(userKr);
        writeData(krFilePath, krData);
      }

      userKr.kr += pago;
      krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
      writeData(krFilePath, krData);

      await sendReply(`🛠️ Tu trabajo como *${trabajoElegido.nombre}* ha terminado.\n\n> ${trabajoElegido.mensajes[pago]}`);
      await sendReply(`💰 Tu saldo actual es ${userKr.kr}kr.\n\n> Krampus OM bot`);
      userStats.trabajo = null;
      writeData(usageStatsFilePath, trabajoStats);
    }, 300000); // 5 minutos
  }
};