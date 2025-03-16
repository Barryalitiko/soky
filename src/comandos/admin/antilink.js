const { PREFIX } = require("../../krampus");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const {
activateAntiLinkGroup,
deactivateAntiLinkGroup,
setAntiLinkMode,
} = require("../../utils/database");

module.exports = {
name: "anti-link",
description: "Activa/desactiva/configura el recurso de anti-link en el grupo.",
commands: ["antilink"],
usage: `${PREFIX}anti-link (0/1/2)`,
handle: async ({ args, sendReply, sendLinkReact, remoteJid }) => {
if (!args.length) {
throw new InvalidParameterError(
"Activa el `antilink` con 1, 2 o 0.\n* #antilink 1: permite cualquier link excepto de otros grupos\n* #antilink 2: ningun link es permitido en el grupo\n* #antilink 0: apaga el antilink\n> Soky OM bot"
);
}

const mode = args[0];

if (!["0", "1", "2"].includes(mode)) {
  throw new InvalidParameterError(
    "Activa el `antilink` con 1, 2 o 0.\n* #antilink 1: permite cualquier link excepto de otros grupos\n* #antilink 2: ningun link es permitido en el grupo\n* #antilink 0: apaga el antilink\n> Soky OM bot"
  );
}

if (mode === "0") {
  deactivateAntiLinkGroup(remoteJid);
} else {
  activateAntiLinkGroup(remoteJid);
  setAntiLinkMode(remoteJid, mode);
}

await sendLinkReact();

const context =
  mode === "0"
    ? "desactivado\n> Soky OM bot"
    : mode === "1"
    ? "activado\n> Modo 1"
    : "activado (completo)\n> Modo 2";

await sendReply(`El anti-link ha sido ${context}!`);
},
};

