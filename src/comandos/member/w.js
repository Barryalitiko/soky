const { PREFIX } = require("../../krampus");
const { downloadMusic } = require("../../services/ytdpl");
const ytSearch = require("yt-search");
const fs = require("fs");
const cooldowns = new Map();

module.exports = {
  name: "musica",
  description: "Descargar y enviar música desde YouTube",
  commands: ["musica", "m", "music", "play", "audio"],
  usage: `${PREFIX}musica <nombre del video>`,
  handle: async ({
    socket,
    remoteJid,
    sendReply,
    args,
    sendWaitReact,
    sendMusicReact,
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

      await sendWaitReact("⏳");

      const searchResult = await ytSearch(videoQuery);
      const video = searchResult.videos[0];

      if (!video) {
        await sendReply("❌ No se encontró ningún video con ese nombre.", { quoted: webMessage });
        return;
      }

      const videoUrl = video.url;
      const videoTitle = video.title;
      const videoAuthor = video.author.name;
      const videoViews = video.views;

      const message = `🎶 ${videoTitle} 

📺 Canal: ${videoAuthor}
👀 Visualizaciones: ${videoViews}

> SOKY bot\n > Oᴘᴇʀᴀᴄɪᴏɴ Mᴀʀsʜᴀʟʟ ༴༎𝙾𝙼༎`;

      await sendReply(message, { quoted: webMessage });

      const musicPath = await downloadMusic(videoUrl);
      console.log(`Música descargada correctamente: ${musicPath}`);

      await sendMusicReact("🎵");
      await sendMessage({
        messageType: "audio",
        url: musicPath,
        mimetype: "audio/mp4",
        caption: `🎶 Aquí tienes la música: ${videoTitle}`,
      });

      // Eliminar el archivo de inmediato después de enviarlo
      fs.unlinkSync(musicPath);
      console.log(`Archivo de música eliminado: ${musicPath}`);

    } catch (error) {
      console.error("Error al descargar o enviar la música:", error);
      await sendReply("❌ Hubo un error al procesar la música.", { quoted: webMessage });
    }
  },
};