const { execSync } = require("child_process");

// Mostramos la configuracion actual de la red del equipo
execSync("Get-NetIPConfiguration");
