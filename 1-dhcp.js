require("colors");
const fs = require("fs");
const { spawn, exec } = require("child_process");

const os = require("os");
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

const { replaceIpServer } = require("./helpers/functions.js");

const {
    consoleAnimation,
    isPackageInstalled,
    powershellCommands,
} = require("./helpers/commands.js");

let prefix = "";
console.clear();

const main = async () => {
    let packageNameToCheck = "";
    menuStart();

    const osName = await consoleAnimation(
        "Verificando el sistema operativo",
        os.platform()
    );

    if (osName !== "win32") packageNameToCheck = "isc-dhcp-server";
    else packageNameToCheck = "Dhcp-server";

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

    const ipServer = await saveIpServer();
    const ipNet = await saveIpNetwork();
    const mask = await saveMask();
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const dns = await saveDNS();
    const time = await saveReleaseTime();
    const broadcast = await saveBroadcast();

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

    if (osName == "linux") {
        fs.writeFileSync("/etc/dhcp/dhcpd.conf", dhcpConfig);
        if (mask == "255.255.255.0") prefix = "/24";
        if (mask == "255.255.0.0") prefix = "/32";
        if (mask == "255.0.0.0") prefix = "/40";

        replaceIpServer(
            "/etc/netplan/00-installer-config.yaml",
            `${ipServer}${prefix}`
        );
        exec("sudo netplan apply", (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
        });

        const process = spawn("bash", ["./restrtService.sh"]);
        process.on("exit", (code) => {});
    } else {
        powershellCommands(ips, ipsEnd, mask, gateaway, time, dns);
    }
    pausa();
};

main();
