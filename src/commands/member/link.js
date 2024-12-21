const { PREFIX } = require("../../config");

module.exports = {
  name: "groupLink",
  description: "Envía el enlace del grupo actual.",
  commands: ["link", "l"],
  usage: `${PREFIX}grouplink`,
  handle: async ({ remoteJid, isGroup, socket, sendReply }) => {
    try {
      if (!isGroup) {
        return await sendReply("❌ Este comando solo puede usarse en grupos.");
      }

      // Obtener el enlace del grupo
      const groupInviteCode = await socket.groupInviteCode(remoteJid);
      const groupLink = `https://chat.whatsapp.com/${groupInviteCode}`;

      // Enviar el enlace del grupo
      await sendReply(`🔗 Aquí está el enlace del grupo:\n${groupLink}`);
    } catch (error) {
      console.error("Error al obtener el enlace del grupo:", error);
      await sendReply("❌ Hubo un problema al obtener el enlace del grupo.");
    }
  },
};