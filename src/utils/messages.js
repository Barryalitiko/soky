const { BOT_NAME, PREFIX } = require("../config");

exports.waitMessage = "Carregando dados...";

exports.menuMessage = () => {
  const date = new Date();

  return `ᵏʳᵃᵐᵖᵘˢ ᵇᵒᵗ
╭━─━─━─≪ 𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱𝗼 ≫─━─━─━╮

⌠⅏⌡➟ ${BOT_NAME}
⌠⅏⌡➟ 𝙵𝚎𝚌𝚑𝚊: ${date.toLocaleDateString("es-ES")}
⌠⅏⌡➟ 𝙷𝚘𝚛𝚊: ${date.toLocaleTimeString("es-ES")}
⌠⅏⌡➟ 𝚌𝚘𝚖𝚊𝚗𝚍𝚘𝚜: ${PREFIX}

╰━─━─━─≪       👻       ≫─━─━─━╯

━━━━━━━⛥ 𝗢𝗠 ༴༎👻༎ ⛦━━━━━━━

> 𝙾 𝙿 𝙴 𝚁 𝙰 𝙲 𝙸 𝙾 𝙽  𝙼 𝙰 𝚁 𝚂 𝙷 𝙰 𝙻 𝙻

╧╤╧╤╧╤╧╤ 𝐊 𝐑 𝐀 𝐌 ╧╤╧╤╧╤╧╤

⌠⅏⌡➟ ${PREFIX}off
⌠⅏⌡➟ ${PREFIX}on

╭━─━─━─≪ 𝗔𝗗𝗠𝗜𝗡𝗦 ≫─━─━─━╮

⌠⅏⌡➟ ${PREFIX}antilink 1/0
⌠⅏⌡➟ ${PREFIX}ban
⌠⅏⌡➟ ${PREFIX}todos
⌠⅏⌡➟ ${PREFIX}bienvenida 1/0
⌠⅏⌡➟ ${PREFIX}tag
⌠⅏⌡➟ ${PREFIX}grupo cerrar/abrir

╰━─━─━─≪       👻       ≫─━─━─━╯

━━━━━━━⛥ 𝗢𝗠 ༴༎👻༎ ⛦━━━━━━━

╭━─━─━─≪   𝗠𝗘𝗡𝗨   ≫─━─━─━╮

⌠⅏⌡➟ ${PREFIX}attp (texto sticker)
⌠⅏⌡➟ ${PREFIX}krampus (chat gpt)
⌠⅏⌡➟ ${PREFIX}jpg (imagen generada con IA)
⌠⅏⌡➟ ${PREFIX}menu
⌠⅏⌡➟ ${PREFIX}om (para comprobar)
⌠⅏⌡➟ ${PREFIX}music/m
⌠⅏⌡➟ ${PREFIX}video/v
⌠⅏⌡➟ ${PREFIX}sticker/s
⌠⅏⌡➟ ${PREFIX}img
⌠⅏⌡➟ ${PREFIX}pfp (para enviar foto del perfil)

╰━─━─━─≪       👻       ≫─━─━─━╯`;
};
