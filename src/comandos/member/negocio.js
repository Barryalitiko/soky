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
  name: "negocio",
  description: "Haz un negocio y ve si te salió bien o mal.",
  commands: ["negocio"],
  usage: `${PREFIX}negocio`,
  handle: async ({ sendReply, userJid }) => {
    let krData = readData(krFilePath);
    let userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr) {
      userKr = { userJid, kr: 0 };
      krData.push(userKr);
      writeData(krFilePath, krData);
    }

    const negocios = [
      { msg: "Le metiste mano a un negocito de hookahs y te salió bacano, te ganaste 50 monedas.", coins: 50 },
      { msg: "Intentaste importar celulares desde China, pero llegaron puros muñecos de trapo, perdiste 40 monedas.", coins: -40 },
      { msg: "Te hiciste un negocio de plátanos en el colmado y ganaste 30 monedas.", coins: 30 },
      { msg: "Conseguías dominós en 100 pesos, pero los del colmado se dieron cuenta y te tumbaron 20 monedas.", coins: -20 },
      { msg: "Fuiste a vender pintura en la 27, y te lo compraron todo, te ganaste 40 monedas.", coins: 40 },
      { msg: "Intentaste vender unas cadenas falsas, y te tumbaron 25 monedas en la calle.", coins: -25 },
      { msg: "Hiciste un negocito vendiendo empanadas de la esquina y te ligaste 35 monedas.", coins: 35 },
      { msg: "Compraste ropa de 5 mil pesos a 500, y la vendiste a 600, te ganaste 20 monedas.", coins: 20 },
      { msg: "Te pusiste a vender piña en el malecón y saliste con 30 monedas.", coins: 30 },
      { msg: "Un pana te convenció de comprar celulares robados, pero la policía te los quitó, perdiste 50 monedas.", coins: -50 },
      { msg: "Hiciste una compra de oro trucho y te lo tumbaron, perdiste 35 monedas.", coins: -35 },
      { msg: "Te metiste en el negocio de las bebidas en un party, y le sacaste 25 monedas.", coins: 25 },
      { msg: "Vendiste unos zapatos piratas, y la gente los compró, te ganaste 15 monedas.", coins: 15 },
      { msg: "Intentaste vender mascarillas en la calle, pero te las tumbó un policía, perdiste 10 monedas.", coins: -10 },
      { msg: "Te pusiste a vender jugos naturales y te hicieron un pedido grande, ganaste 50 monedas.", coins: 50 },
      { msg: "Vendiste un celular de segunda mano, pero te dijeron que estaba fallando, perdiste 15 monedas.", coins: -15 },
      { msg: "Te metiste a revender en los colmados y te sacaron 40 monedas.", coins: 40 },
      { msg: "Te vendieron unos tomates podridos en el mercado, perdiste 20 monedas.", coins: -20 },
      { msg: "Intentaste vender unos relojes pirata, pero la gente se dio cuenta, perdiste 30 monedas.", coins: -30 },
      { msg: "Fuiste a venderle agua a los conductores en el semáforo y ligaste 25 monedas.", coins: 25 },
      { msg: "Vende mercas en la Duarte y la policía te tumbó 50 monedas.", coins: -50 },
      { msg: "Te pusiste a vender frituras en un colmado y te ganaste 15 monedas.", coins: 15 },
      { msg: "Intentaste hacer un negocito con unas bocinas truchas y perdiste 40 monedas.", coins: -40 },
      { msg: "Te pusiste a vender empanadas en un party y saliste con 30 monedas.", coins: 30 },
      { msg: "Conseguiste un negocito vendiendo refrescos a 10 pesos y te llevaste 10 monedas.", coins: 10 },
      { msg: "Hiciste un trato con El Alfa para ser su promotor y ganaste 50 monedas.", coins: 50 },
      { msg: "Vendiste unos CDs falsos de Rochy RD y perdiste 20 monedas.", coins: -20 },
      { msg: "Te pusiste a vender fruta en la calle y ganaste 15 monedas.", coins: 15 },
      { msg: "Compraste boletas para el concierto de Dilon Baby y las vendiste más caras, ganaste 40 monedas.", coins: 40 },
      { msg: "Intentaste vender equipos de sonido robados y la policía te tumbó 30 monedas.", coins: -30 },
      { msg: "Te pusiste a vender pan de agua en los semáforos y saliste con 20 monedas.", coins: 20 },
      { msg: "Te pusiste a revender ropa de segunda mano en el mercado y ganaste 25 monedas.", coins: 25 }
    ];

    let negocio = negocios[Math.floor(Math.random() * negocios.length)];
    userKr.kr += negocio.coins;

    krData = krData.map(entry => (entry.userJid === userJid ? userKr : entry));
    writeData(krFilePath, krData);

    await sendReply(`💼 Hiciste un negocio y esto pasó: ${negocio.msg}\n\n> 💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);
  },
};