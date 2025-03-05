const { PREFIX } = require("../../krampus");

module.exports = {
  name: "invitar",
  description: "Invita a un usuario a un grupo de WhatsApp.",
  commands: ["invitar"],
  usage: `${PREFIX}invitar`,
  handle: async ({ sendReply, socket, userJid, remoteJid }) => {
    const mensaje = "Hola";
    const grupo = "https://chat.whatsapp.com/..."; // enlace de invitación al grupo

    await socket.sendMessage(remoteJid, {
      text: mensaje,
      groupInviteMessage: {
        groupJid: grupo,
        inviteCode: grupo.split("/").pop(),
        inviteExpiration: Date.now() + 86400000, // 1 día
      },
    });
  },
};
