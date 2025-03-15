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
                    // Si el modo es 2, obtenemos la imagen de perfil
                    ({ buffer, profileImage } = await getProfileImageData(socket, userJid));
                }

                const welcomeMessage = `Se acaba de unir @${userJid ? onlyNumbers(userJid) : ''} al grupo\n\nPresentate ᶜᵒⁿ 𝐟𝐨𝐭𝐨 y 𝐧𝐨𝐦𝐛𝐫𝐞\n> Soky OM bot\n> Oᴘᴇʀᴀᴄɪᴏɴ Mᴀʀsʜᴀʟʟ ༴༎𝙾𝙼༎\n> https://www.instagram.com/_vasquezemmanuel?igsh=MXNoNTk3aHR3dnRyeQ==`;

                if (welcomeMode === "2") {
                    // Si el modo es 2, se envía con foto
                    await socket.sendMessage(remoteJid, {
                        image: buffer,
                        caption: welcomeMessage,
                        mentions: [userJid],
                    });

                    if (!profileImage.includes("default-user")) {
                        fs.unlinkSync(profileImage); // Eliminamos la imagen de perfil descargada
                    }
                } else {
                    // Si el modo es 1, solo enviamos texto
                    await socket.sendMessage(remoteJid, {
                        text: welcomeMessage,
                        mentions: [userJid],
                    });
                }
            } catch (error) {
                warningLog("Soky bot No se pudo enviar el mensaje de Bienvenida");
            }
        }
    }

    // Comprobación de despedida
    if (isActiveGoodbyeGroup(remoteJid)) {
        if (groupParticipantsUpdate.action === "remove") {
            try {
                const goodbyeMessage = `@${userJid ? onlyNumbers(userJid) : ''} abandonó el grupo\n> Soky OM bot`;

                // Solo enviamos el mensaje de texto, sin imágenes
                await socket.sendMessage(remoteJid, {
                    text: goodbyeMessage,
                    mentions: [userJid],
                });
            } catch (error) {
                warningLog("Soky bot No se pudo enviar el mensaje de Despedida");
            }
        }
    }
};