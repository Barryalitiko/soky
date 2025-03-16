const { PREFIX, BOT_NUMBER } = require("../../krampus");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");

const warnings = {}; // Objeto para almacenar las advertencias

module.exports = {
  name: "ban",
  description: "Banear",
  commands: ["advertencia", "adv"],
  usage: `ban`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Debes indicarme a quien quieres advertir \n> Soky OM bot"
      );
    }

    const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

    if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
      throw new InvalidParameterError(
        "𝙽𝚞́𝚖𝚎𝚛𝚘 in𝚟𝚊𝚕𝚒𝚍𝚘\n> Soky OM bot"
      );
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError(
        "𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗\n> Soky OM bot"
      );
    }

    const botJid = toUserJid(BOT_NUMBER);
    if (memberToRemoveJid === botJid) {
      throw new DangerError(
        "𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗\n> Soky OM bot"
      );
    }

    // Verificar si el usuario ya ha sido advertido
    if (warnings[memberToRemoveJid]) {
      const warningTime = warnings[memberToRemoveJid].timestamp;
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - warningTime) / 1000; // Convertir a segundos

      if (timeDiff < 180) { // 3 minutos
        // Enviar segunda advertencia y banear al usuario
        await sendReply(`¡Atención! Esta persona ya tenia una advertencia. La expulsare del grupo.\n> Soky OM bot`);
        await socket.groupParticipantsUpdate(remoteJid, [memberToRemoveJid], "remove");
        await sendReact(memberToRemoveJid, "🚫");
        delete warnings[memberToRemoveJid];
      } else {
        // Enviar primera advertencia
        await sendReply(`Ya tiene la primera advertencia, a la siguiente lo expulsare!\n> Soky OM bot`);
        await sendReact(memberToRemoveJid, "⚠️");
        warnings[memberToRemoveJid] = { timestamp: new Date().getTime(), warnings: 1 };
      }
    } else {
      // Enviar primera advertencia
      await sendReply(`Advertencia recibida.\n Si vuelve a recibir otra advertencia en los próximos 3 minutos, será expulsado del grupo.\n> Soky OM bot`);
      await sendReact(memberToRemoveJid, "⚠️");
      warnings[memberToRemoveJid] = { timestamp: new Date().getTime(), warnings: 1 };
    }
  },
};
