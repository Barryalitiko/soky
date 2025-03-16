const { PREFIX } = require("../../krampus");

module.exports = {
  name: "hide-tag",
  description: "Para mencionar a todos",
  commands: ["tag", "t"],
  usage: `${PREFIX}hidetag motivo`,

  handle: async ({ fullArgs, sendText, sendReply, socket, remoteJid, sendReact, quotedMessage }) => {
    // Obtener los participantes del grupo
    const { participants } = await socket.groupMetadata(remoteJid);
    const mentions = participants.map(({ id }) => id);

    // Enviar reacción
    await sendReact("📎");

    // Si el mensaje es una respuesta a otro, responder directamente
    if (quotedMessage) {
      await sendReply(fullArgs, quotedMessage, mentions);
    } else {
      await sendText(`\n\n${fullArgs}`, mentions);
    }
  },
};