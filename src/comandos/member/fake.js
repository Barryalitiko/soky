const { PREFIX } = require("../../krampus");

module.exports = {
  name: "fake",
  description: "Cita falsamente a la persona a la que se responde, usando el texto indicado.",
  commands: ["fake"],
  usage: `${PREFIX}fake [mensaje a citar] (responde al mensaje de alguien)`,
  handle: async ({ args, socket, remoteJid, quoted }) => {
    if (!args.length || !quoted) {
      await socket.sendMessage(remoteJid, {
        text: "Debes responder al mensaje de alguien y escribir el texto a citar.\nEjemplo: (responde a un mensaje) #fake esto dijiste tú",
      });
      return;
    }

    const mensajeCitado = args.join(" ");

    // Extraer el número de quien fue citado
    let numero = quoted.key.participant || quoted.key.remoteJid;

    // En caso de que venga en formato JID (por ejemplo, en grupos)
    if (numero.includes(":")) {
      numero = numero.split(":")[0] + "@s.whatsapp.net";
    }

    const fakeQuoted = {
      key: {
        remoteJid: remoteJid,
        fromMe: false,
        id: "FAKE-QUOTE-SOKY",
        participant: numero,
      },
      message: {
        conversation: mensajeCitado,
      },
    };

    await socket.sendMessage(remoteJid, {
      text: "soky bot",
    }, { quoted: fakeQuoted });
  },
};