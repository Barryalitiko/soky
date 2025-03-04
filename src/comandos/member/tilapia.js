const { PREFIX } = require("../../krampus");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const cooldowns = {};
const COOLDOWN_TIME = 25 * 1000;

module.exports = {
  name: "miniVideo",
  description: "Genera un mini video con la foto de perfil de un usuario y un audio.",
  commands: ["tilapia"],
  usage: `${PREFIX}tilapia @usuario`,
  handle: async ({ args, socket, remoteJid, sendReply, isReply, replyJid, senderJid }) => {
    let userJid;

    if (isReply) {
      userJid = replyJid;
    } else if (args.length < 1) {
      await sendReply("Uso incorrecto. Usa el comando así:\n" + `${PREFIX}tilapia @usuario`);
      return;
    } else {
      userJid = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    const lastUsed = cooldowns[senderJid] || 0;
    const now = Date.now();
    if (now - lastUsed < COOLDOWN_TIME) {
      const remainingTime = ((COOLDOWN_TIME - (now - lastUsed)) / 1000).toFixed(1);
      await sendReply(`Espera ${remainingTime} segundos antes de volver a usar el comando.`);
      return;
    }

    try {
      let profilePicUrl;
      try {
        profilePicUrl = await socket.profilePictureUrl(userJid, "image");
      } catch (err) {
        console.error(err);
        await sendReply(`@${args[0] || userJid.split('@')[0]} no tiene foto de perfil, no puedo generar el video.`);
        return;
      }

      if (!profilePicUrl) {
        await sendReply(`@${args[0] || userJid.split('@')[0]} no tiene foto de perfil, no puedo generar el video.`);
        return;
      }

      const tempFolder = path.resolve(__dirname, "../../../assets/temp");
      if (!fs.existsSync(tempFolder)) {
        fs.mkdirSync(tempFolder, { recursive: true });
      }

      const imageFilePath = path.resolve(tempFolder, `${userJid}_profile.jpg`);
      const response = await axios({ url: profilePicUrl, responseType: "arraybuffer" });
      fs.writeFileSync(imageFilePath, response.data);

      const audioFilePath = path.resolve(__dirname, "../../../assets/audio/tilapia.mp3");
      const profileVideoPath = path.resolve(tempFolder, `${userJid}_profile_video.mp4`);
      const baileVideoPath = path.resolve(__dirname, "../../../assets/images/baile.mp4");
      const finalVideoPath = path.resolve(tempFolder, `${userJid}_final.mp4`);

      // **1. Generar el video con la imagen de perfil (13 segundos)**
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(imageFilePath)
          .loop(13) // La imagen dura 13 segundos
          .input(audioFilePath)
          .audioCodec("aac")
          .videoCodec("libx264")
          .outputOptions(["-preset fast"])
          .output(profileVideoPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      // **2. Unir el video de la imagen con el video del baile (añadir video de 7 segundos a partir del segundo 13)**
      await new Promise((resolve, reject) => {
        ffmpeg()
          .input(profileVideoPath)  // El video de 13 segundos
          .input(baileVideoPath)  // El video de 7 segundos
          .filterComplex("[0][1]concat=n=2:v=1:a=0[v]")  // Unir ambos videos
          .map("[v]")  // Mapear el video resultante
          .output(finalVideoPath)
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      // **3. Enviar el video final**
      await socket.sendMessage(remoteJid, {
        video: { url: finalVideoPath },
        caption: `No sabía eso de ti\n@${userJid.split("@")[0]}`,
        mentions: [userJid],
      });

      // **4. Borrar archivos temporales**
      fs.unlinkSync(imageFilePath);
      fs.unlinkSync(profileVideoPath);
      fs.unlinkSync(finalVideoPath);

      cooldowns[senderJid] = Date.now();
    } catch (error) {
      console.error(error);
      await sendReply("Hubo un error al procesar el comando.");
    }
  },
};