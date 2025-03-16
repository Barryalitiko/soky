const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

const statusFilePath = path.resolve(process.cwd(), "assets/status.json");

const readStatus = () => {
  try {
    const data = fs.readFileSync(statusFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { enabled: false }; // Si no existe el archivo, devolvemos deshabilitado
  }
};

module.exports = {
  name: "kiss",
  description: "Enviar un beso a alguien. Debes etiquetar o responder a un usuario.",
  commands: ["tocar"],
  usage: `${PREFIX}kiss @usuario o responde a un mensaje`,
  handle: async ({ socket, remoteJid, sendReply, sendReact, args, isReply, replyJid, userJid }) => {
    try {
      const currentStatus = readStatus();
      if (!currentStatus.enabled) {
        await sendReply("❌ El sistema de gifs está apagado.\nPide a un admin que lo encienda");
        return;
      }

      let targetJid;

      // Si el comando es una respuesta a un mensaje, obtenemos el JID del destinatario
      if (isReply) {
        targetJid = replyJid;
      }
      // Si el comando incluye una etiqueta, obtenemos el JID de la etiqueta
      else if (args && args.length > 0) {
        targetJid = args[0].replace("@", "") + "@s.whatsapp.net";
      }

      // Si no hay destinatario, enviamos un mensaje de error
      if (!targetJid) {
        await sendReply("❌ Debes etiquetar o responder a un usuario para interactuar.");
        return;
      }

      // Enviar el beso
      await sendReact("🥵", remoteJid);
      await socket.sendMessage(remoteJid, {
        video: fs.readFileSync("assets/sx/manosear.mp4"),
        caption: `🤭\n> 𝙌𝙪𝙚 𝙚𝙨𝙩𝙖 𝙥𝙖𝙨𝙖𝙣𝙙𝙤 𝙖𝙦𝙪𝙞́?\n@${userJid.split("@")[0]} ha manoseado a @${targetJid.split("@")[0]}`,
        gifPlayback: true,
        mentions: [userJid, targetJid]
      });
    } catch (error) {
      console.error("Error en el comando kiss:", error);
      await sendReply("❌ Ocurrió un error al procesar el comando.");
    }
  }
};