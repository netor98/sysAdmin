require("colors");
const os = require("os");
const {
    saveIpStart,
    pausa,
    saveIpEnd,
    saveGateaway,
} = require("./helpers/mensajes.js");
console.clear();

const main = async () => {
    console.log(os.platform());
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    const gateaway = await saveGateaway();
    console.log(ips, ipsEnd, gateaway);
    pausa();
};

main();
