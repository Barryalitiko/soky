const { PREFIX } = require("../../krampus"); // Asegúrate de tener la constante PREFIX
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "eliminar",
  description: "Elimina un mensaje para todos en un grupo.",
  commands: ["eliminar"],
  usage: `${PREFIX}eliminar [ID del mensaje] o responde a un mensaje`,
  handle: async ({ socket, remoteJid, sendReply, isReply, message, replyJid }) => {
    try {
      let messageIdToDelete;

      // Si es una respuesta a un mensaje, obtener el ID del mensaje respondido
      if (isReply) {
        messageIdToDelete = message.message.extendedTextMessage.contextInfo.stanzaId;
      } else {
        // Si no se proporciona un ID, enviar un mensaje de error
        return sendReply("❌ Debes proporcionar el ID del mensaje que deseas eliminar o responder a un mensaje.");
      }

      if (!messageIdToDelete) {
        return sendReply("❌ No se pudo obtener el ID del mensaje para eliminar.");
      }

      // Eliminar el mensaje para todos
      await socket.sendMessage(remoteJid, {
        delete: { 
          remoteJid, 
          id: messageIdToDelete, 
          participant: replyJid
        }
      });

      await sendReply("✅ El mensaje ha sido eliminado para todos.");
    } catch (error) {
      console.error("Error al intentar eliminar el mensaje:", error);
      await sendReply("❌ Ocurrió un error al intentar eliminar el mensaje.");
    }
  },
};