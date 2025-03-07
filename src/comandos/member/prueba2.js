const { PREFIX } = require("../../krampus");

module.exports = {
  name: "link",
  description: "Envía un botón con un enlace",
  commands: ["link"],
  usage: `${PREFIX}link`,
  handle: async ({ socket, remoteJid }) => {
    try {
      const message = {
        text: "Haz clic en el botón para visitar nuestra página:",
        footer: "Botón de enlace",
        templateButtons: [
          { index: 1, urlButton: { displayText: "Ir a la página", url: "https://example.com" } },
        ],
      };

      await socket.sendMessage(remoteJid, message);
    } catch (error) {
      console.error("Error al enviar el botón con enlace:", error);
    }
  },
};