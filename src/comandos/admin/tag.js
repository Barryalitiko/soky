const { PREFIX } = require("../../krampus");

module.exports = {
  name: "hide-tag",
  description: "Menciona a todos en el grupo",
  commands: ["tag", "t"],
  usage: `${PREFIX}hidetag`,

  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact, quotedMessage, sendReply }) => {
    try {
      // Obtiene los participantes del grupo
      const { participants } = await socket.groupMetadata(remoteJid);
      const mentions = participants.map(({ id }) => id);

      // Si no hay mensaje, usar un espacio vacío
      const messageText = fullArgs.trim() || "";

      // Envía reacción
      await sendReact("📎");

      if (quotedMessage) {
        // Si el comando es una respuesta, responder al mensaje citado
        await sendReply(messageText, quotedMessage, mentions);
      } else {
        // Si no es respuesta, enviar un mensaje normal
        await sendText(messageText, mentions);
      }
    } catch (error) {
      console.error("Error en hide-tag:", error);
      await sendText("❌ Ocurrió un error al intentar mencionar a todos.");
    }
  },
};