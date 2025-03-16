const { PREFIX } = require("../../krampus");

module.exports = {
  name: "admin",
  description: "Promueve o degrada a un administrador en el grupo.",
  commands: ["promote", "demote"],
  usage: `${PREFIX}promote @usuario\n${PREFIX}demote @usuario`,
  handle: async ({ args, remoteJid, commandName, socket, sendReact }) => {
    if (!remoteJid.endsWith("@g.us")) {
      await socket.sendMessage(remoteJid, { text: "❌ Este comando solo puede usarse en grupos." });
      return;
    }

    if (args.length < 1) {
      await socket.sendMessage(
        remoteJid,
        { text: `Uso incorrecto. Ejemplo:\n${PREFIX}promote @usuario\n${PREFIX}demote @usuario` }
      );
      return;
    }

    const mentionedUser = args[0].replace("@", "").replace(/\D/g, "") + "@s.whatsapp.net";

    try {
      if (commandName === "promote") {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedUser], "promote");
        await sendReact("👮🏻‍♂️");
        await socket.sendMessage(remoteJid, { text: `@${args[0]} ahora es administrador.` });
      } else if (commandName === "demote") {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedUser], "demote");
        await sendReact("❌");
        await socket.sendMessage(remoteJid, { text: `@${args[0]} ya no es administrador.` });
      }
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      await socket.sendMessage(remoteJid, { text: "❌ Hubo un error al realizar la acción." });
    }
  },
};