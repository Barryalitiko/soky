const { PREFIX } = require("../../krampus");

module.exports = {
  name: "menu",
  description: "Muestra un menú interactivo",
  commands: ["vaka"],
  usage: `${PREFIX}menu`,
  handle: async ({ socket, remoteJid }) => {
    try {
      const sections = [
        {
          title: "Opciones disponibles",
          rows: [
            { title: "Información", description: "Ver detalles sobre el bot", rowId: "info" },
            { title: "Comandos", description: "Ver la lista de comandos", rowId: "commands" },
            { title: "Contacto", description: "Hablar con el soporte", rowId: "contact" },
          ],
        },
      ];

      const listMessage = {
        text: "📋 *Menú interactivo*",
        footer: "Selecciona una opción",
        title: "Bienvenido al menú",
        buttonText: "Ver opciones",
        sections,
      };

      await socket.sendMessage(remoteJid, listMessage);
    } catch (error) {
      console.error("Error al enviar el menú interactivo:", error);
    }
  },
};