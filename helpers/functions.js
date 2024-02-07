const fs = require("fs");
const buscarTextoEnArchivo = (filePath) => {
    const searchText = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+\b/g;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return;
        }

        // Buscar el texto en el contenido del archivo
        const matches = data.match(searchText);

        if (matches) {
            console.log("El texto se encontró en el archivo:", matches);
        } else {
            console.log("El texto no se encontró en el archivo.");
        }
    });
};

module.exports = {
    buscarTextoEnArchivo,
};
