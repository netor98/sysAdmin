const fs = require("fs");

const replaceIpServer = (filePath, newIP) => {
    const searchText = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d+\b/g;
    const data = fs.readFileSync(filePath, "utf8");
    const regex = new RegExp(searchText, "g");
    const newData = data.replace(regex, newIP);
    fs.writeFileSync(filePath, newData, "utf8");
};

module.exports = {
    replaceIpServer,
};
