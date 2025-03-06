const { PREFIX } = require("../../krampus");

module.exports = {
  name: "eliminar",
  description: "Elimina un mensaje para todos en el grupo.",
  commands: ["eliminar"],
  usage: `${PREFIX}eliminar @usuario o responde a un mensaje`,
  handle: async ({ socket, remoteJid, sendReply, isReply, replyJid, userJid, args }) => {
    try {
      // Verificar si el comando es una respuesta a un mensaje
      if (isReply) {
        // Si es una respuesta, obtenemos el mensaje a eliminar
        const messageToDelete = replyJid;

        // Eliminar el mensaje para todos
        await socket.sendMessage(remoteJid, {
          delete: messageToDelete
        });

        await sendReply("✅ El mensaje ha sido eliminado para todos.");
      } else if (args && args.length > 0) {
        // Si el comando incluye una etiqueta, buscamos el mensaje del usuario
        const targetJid = args[0].replace("@", "") + "@s.whatsapp.net";
        
        // Aquí podrías agregar lógica para buscar el mensaje del usuario específico si lo deseas.
        await sendReply("❌ El comando de eliminación por usuario no está implementado.");
      } else {
        await sendReply("❌ Debes responder a un mensaje para eliminarlo.");
      }
    } catch (error) {
      console.error("Error al intentar eliminar el mensaje:", error);
      await sendReply("❌ No se pudo eliminar el mensaje.");
    }
  }
};