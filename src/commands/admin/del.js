const { PREFIX } = require("../../config");

module.exports = {
  name: "deletemsg",
  description: "Elimina el mensaje al que se respondió usando este comando.",
  commands: ["deletemsg"],
  usage: `${PREFIX}deletemsg (responde a un mensaje)`,
  handle: async ({ isReply, quotedMessage, remoteJid, socket, sendReply }) => {
    try {
      // Verificar si el comando fue usado respondiendo a un mensaje
      if (!isReply || !quotedMessage?.key?.id) {
        return await sendReply(
          "👻 Krampus.bot 👻 Usa este comando respondiendo al mensaje que deseas eliminar."
        );
      }

      // Obtener el ID del mensaje a eliminar
      const messageId = quotedMessage.key.id;

      // Eliminar el mensaje
      await socket.deleteMessage(remoteJid, {
        id: messageId,
        remoteJid: remoteJid,
        fromMe: false, // Cambia a `true` si necesitas que solo elimine mensajes enviados por el bot
      });

      console.log(`Mensaje eliminado: ${messageId}`);
      await sendReply("✅ El mensaje ha sido eliminado correctamente.");
    } catch (error) {
      console.error("Error al intentar eliminar el mensaje:", error);
      await sendReply("❌ Ocurrió un problema al intentar eliminar el mensaje.");
    }
  },
};