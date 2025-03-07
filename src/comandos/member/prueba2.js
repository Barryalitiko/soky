const { PREFIX } = require("../../krampus");

module.exports = {
  name: "prueba",
  description: "Prueba de respuesta a un estado de WhatsApp oficial.",
  commands: ["vaka"],
  usage: `${PREFIX}prueba`,
  handle: async ({ socket, remoteJid }) => {
    try {
      await socket.sendMessage(remoteJid, {
        text: "Este es un mensaje de prueba respondiendo a un estado de WhatsApp.",
        contextInfo: {
          externalAdReply: {
            title: "WhatsApp",
            body: "Estado publicado por WhatsApp",
            thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
            sourceUrl: "https://www.whatsapp.com",
            mediaType: 1, // 1 para imagen, 2 para video
            renderLargerThumbnail: true
          }
        }
      });
    } catch (error) {
      console.error("Error al enviar el mensaje de prueba:", error);
    }
  }
};