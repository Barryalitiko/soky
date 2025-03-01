const { getProfileImageData } = require("../services/baileys");
const fs = require("fs");
const { onlyNumbers } = require("../utils");
const { isActiveWelcomeGroup, getWelcomeMode, isActiveGoodbyeGroup } = require("../utils/database");
const { warningLog } = require("../utils/logger");

exports.onGroupParticipantsUpdate = async ({ groupParticipantsUpdate, socket }) => {
    const remoteJid = groupParticipantsUpdate.id;
    const userJid = groupParticipantsUpdate.participants[0];

    // Comprobación de bienvenida
    if (isActiveWelcomeGroup(remoteJid)) {
        const welcomeMode = getWelcomeMode(remoteJid);

        if (groupParticipantsUpdate.action === "add") {
            try {
                let buffer = null;
                let profileImage = null;

                if (welcomeMode === "2") {
                    ({ buffer, profileImage } = await getProfileImageData(socket, userJid));
                }

                const welcomeMessage = `¡𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱@ 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼! @${userJid ? onlyNumbers(userJid) : ''}\n\nPresentate ᶜᵒⁿ 𝐟𝐨𝐭𝐨 y 𝐧𝐨𝐦𝐛𝐫𝐞\n> Bot by Krampus OM Oᴘᴇʀᴀᴄɪᴏɴ Mᴀʀsʜᴀʟʟ ༴༎𝙾𝙼༎\n> https://www.instagram.com/p/DGjMug8shLI/?igsh=MXMzaGN0NjJ1MDkxMw==`;

                if (welcomeMode === "2") {
                    await socket.sendMessage(remoteJid, {
                        image: buffer,
                        caption: welcomeMessage,
                        mentions: [userJid],
                    });

                    if (!profileImage.includes("default-user")) {
                        fs.unlinkSync(profileImage);
                    }
                } else {
                    await socket.sendMessage(remoteJid, {
                        text: welcomeMessage,
                        mentions: [userJid],
                    });
                }
            } catch (error) {
                warningLog("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo enviar el mensaje de Bienvenida");
            }
        }
    }

    // Comprobación de despedida
    if (isActiveGoodbyeGroup(remoteJid)) {
        if (groupParticipantsUpdate.action === "remove") {
            try {
                const goodbyeMessages = [
                    "¿Que esta pasando aqui?\nDe tanto llorar @${userJid ? onlyNumbers(userJid) : ''} salió del grupo 💔😞",
                    "Otra baja para el grupo... @${userJid ? onlyNumbers(userJid) : ''} se fue 😢",
                    "Y así sin más, @${userJid ? onlyNumbers(userJid) : ''} abandonó el barco 🚢💨",
                    "@${userJid ? onlyNumbers(userJid) : ''} huyó como una leyenda 🏃💨",
                    "Parece que no le gustó el grupo a @${userJid ? onlyNumbers(userJid) : ''} 😕",
                    "Adiós @${userJid ? onlyNumbers(userJid) : ''}, que la vida te trate mejor que este grupo 😭",
                    "Nos vemos en otra vida, @${userJid ? onlyNumbers(userJid) : ''} 🌎👋",
                    "@${userJid ? onlyNumbers(userJid) : ''} se fue, pero su recuerdo permanecerá... o tal vez no 🤷‍♂️",
                    "Alguien más que no soportó el grupo, adiós @${userJid ? onlyNumbers(userJid) : ''} 👋",
                    "¡Un minuto de silencio por @${userJid ? onlyNumbers(userJid) : ''}! 🕊️",
                    "@${userJid ? onlyNumbers(userJid) : ''} decidió ser libre como el viento 🌬️",
                    "¡Hasta la vista, @${userJid ? onlyNumbers(userJid) : ''}! 👀",
                    "La puerta está abierta si quieres volver, @${userJid ? onlyNumbers(userJid) : ''} 🚪",
                    "Menos bulto, más claridad. Adiós @${userJid ? onlyNumbers(userJid) : ''} 👋",
                    "Tantos recuerdos juntos, @${userJid ? onlyNumbers(userJid) : ''}... bueno, en verdad ni hablaba 😅",
                    "Nos abandonó @${userJid ? onlyNumbers(userJid) : ''}, pero el grupo sigue fuerte 💪",
                    "Por favor, apaguen una vela por @${userJid ? onlyNumbers(userJid) : ''} 🕯️",
                    "Que Dios tenga en la gloria a @${userJid ? onlyNumbers(userJid) : ''} 🙏",
                    "Parece que la presión fue demasiado para @${userJid ? onlyNumbers(userJid) : ''} 😵",
                    "Se fue en busca de aventuras... o de otro grupo mejor 🤔",
                    "¿Es esta una despedida definitiva, @${userJid ? onlyNumbers(userJid) : ''}? 🥺",
                    "Tranquilos, ya volverá cuando se aburra 🧐",
                    "Era de esperarse, @${userJid ? onlyNumbers(userJid) : ''} no aguantó la vibra del grupo 😆",
                    "Siempre recordaré este momento... o tal vez no, adiós @${userJid ? onlyNumbers(userJid) : ''} 😂",
                    "¡Cuidado al salir, no te golpees con la puerta, @${userJid ? onlyNumbers(userJid) : ''}! 🚪",
                    "Perdimos a otro soldado, descansa en paz @${userJid ? onlyNumbers(userJid) : ''} 🫡",
                    "Espero que el siguiente grupo sea mejor para ti, @${userJid ? onlyNumbers(userJid) : ''} 😭",
                    "Tal vez nos veamos en otro grupo, en otra vida, en otro universo... Adiós @${userJid ? onlyNumbers(userJid) : ''} 🌀",
                    "@${userJid ? onlyNumbers(userJid) : ''} desapareció más rápido que mi salario 😢",
                    "Siempre en nuestros corazones... aunque nunca hablaba 🤷‍♂️"
                ];

                const goodbyeMessage = goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];

                await socket.sendMessage(remoteJid, {
                    text: goodbyeMessage,
                    mentions: [userJid],
                });
            } catch (error) {
                warningLog("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo enviar el mensaje de Despedida");
            }
        }
    }
};