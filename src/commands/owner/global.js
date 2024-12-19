const { PREFIX } = require("../../config");

module.exports = {
  name: "reenviar",
  description: "Reenviar un mensaje a todos los grupos donde está el bot.",
  commands: ["global", "g"],
  usage: `${PREFIX}reenviar`,
  handle: async ({ sendReply, socket, remoteJid, quoted, isGroup }) => {
    try {
      // Verificar si el comando se usa respondiendo a un mensaje
      if (!quoted) {
        return sendReply("Debes responder a un mensaje para reenviarlo.");
      }

      // Verificar si se usa en un grupo
      if (!isGroup) {
        return sendReply("Este comando solo se puede usar en grupos.");
      }

      // Obtener todos los chats del bot
      const chats = await socket.chats.all();
      const groupChats = chats.filter((chat) => chat.id.endsWith("@g.us"));

      if (groupChats.length === 0) {
        return sendReply("El bot no está en ningún grupo.");
      }

      // Reenviar el mensaje a todos los grupos
      for (const group of groupChats) {
        await socket.copyNForward(group.id, quoted);
      }

      sendReply("Mensaje reenviado a todos los grupos donde está el bot.");
    } catch (error) {
      console.error("Error al reenviar el mensaje:", error);
      sendReply("Ocurrió un error al intentar reenviar el mensaje.");
    }
  },
};