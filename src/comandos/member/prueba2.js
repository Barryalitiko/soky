const { PREFIX } = require("../../krampus");

module.exports = {
  name: "testestado",
  description: "Prueba de respuesta a un estado de WhatsApp",
  commands: ["vaka"],
  usage: `${PREFIX}testestado`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      await socket.sendMessage(remoteJid, {
        text: "Este es un mensaje de prueba respondiendo a un estado de WhatsApp.",
        contextInfo: {
          quotedMessage: {
            conversation: "WhatsApp: 📢 ¡Descubre nuestras nuevas funciones!",
          },
          participant: "0@s.whatsapp.net", // WhatsApp oficial
          remoteJid: "status@broadcast", // Indica que responde a un estado
          isForwarded: true,
        },
      });
    } catch (error) {
      console.error("Error al enviar el mensaje de prueba:", error);
      await sendReply("❌ Error al enviar el mensaje.");
    }
  },
};