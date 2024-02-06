require("colors");
const { saveIpStart, pausa, saveIpEnd } = require("./helpers/mensajes.js");
const { menuInquirer } = require("./helpers/questions.js");
console.clear();

const main = async () => {
    /*
    const ips = await saveIpStart();
    const ipsEnd = await saveIpEnd();
    console.log(ips, ipsEnd);
    pausa();
    */
    opt = await menuInquirer();
    console.log(opt.opcion);
};

main();
