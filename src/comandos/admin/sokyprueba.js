const { PREFIX } = require("../../krampus");

module.exports = {
  name: "hide-tag",
  description: "Para mencionar a todos",
  commands: ["sokyprueba", "skp"],
  usage: `${PREFIX}hidetag motivo`,

  handle: async ({ fullArgs, sendText, sendReply, socket, remoteJid, sendReact, quotedMessage }) => {
    // Obtener los participantes del grupo
    const { participants } = await socket.groupMetadata(remoteJid);
    const mentions = participants.map(({ id }) => id);

    // Enviar reacción
    await sendReact("📎");

    // Texto del mensaje
    const mensaje = fullArgs.trim() || "Atención, grupo!";

    // Datos para la previsualización
    const contextInfo = quotedMessage ? {
      isForwarded: true, // Marcar como mensaje reenviado
      forwardingScore: 2, // Ajuste de puntuación de reenvío
      quotedMessage: quotedMessage // Aquí incluimos el mensaje citado
    } : {};

    // Si el mensaje es una respuesta a otro, responder directamente
    if (quotedMessage) {
      await socket.sendMessage(remoteJid, {
        text: mensaje,
        mentions,
        contextInfo, // Incluir la información de la cita para la previsualización
      }, { quoted: quotedMessage });
    } else {
      await socket.sendMessage(remoteJid, {
        text: mensaje,
        mentions,
        contextInfo,
      });
    }
  },
};