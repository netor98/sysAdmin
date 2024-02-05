require("colors");
const { mostrarMenu, pausa } = require("./helpers/mensajes.js");
console.clear();

const main = async () => {
    mostrarMenu();
    pausa();
};

main();
