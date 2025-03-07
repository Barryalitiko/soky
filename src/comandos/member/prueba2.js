const { PREFIX } = require("../../krampus");

module.exports = {
  name: "botonprueba",
  description: "Prueba de botones en WhatsApp",
  commands: ["botonprueba"],
  usage: `${PREFIX}botonprueba`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      const buttonsMessage = {
        text: "Elige una opción:",
        footer: "Mensaje de prueba",
        buttons: [
          { buttonId: "opcion_1", buttonText: { displayText: "Opción 1" }, type: 1 },
          { buttonId: "opcion_2", buttonText: { displayText: "Opción 2" }, type: 1 },
          { buttonId: "opcion_3", buttonText: { displayText: "Opción 3" }, type: 1 },
        ],
        headerType: 1,
      };

      await socket.sendMessage(remoteJid, buttonsMessage);
    } catch (error) {
      console.error("Error al enviar el mensaje con botones:", error);
      await sendReply("❌ Error al enviar el mensaje con botones.");
    }
  },
};