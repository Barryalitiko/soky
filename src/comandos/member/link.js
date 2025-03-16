const { PREFIX } = require("../../krampus");

module.exports = {
  name: "groupLink",
  description: "Envía el enlace del grupo.",
  commands: ["link", "enlace"],
  usage: `${PREFIX}link`,
  handle: async ({ socket, remoteJid, sendReply, sendReact, webMessage }) => {
    try {
      // Reaccionar con 🔗 al comando
      await sendReact("🔗", webMessage.key);

      // Obtener el enlace del grupo
      const inviteCode = await socket.groupInviteCode(remoteJid);

      if (inviteCode) {
        const groupLink = `https://chat.whatsapp.com/${inviteCode}`;
        await sendReply(`𝙻𝚒𝚗𝚔 𝚍𝚎𝚕 𝚐𝚛𝚞𝚙𝚘:\n\n${groupLink}\n\n> Soky OM bot`);
      } else {
        await sendReply("No se pudo obtener el enlace del grupo.");
      }
    } catch (error) {
      console.error("Error al obtener el enlace del grupo:", error.message);
      await sendReply("Ocurrió un error al intentar obtener el enlace del grupo.");
    }
  },
};
