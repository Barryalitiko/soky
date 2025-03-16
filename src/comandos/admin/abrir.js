const { PREFIX } = require("../../krampus");
const path = require("path");

module.exports = {
  name: "abrir",
  description: "Abre el grupo, permitiendo que todos los miembros puedan enviar mensajes.",
  commands: ["abrir"],
  usage: `${PREFIX}abrir`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      // Verificar si el comando se está ejecutando en un grupo
      if (!remoteJid.endsWith("@g.us")) {
        await sendReply("❌ Este comando solo puede usarse en grupos.");
        return;
      }

      // Intentar abrir el grupo
      await socket.groupSettingUpdate(remoteJid, "not_announcement");

      const mensaje = "Grupo abierto.\n> Todos los miembros pueden enviar mensajes.";
      const link = "https://www.instagram.com/_vasquezemmanuel/";

      await socket.sendMessage(remoteJid, {
        text: mensaje,
        buttons: [
          {
            url: link,
            text: "Únete",
          },
        ],
        contextInfo: {
          isForwarded: true, // Indica que es un mensaje reenviado
          forwardingScore: 2, // Hace que parezca más reenviado
          participant: "0029Vb8jGB0JZg4FF8oQi83e@c.us", // Reemplaza con el JID del canal
          externalAdReply: {
            title: "Soky bot",
            body: "Operación Marshall",
            thumbnailUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/9.png",
            sourceUrl: link, // Enlace corregido sin parámetros adicionales
          },
        },
      });
    } catch (error) {
      console.error("Error al intentar abrir el grupo:", error);
      await sendReply("❌ No se pudo abrir el grupo. Asegúrate de que el bot es administrador.");
    }
  },
};