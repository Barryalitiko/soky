const { PREFIX } = require("../../krampus");

module.exports = {
  name: "botonprueba",
  description: "Prueba de botones en WhatsApp",
  commands: ["botonprueba"],
  usage: `${PREFIX}botonprueba`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      const buttons = [
        { index: 1, quickReplyButton: { displayText: "Opción 1", id: "opcion_1" } },
        { index: 2, quickReplyButton: { displayText: "Opción 2", id: "opcion_2" } },
        { index: 3, quickReplyButton: { displayText: "Opción 3", id: "opcion_3" } },
      ];

      const buttonMessage = {
        text: "Elige una opción:",
        footer: "Mensaje de prueba",
        templateButtons: buttons,
      };

      await socket.sendMessage(remoteJid, buttonMessage);
    } catch (error) {
      console.error("Error al enviar el mensaje con botones:", error);
      await sendReply("❌ Error al enviar el mensaje con botones.");
    }
  },
};