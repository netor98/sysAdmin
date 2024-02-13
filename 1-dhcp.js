require("colors"); // libreria para colores
const fs = require("fs"); // libreria para manejar archivos
const { exec, execSync } = require("child_process"); // libreria para realizar comandos internos

const os = require("os");

// Funciones para pedir los datos del servidor dhcp
const {
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveBroadcast,
    saveDNS,
    saveReleaseTime,
    saveIpNetwork,
    saveMask,
    saveIpServer,
} = require("./helpers/mensajes.js");

const { replaceIpServer } = require("./helpers/functions.js"); // función para reemplazar la ip en linux
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const {
    consoleAnimation,
    isPackageInstalled,
} = require("./helpers/commands.js");

let prefix = "";
console.clear();

const main = async () => {
    let packageNameToCheck = ""; //variable para el paquete del servidor dhcp
    menuStart(); // se inicializa el pedido de datos

    const osName = await consoleAnimation(
        "Verificando el sistema operativo",
        os.platform()
    ); // Se detecta el sistema operativo

    if (osName !== "win32") packageNameToCheck = "isc-dhcp-server"; // linux
    else packageNameToCheck = "Dhcp-server"; // paquete dhcp windows

    const searchPackage = await isPackageInstalled(osName); // se detecta si el paquete esta instalado o no
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

    // GUARDADO DE LAS VARIABLES CON LA CONFIGURACIÓN DEL DHCP
    const ipServer = await saveIpServer();
    const ipNet = await saveIpNetwork();
    const mask = await saveMask();
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const dns = await saveDNS();
    const time = await saveReleaseTime();
    const broadcast = await saveBroadcast();

    // SE DETERMINA EL PREFIJO DE BITS
    if (mask == "255.255.255.0") prefix = "/24";
    if (mask == "255.255.0.0") prefix = "/32";
    if (mask == "255.0.0.0") prefix = "/40";

    if (osName == "linux") {
        // CONFIGURACIPON PARA LINUX
        dhcpConfig = `
            subnet ${ipNet} netmask ${mask} {
                range ${ips} ${ipsEnd};
                option domain-name-servers ${dns};
                option domain-name "example.org";
                option subnet-mask ${mask};
                option routers ${ipServer};
                option broadcast-address ${broadcast};
                default-lease-time ${time};
            }`;

        fs.writeFileSync("/etc/dhcp/dhcpd.conf", dhcpConfig); // SE ESCRIBE LA NUEVA CONFIGURACION EN EL ARCHIVO

        replaceIpServer(
            "/etc/netplan/00-installer-config.yaml",
            `${ipServer}${prefix}`
        ); //SE CAMBIA LA IP DEL SERVIDOR

        // SE APLICAN LOS CAMBIOS
        exec("sudo netplan apply", (error, stdout, stderr) => {
            const processStop = exec("sudo systemctl stop isc-dhcp-server"); // SE DETIENE EL SERVIDOR

            processStop.on("exit", async (code) => {
                if (code === 0) {
                    await delay(2000); // SE ESPERA DOS SEGUNDOS PARA NO GENERAR CONFLICTOS
                    const processStart = exec(
                        "sudo systemctl start isc-dhcp-server" // SE INICIA EL SERVIDOR
                    );

                    processStart.on("exit", () => {
                        console.log("\nSERVICIO DHCP RENICIADO\n");
                        pausa();
                    });
                } else {
                }
            });
        });
    } else {
        // CONFIGURACIÓN PARA WINDOWS
        const defaultInterface = 6;

        // SE MODIFCA LA INTERFAZ DE RED CON LA NUEVA IP DEL SERVIDOR
        execSync(
            `powershell New-NetIPAddress -InterfaceIndex ${defaultInterface} -IPAddress ${ipServer} -PrefixLength ${prefix.slice(
                1
            )}`
        );

        // SE CREA EL SERVIDOR CON LA CONFIGURACIÓN DADA (RANGOS, MASCARA)
        execSync(
            `powershell Add-DhcpServerV4Scope ${ipServer} -StartRange ${ips} -EndRange ${ipsEnd} -SubnetMask ${mask}`,
            {
                stdio: "inherit",
            }
        );

        // SE REINICA EL SERVIDOR DHCP
        execSync("powershell Restart-Service dhcpserver", { stdio: "inherit" });
    }
};

main();
