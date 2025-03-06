const { PREFIX } = require("../../krampus");
const axios = require("axios");
const { WarningError } = require("../../errors/WarningError");

module.exports = {
  name: "pinterest",
  description: "Busca imágenes en Pinterest según una descripción.",
  commands: ["pinterest", "pin"],
  usage: `${PREFIX}pinterest <descripción>`,
  handle: async ({ fullArgs, sendWaitReact, sendSuccessReact, sendImageFromURL }) => {
    if (!fullArgs.length) {
      throw new WarningError(
        "Vaya...\nañade una descripción para buscar en Pinterest\n> Krampus OM bot"
      );
    }

    await sendWaitReact();

    try {
      // Usamos una API pública de imágenes de Pinterest
      const response = await axios.get(`https://scraping.pics/api/v1/pinterest`, {
        params: {
          query: fullArgs,
          limit: 10, // Número de imágenes a obtener
        },
        headers: {
          "User-Agent": "Mozilla/5.0", // Evita bloqueos
        },
      });

      if (!response.data || response.data.length === 0) {
        throw new WarningError("No encontré imágenes en Pinterest con esa descripción.");
      }

      // Seleccionar una imagen al azar de los resultados
      const images = response.data.map(img => img.image);
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      await sendSuccessReact();
      await sendImageFromURL(imageUrl);

    } catch (error) {
      console.error("Error al buscar imágenes en Pinterest:", error);
      throw new WarningError("Ocurrió un error al buscar imágenes en Pinterest.");
    }
  },
};