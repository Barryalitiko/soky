const { PREFIX } = require("../../config");
const { DangerError } = require("../../errors/DangerError");

module.exports = {
  name: "linkgrupo",
  description: "Obtener el enlace del grupo.",
  commands: ["linkgrupo", "link", "grouplink"],
  usage: `${PREFIX}linkgrupo`,
  handle: async ({ sendReply, sendSuccessReact, socket, message }) => {
    const chat = message.chat;
    const isGroup = chat.type === "group";

    if (!isGroup) {
      throw new DangerError("Este comando solo puede usarse en grupos.");
    }

    try {
      const groupMetadata = await socket.groupMetadata(message.chat.id);
      const botIsAdmin = groupMetadata.participants.some(
        (participant) => participant.id === socket.user.id && participant.admin === "admin"
      );

      if (!botIsAdmin) {
        throw new DangerError("Necesito ser administrador para obtener el enlace del grupo.");
      }

      const inviteCode = await socket.groupInviteCode(message.chat.id);
      const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

      await sendReply(`Aquí está el enlace del grupo:\n${inviteLink}`);
      await sendSuccessReact();
    } catch (error) {
      console.error("Error al obtener el enlace del grupo:", error);
      await sendReply("No pude obtener el enlace del grupo. Asegúrate de que soy administrador.");
    }
  },
};
