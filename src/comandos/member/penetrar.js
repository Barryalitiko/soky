const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "penetrar",
  description: "Enviar un beso a alguien. Debes etiquetar o responder a un usuario.",
  commands: ["penetrar"],
  usage: `${PREFIX}penetrar @usuario o responde a un mensaje`,
  handle: async ({ socket, remoteJid, sendReply, sendReact, args, isReply, replyJid, userJid }) => {
    try {
      // Verificamos si el sistema de gifs está habilitado
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
        await sendReply("❌ Debes etiquetar o responder a un usuario para enviarle un beso.");
        return;
      }

      // Enviar el beso con el emoji
      await sendReact("🍆", remoteJid);

      // Enviar el mensaje con el video y el botón de canal
      await socket.sendMessage(remoteJid, {
        video: fs.readFileSync("assets/sx/penetrar.mp4"),
        caption: `> QUEEEEEEEE?\n@${userJid.split("@")[0]} se lo esta metiendo a @${targetJid.split("@")[0]} 🥵`,
        gifPlayback: true,
        mentions: [userJid, targetJid],
        contextInfo: {
          isForwarded: true, // Haciendo que el mensaje se vea como reenviado
          forwardingScore: 2, // Incrementa el puntaje de reenvío
          participant: "0029Vb8jGB0JZg4FF8oQi83e@c.us", // El JID del canal
          externalAdReply: {
            title: "Canal de Krampus",
            body: "¡Bienvenidos a la comunidad de Krampus!",
            thumbnailUrl: "https://example.com/thumbnail.jpg", // Aquí puedes poner una imagen si lo deseas
          }
        },
        buttons: [
          {
            buttonId: "join_button",
            buttonText: { displayText: "Únete al Canal" },
            type: 1
          }
        ]
      });
    } catch (error) {
      console.error("Error en el comando penetrar:", error);
      await sendReply("❌ Ocurrió un error al procesar el comando.");
    }
  }
};

// Función para leer el estado del sistema de gifs (si está habilitado o no)
const readStatus = () => {
  try {
    const data = fs.readFileSync("assets/status.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { enabled: false }; // Si no existe el archivo, devolvemos deshabilitado
  }
};