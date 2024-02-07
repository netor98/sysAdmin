const fs = require("fs");
const buscarTextoEnArchivo = (filePath, newIp) => {
    const searchText = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+\b/g;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo:", err);
            return;
        }

        // Reemplazar el texto en el contenido del archivo
        const newData = data.replace(searchText, newIp);

        // Escribir los cambios en el archivo
        fs.writeFile(filePath, newData, "utf8", (err) => {
            if (err) {
                console.error("Error al escribir en el archivo:", err);
                return;
            }
            console.log("El texto se reemplazó en el archivo correctamente.");
        });
    });
};

module.exports = {
    buscarTextoEnArchivo,
};
