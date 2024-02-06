require("colors");
const os = require("os");
const {
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveGateaway,
} = require("./helpers/mensajes.js");

const {
    consoleAnimation,
    isPackageInstalled,
} = require("./helpers/commands.js");
console.clear();

const main = async () => {
    let packageNameToCheck = "";
    menuStart();

    const osName = await consoleAnimation(
        "Verificando el sistema operativo",
        os.platform()
    );

    if (osName !== "win32") packageNameToCheck = "isc-dhcp-server";
    else packageNameToCheck = "win32";

    const searchPackage = await isPackageInstalled(osName);
    if (searchPackage)
        await consoleAnimation(
            "Buscando paquetes",
            packageNameToCheck + " esta instalado"
        );
    else {
        await consoleAnimation(
            "Buscando paquetes",
            packageNameToCheck + " esta NO instalado"
        );
    }

    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const gateaway = await saveGateaway();
    console.log(ips, ipsEnd, gateaway, osName);
    pausa();
};

main();
