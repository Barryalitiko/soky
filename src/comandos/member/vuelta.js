const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}: ${error.message}`);
  }
};

module.exports = {
  name: "vuelta",
  description: "Haz una vuelta y gana o pierde monedas en situaciones dominicanas.",
  commands: ["vuelta"],
  usage: `${PREFIX}vuelta`,
  handle: async ({ sendReply, userJid }) => {
    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    const vueltas = [
      { msg: "🔥 Te fuiste en una vuelta con Honguito y terminaron en el 15, te tumbaron 20 monedas.", coins: -20 },
      { msg: "💰 Te colaste en un party de Rochy y te pusiste a vender boletas falsas, ganaste 30 monedas.", coins: 30 },
      { msg: "🚔 Tolentino te agarró en cámara cogiendo un saco de plátanos en el colmado, te tumbaron 15 monedas.", coins: -15 },
      { msg: "🎶 Te contrató El Alfa pa’ darle brillo a los Bugatti, ganaste 25 monedas.", coins: 25 },
      { msg: "🥩 Te pusiste a vender chicharrón en la Duarte con París, te ganaste 20 monedas.", coins: 20 },
      { msg: "👀 Saliste a buscar a La Piry, pero te atracaron en el camino y te tumbaron 10 monedas.", coins: -10 },
      { msg: "🔌 Luinny Corporán te mencionó en su programa y te regalaron 50 monedas por influencer.", coins: 50 },
      { msg: "🚨 Saliste con Dilon Baby y terminaste en una persecución, te tumbaron 25 monedas.", coins: -25 },
      { msg: "💵 Vendiste un iPhone con iCloud y le sacaste 40 monedas.", coins: 40 },
      { msg: "🎤 Fuiste al concierto de Rochy con boletas falsas, la policía te agarró y te tumbaron 30 monedas.", coins: -30 },
      { msg: "🛵 Te metiste a motoconcho en Los Mina y ganaste 35 monedas.", coins: 35 },
      { msg: "💳 Intentaste comprar en una tienda con una tarjeta cloqueada y te tumbaron 20 monedas.", coins: -20 },
      { msg: "🏀 Le ganaste un 1v1 a Chris Duarte y te llevaste 50 monedas.", coins: 50 },
      { msg: "🍗 Te pusiste a vender yaniqueques en Boca Chica y te ganaste 15 monedas.", coins: 15 },
      { msg: "🎰 Probaste suerte en la banca de lotería y te sacaste 60 monedas.", coins: 60 },
      { msg: "🏎️ Saliste en carrera con El Cherry y la pasaste fea, te tumbaron 25 monedas.", coins: -25 },
      { msg: "👮‍♂️ Saliste con Honguito sin licencia, te pararon y te tumbaron 15 monedas.", coins: -15 },
      { msg: "💊 Intentaste vender pastillas en la discoteca y la DNCD te agarró, perdiste 40 monedas.", coins: -40 },
      { msg: "🚘 Limpiando vidrios en la Churchill te ligaste 30 monedas.", coins: 30 },
      { msg: "🎶 Fuiste a un teteo y terminaste cobrando la hookah, te llevaste 20 monedas.", coins: 20 },
      { msg: "🎙️ Tolentino habló bien de ti en su canal, te donaron 50 monedas.", coins: 50 },
      { msg: "📸 Te hiciste viral en TikTok y te pagaron 40 monedas.", coins: 40 },
      { msg: "🍾 Pediste un Moët en una discoteca sin dinero, te tumbaron 30 monedas.", coins: -30 },
      { msg: "🐔 Fuiste al colmadón y apostaste en una pelea de gallos, ganaste 45 monedas.", coins: 45 },
      { msg: "🚨 Te metiste en problemas en un colmadón en Herrera, te tumbaron 20 monedas.", coins: -20 },
      { msg: "🏆 Participaste en un torneo de dominó y ganaste 35 monedas.", coins: 35 },
      { msg: "💃 Te pusiste a bailar dembow en un challenge y te ganaste 25 monedas.", coins: 25 },
      { msg: "🚴 Te pusiste a hacer delivery y te ganaste 30 monedas.", coins: 30 },
      { msg: "🎭 Participaste en una película dominicana y te pagaron 40 monedas.", coins: 40 },
      { msg: "🚢 Te pusiste a vender pescado en el malecón y te ganaste 15 monedas.", coins: 15 },
      { msg: "📺 Apareciste en un programa de televisión y te dieron 50 monedas.", coins: 50 },
      { msg: "🛒 Te fuiste sin pagar del supermercado, pero te agarraron y te tumbaron 35 monedas.", coins: -35 },
      { msg: "🏏 Jugaste vitilla y apostaste 20 monedas, saliste ganando 40.", coins: 40 },
      { msg: "🧼 Lavaste carros en la 27 de Febrero y te dieron 30 monedas.", coins: 30 },
      { msg: "🎥 Saliste en una entrevista de Santiago Matías y te mandaron 25 monedas.", coins: 25 },
      { msg: "💼 Te contrataron como seguridad en un colmado y te pagaron 20 monedas.", coins: 20 },
      { msg: "🛑 Te fuiste de teteo sin pagar la hookah y te tumbaron 40 monedas.", coins: -40 },
      { msg: "🏝️ Vendiste helados en Boca Chica y ganaste 30 monedas.", coins: 30 },
      { msg: "💵 Apostaste en una banca y te llevaste 60 monedas.", coins: 60 },
        { msg: "🎶 Cantaste un dembow en una guagua voladora y te dieron 20 monedas.", coins: 20 },
  { msg: "🚖 Te pusiste a piratiar en un taxi y te ligaste 35 monedas.", coins: 35 },
  { msg: "🤑 Vendiste relojes de imitación en el semáforo y te llevaste 25 monedas.", coins: 25 },
  { msg: "📻 Saliste en una entrevista con Brea Frank y te donaron 50 monedas.", coins: 50 },
  { msg: "🎮 Apostaste en una maquinita y saliste ganando 40 monedas.", coins: 40 },
  { msg: "🃏 Te metiste en un juego de vitilla y perdiste 30 monedas.", coins: -30 },
  { msg: "💸 Te tiraste un tumbe con un maletín y te llevaste 45 monedas.", coins: 45 },
  { msg: "🍻 Te pusiste a vender cervezas frías en el barrio y ganaste 30 monedas.", coins: 30 },
  { msg: "🎭 Actuaste en un anuncio de televisión y te pagaron 40 monedas.", coins: 40 },
  { msg: "🏀 Jugaste un 3 pa' 3 en la cancha y te ganaste 35 monedas.", coins: 35 },
  { msg: "🚲 Te pusiste a hacer delivery con una bicicleta prestada y ganaste 25 monedas.", coins: 25 },
  { msg: "🎤 Te dejaron cantar en una tarima y te dieron 20 monedas.", coins: 20 },
  { msg: "🛒 Trabajaste en un colmado por un día y te pagaron 30 monedas.", coins: 30 },
  { msg: "🎰 Intentaste doblar en la banca pero perdiste 40 monedas.", coins: -40 },
  { msg: "🎥 Apareciste en un video de Tokischa y te pagaron 50 monedas.", coins: 50 },
  { msg: "🚖 Te pusiste a hacer Uber sin licencia y te tumbaron 35 monedas.", coins: -35 },
  { msg: "💵 Te metiste en una pirámide y al final saliste perdiendo 20 monedas.", coins: -20 },
  { msg: "📦 Hiciste mudanza con una camioneta prestada y ganaste 30 monedas.", coins: 30 },
  { msg: "👕 Vendiste ropa de paca en una esquina y te llevaste 40 monedas.", coins: 40 },
  { msg: "🏎️ Apuestaste en una carrera de motores y te llevaste 45 monedas.", coins: 45 },
  { msg: "🚔 Te agarraron en un punto y te tumbaron 50 monedas.", coins: -50 },
  { msg: "🎭 Fuiste extra en una película dominicana y te pagaron 25 monedas.", coins: 25 },
  { msg: "💰 Te pusiste a vender números en la banca y ganaste 35 monedas.", coins: 35 },
  { msg: "🍗 Te fuiste a vender chimis en una esquina y te hiciste 30 monedas.", coins: 30 },
  { msg: "👮‍♂️ La policía te paró y te quitó 20 monedas por andar sin papeles.", coins: -20 },
  { msg: "🛵 Te pusiste a hacer moto delivery y te ganaste 30 monedas.", coins: 30 },
  { msg: "📺 Fuiste a un programa de radio y te pagaron 40 monedas.", coins: 40 },
  { msg: "🥤 Vendiste jugos naturales en el mercado y te hiciste 25 monedas.", coins: 25 },
  { msg: "🏖️ Te pusiste a vender coco frío en la playa y te ganaste 35 monedas.", coins: 35 },
  { msg: "🎲 Jugaste un número en la banca y perdiste 30 monedas.", coins: -30 },
  { msg: "💊 Intentaste vender medicamentos falsos y te tumbaron 45 monedas.", coins: -45 },
  { msg: "🛑 Te atraparon revendiendo boletas y perdiste 20 monedas.", coins: -20 },
  { msg: "🎶 Te metiste a DJ en una fiesta y te pagaron 50 monedas.", coins: 50 },
  { msg: "🎤 Cantaste en el metro y te dieron 30 monedas.", coins: 30 },
  { msg: "🚔 Tolentino te encontró en un teteo ilegal y te tumbaron 40 monedas.", coins: -40 },
  { msg: "🏆 Ganaste un torneo de dominó en el colmadón y te llevaste 35 monedas.", coins: 35 },
  { msg: "💳 Vendiste una tarjeta clonada y te llevaste 50 monedas.", coins: 50 },
  { msg: "🏍️ Te fuiste en carrera con El Cherry y perdiste 25 monedas.", coins: -25 },
  { msg: "📣 Saliste en un meme viral y te donaron 30 monedas.", coins: 30 },
  { msg: "🍾 Trabajaste de bartender en una discoteca y te dieron 45 monedas.", coins: 45 },
  { msg: "💼 Lograste colarte en un evento exclusivo y te ganaste 50 monedas.", coins: 50 },
  { msg: "🚖 Te pusiste a piratear en la Churchill y te tumbaron 30 monedas.", coins: -30 },
  { msg: "🎰 Te metiste en una banca clandestina y te sacaste 60 monedas.", coins: 60 },
  { msg: "🎮 Apostaste en Free Fire y perdiste 20 monedas.", coins: -20 },
  { msg: "📸 Te metiste a fotógrafo en eventos y te pagaron 40 monedas.", coins: 40 },
  { msg: "👞 Vendiste tenis de marca falsos y te ganaste 35 monedas.", coins: 35 },
  { msg: "🚨 Saliste con Honguito a una vuelta y perdiste 50 monedas.", coins: -50 },
  { msg: "🏀 Fuiste recogebolas en un juego de la LNB y te dieron 25 monedas.", coins: 25 },
  { msg: "🚢 Te pusiste a vender gafas de sol en el malecón y ganaste 20 monedas.", coins: 20 },
  { msg: "🍕 Vendiste slices de pizza en una esquina y te llevaste 30 monedas.", coins: 30 },
  { msg: "👑 Apostaste en el colmadón y saliste ganando 50 monedas.", coins: 50 },
  { msg: "🚴 Competiste en una carrera de bicis y te llevaste 35 monedas.", coins: 35 },
  { msg: "📦 Te metiste a mensajero y te pagaron 30 monedas.", coins: 30 },
  { msg: "🏆 Ganaste un torneo de PlayStation y te dieron 40 monedas.", coins: 40 },
  { msg: "🛳️ Te metiste a guía turístico y te dieron 25 monedas.", coins: 25 },
  { msg: "🥃 Vendiste tragos en una fiesta y te ganaste 30 monedas.", coins: 30 },
  { msg: "🛵 Hiciste un mandado express y te pagaron 20 monedas.", coins: 20 },
  { msg: "💡 Creaste un negocio de recargas y te llevaste 35 monedas.", coins: 35 },
  { msg: "📊 Te metiste en un multinivel y perdiste 40 monedas.", coins: -40 },
  { msg: "💰 Le vendiste un celular a un turista y te ganaste 50 monedas.", coins: 50 },
  { msg: "🎶 Fuiste bailarín en un video de dembow y te pagaron 45 monedas.", coins: 45 },
  { msg: "🛒 Vendiste helados en la Duarte y te llevaste 20 monedas.", coins: 20 }

    ];

    let vuelta = vueltas[Math.floor(Math.random() * vueltas.length)];
    userKr.kr += vuelta.coins;

    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await sendReply(`🔄 ${vuelta.msg}\n\n> 💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);
  },
};