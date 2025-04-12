const { PREFIX } = require("../../krampus");
const path = require("path");
const fs = require("fs");
const { downloadVideo } = require("../../services/ytdpl");
const ytSearch = require("yt-search");
const cooldowns = new Map();

module.exports = {
  name: "video",
  description: "Buscar y enviar un video",
  commands: ["video", "v"],
  usage: `${PREFIX}video <nombre del video>`,

  handle: async ({
    socket,
    remoteJid,
    sendReply,
    args,
    sendReact,
    webMessage,
    sendMessage,
  }) => {
    try {
      const userId = remoteJid;
      const now = Date.now();
      const cooldownTime = 20 * 1000;

      if (cooldowns.has(userId)) {
        const lastUsed = cooldowns.get(userId);
        if (now - lastUsed < cooldownTime) {
          const remainingTime = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
          await sendReply(`❌ Estás en cooldown. Espera ${remainingTime} segundos para usar el comando nuevamente.`);
          return;
        }
      }

      cooldowns.set(userId, now);

      const videoQuery = args.join(" ");
      if (!videoQuery) {
        await sendReply("❌ Por favor, proporciona el nombre del video que deseas buscar.");
        return;
      }

      // Enviar primer mensaje y guardarlo para eliminarlo luego
      const processingMessage = await sendReply(`ᴏᴘᴇʀᴀᴄɪᴏɴ ᴍᴀʀsʜᴀʟʟ\n> Krampus OM bot procesando...`, { quoted: webMessage });

      // Eliminar mensaje a los 20 segundos
      setTimeout(async () => {
        try {
          await socket.sendMessage(remoteJid, {
            delete: {
              remoteJid: remoteJid,
              fromMe: true,
              id: processingMessage.key.id,
            },
          });
          console.log(`Mensaje eliminado: ${processingMessage.key.id}`);
        } catch (err) {
          console.error("Error al eliminar el mensaje:", err);
        }
      }, 20000);

      await sendReact("⏳", webMessage.key);

      const searchResult = await ytSearch(videoQuery);
      const video = searchResult.videos[0];
      if (!video) {
        await sendReply("❌ No se encontró ningún video con ese nombre.");
        return;
      }

      const videoUrl = video.url;
      const title = video.title;
      const channelName = video.author.name;
      const duration = video.timestamp;
      const thumbnail = video.thumbnail;

      console.log(`Video encontrado: ${title}, URL: ${videoUrl}`);

      const videoPath = await downloadVideo(videoUrl);

      await sendReact("🎬", webMessage.key);

      await socket.sendMessage(remoteJid, {
        video: { url: videoPath },
        mimetype: "video/mp4",
        caption: `🎬 ${title}`,
        contextInfo: {
          externalAdReply: {
            title: title,
            body: channelName,
            thumbnailUrl: thumbnail,
            mediaType: 2,
            renderLargerThumbnail: true,
            sourceUrl: videoUrl,
          },
        },
      }, { quoted: webMessage });

      // Borrar archivo del sistema luego de 1 min
      setTimeout(() => {
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error(`Error al eliminar el archivo de video: ${err}`);
          } else {
            console.log(`Archivo de video eliminado: ${videoPath}`);
          }
        });
      }, 60000);

    } catch (error) {
      console.error("Error al buscar o enviar el video:", error);
      await sendReply("❌ Hubo un error al procesar el video.");
    }
  },
};