const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[【﻿ｓｏｋｙ】 | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[【﻿ｓｏｋｙ】 | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[Operacion 👻 Mashall]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[5m\x1b[32m[【﻿ｓｏｋｙ】 ༴༎ OM]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[【﻿ｓｏｋｙ】 | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[【﻿ｓｏｋｙ】 | ADVERTENCIA]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log("\x1b[34m..######...#######..##....##.##....##\x1b[0m");
  console.log("\x1b[34m.##....##.##.....##.##...##...##..##.\x1b[0m");
  console.log("\x1b[34m.##.......##.....##.##..##.....####..\x1b[0m");
  console.log("\x1b[34m..######..##.....##.#####.......##...\x1b[0m");
  console.log("\x1b[34m.......##.##.....##.##..##......##...\x1b[0m");
  console.log("\x1b[34m.##....##.##.....##.##...##.....##...\x1b[0m");
  console.log("\x1b[34m..######...#######..##....##....##...\x1b[0m");
  console.log("\x1b[32mSoky en línea! 🚀\x1b[0m");
};
