const { PREFIX } = require("../../krampus");

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
      await sendReply("Grupo abierto,todos los miembros pueden enviar mensajes.\n> Krampus OM bot");
    } catch (error) {
      console.error("Error al intentar abrir el grupo:", error);
      await sendReply("❌ No se pudo abrir el grupo. Asegúrate de que el bot es administrador.");
    }
  },
};