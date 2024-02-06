require("colors");
const fs = require("fs");
const { execSync } = require("child_process");

const os = require("os");
const {
    menuStart,
    saveIpStart,
    pausa,
    saveIpEnd,
    saveGateaway,
    saveDNS,
    saveReleaseTime,
    saveIpNetwork,
    saveMask,
} = require("./helpers/mensajes.js");

const {
    consoleAnimation,
    isPackageInstalled,
} = require("./helpers/commands.js");
console.clear();

const main = async () => {
    let currentConfig = fs.readFileSync("/etc/dhcp/dhcpd.conf", "utf-8");
    currentConfig = currentConfig.replace(/subnet [\s\S]+?}/, "");
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

    const ipNet = await saveIpNetwork();
    const mask = await saveMask();
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const gateaway = await saveGateaway();
    const dns = await saveDNS();
    const time = await saveReleaseTime();

    dhcpConfig = `
    subnet ${ipNet} netmask ${mask} {
        range ${ips} ${ipsEnd};
        option domain-name-servers example.org;
        option domain-name ${dns};
        option subnet-mask ${mask};
        option routers ${gateaway};
        default-lease-time ${time};
    }`;

    const updatedConfig = currentConfig.trim() + "\n" + dhcpConfig.trim();
    fs.writeFileSync("/etc/dhcp/dhcpd.conf", updatedConfig);
    execSync("systemctl restart isc-dhcp-server", { stdio: "inherit" });
    pausa();
};

main();
