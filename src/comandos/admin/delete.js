const { PREFIX } = require("../../krampus");

module.exports = {
  name: "eliminar",
  description: "Elimina un mensaje para todos en el grupo.",
  commands: ["eliminar"],
  usage: `${PREFIX}eliminar [ID del mensaje]`,
  handle: async ({ socket, remoteJid, sendReply, args }) => {
    try {
      if (!args[0]) {
        await sendReply("❌ Debes proporcionar el ID del mensaje que deseas eliminar.");
        return;
      }

      const messageId = args[0]; // El ID del mensaje que deseas eliminar

      // Verificar si el mensaje existe
      const message = await socket.loadMessage(remoteJid, messageId);
      if (!message) {
        await sendReply("❌ No se encontró el mensaje con ese ID.");
        return;
      }

      // Eliminar el mensaje para todos
      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid: remoteJid, // JID del grupo
          id: messageId, // ID del mensaje
          participant: message.key.participant // JID del participante (opcional, en caso de ser un grupo)
        }
      });

      await sendReply("✅ El mensaje ha sido eliminado para todos.");
    } catch (error) {
      console.error("Error al intentar eliminar el mensaje:", error);
      await sendReply("❌ Ocurrió un error al intentar eliminar el mensaje.");
    }
  }
};