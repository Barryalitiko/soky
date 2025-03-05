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
      { msg: "💵 Apostaste en una banca y te llevaste 60 monedas.", coins: 60 }
    ];

    let vuelta = vueltas[Math.floor(Math.random() * vueltas.length)];
    userKr.kr += vuelta.coins;

    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await sendReply(`🔄 ${vuelta.msg}\n\n> 💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);
  },
};