const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const MARRIAGE_FILE_PATH = path.resolve(process.cwd(), "assets/marriage.json");
const USER_ITEMS_FILE_PATH = path.resolve(process.cwd(), "assets/userItems.json");
const PENDING_MARRIAGES_FILE = path.resolve(process.cwd(), "assets/pending_marriages.json");

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
  name: "boda",
  description: "Proponer matrimonio a alguien.",
  commands: ["boda"],
  usage: `${PREFIX}boda @usuario`,
  handle: async ({ socket, sendReply, userJid, args, isReply, replyJid, mentionedJid, remoteJid }) => {

    let targetJid;
    if (isReply) {
      // Si el usuario responde a un comentario
      targetJid = replyJid;
    } else if (mentionedJid && mentionedJid.length > 0) {
      // Si el usuario etiqueta a alguien
      targetJid = mentionedJid[0];
    } else if (args.length > 0) {
      // Si se proporciona un argumento, se toma el primer usuario
      targetJid = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    if (!targetJid) {
      await sendReply("❌ Debes etiquetar o responder a un usuario para proponer matrimonio.");
      return;
    }

    if (targetJid === userJid) {
      await sendReply("💍 No puedes casarte contigo mismo, busca a alguien especial.\n> Soky OM bot");
      return;
    }

    // Verificar si el usuario tiene anillos en su inventario
    const userItems = readData(USER_ITEMS_FILE_PATH);
    const userItem = userItems.find((entry) => entry.userJid === userJid);

    if (!userItem || userItem.items.anillos <= 0) {
      await sendReply("💍 ¿Y el anillo pa' cuando?\nNo tienes anillos para proponer matrimonio.\n\n> Usa #tienda 💍 y compra uno");
      return;
    }

    // Verificar si el usuario ya está casado
    const marriageData = readData(MARRIAGE_FILE_PATH);
    const existingMarriage = marriageData.find(
      (entry) => entry.userJid === userJid || entry.partnerJid === userJid
    );

    if (existingMarriage) {
      await sendReply("💔 Ya estás casado!!\nNo le pongas los cuernos a tu pareja 😞");
      return;
    }

    // Verificar si la persona a la que se propone matrimonio ya está casada
    const targetMarriage = marriageData.find(
      (entry) => entry.userJid === targetJid || entry.partnerJid === targetJid
    );

    if (targetMarriage) {
      await sendReply("💔 Esa persona ya está casada\n> Soky OM bot");
      return;
    }

    // Verificar si ya se ha hecho una propuesta reciente
    let pendingMarriages = readData(PENDING_MARRIAGES_FILE);
    pendingMarriages = pendingMarriages.filter(entry => Date.now() - entry.timestamp < 60000);

    const alreadyProposed = pendingMarriages.find(
      (entry) => entry.proposer === userJid && entry.proposedTo === targetJid
    );

    if (alreadyProposed) {
      await sendReply("> Cual es la prisa?\n⏳ Ya le has hecho la propuesta, espera a que responda...");
      return;
    }

    // Añadir la propuesta a las pendientes
    pendingMarriages.push({
      proposer: userJid,
      proposedTo: targetJid,
      timestamp: Date.now()
    });

    writeData(PENDING_MARRIAGES_FILE, pendingMarriages);

    await socket.sendMessage(remoteJid, {
      text: `💍 *@${userJid.split("@")[0]}* te propuso matrimonio ❤️ *@${targetJid.split("@")[0]}*!  
      
Responde con *#r si* para aceptar o *#r no* para rechazar.  

> ⏳ *Tienes 1 minuto para decidir.*`,
      mentions: [userJid, targetJid]
    });
  },
};