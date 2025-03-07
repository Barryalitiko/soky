const { PREFIX } = require("../../krampus");

module.exports = {
  name: "elige",
  description: "Muestra botones interactivos",
  commands: ["elige"],
  usage: `${PREFIX}elige`,
  handle: async ({ socket, remoteJid }) => {
    try {
      const interactiveMessage = {
        interactive: {
          type: "button",
          body: { text: "Elige una opción:" },
          footer: { text: "Prueba de botones" },
          action: {
            buttons: [
              { reply: { id: "btn1", title: "Opción 1" } },
              { reply: { id: "btn2", title: "Opción 2" } },
              { reply: { id: "btn3", title: "Opción 3" } },
            ],
          },
        },
      };

      await socket.sendMessage(remoteJid, interactiveMessage);
    } catch (error) {
      console.error("Error al enviar el mensaje con botones:", error);
    }
  },
};