const { PREFIX } = require("../../krampus");

module.exports = {
  name: "botonprueba",
  description: "Prueba de botones en WhatsApp",
  commands: ["vaka"],
  usage: `${PREFIX}botonprueba`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      const buttons = [
        { buttonId: "opcion_1", buttonText: { displayText: "Opción 1" }, type: 1 },
        { buttonId: "opcion_2", buttonText: { displayText: "Opción 2" }, type: 1 },
        { buttonId: "opcion_3", buttonText: { displayText: "Opción 3" }, type: 1 },
      ];

      const buttonMessage = {
        text: "Elige una opción:",
        footer: "Mensaje de prueba",
        buttons: buttons,
        headerType: 1,
      };

      await socket.sendMessage(remoteJid, buttonMessage);
    } catch (error) {
      console.error("Error al enviar el mensaje con botones:", error);
      await sendReply("❌ Error al enviar el mensaje con botones.");
    }
  },
};