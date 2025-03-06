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
      // Buscar imágenes en Pinterest usando la API de DuckDuckGo
      const response = await axios.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(fullArgs)}`);
      
      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new WarningError("No encontré imágenes en Pinterest con esa descripción.");
      }

      // Seleccionar una imagen al azar de los resultados
      const images = response.data.results.map(img => img.image);
      const imageUrl = images[Math.floor(Math.random() * images.length)];

      await sendSuccessReact();
      await sendImageFromURL(imageUrl);

    } catch (error) {
      console.error("Error al buscar imágenes en Pinterest:", error);
      throw new WarningError("Ocurrió un error al buscar imágenes en Pinterest.");
    }
  },
};