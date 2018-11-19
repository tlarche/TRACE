// Read Synchrously
const fs = require("fs");
console.log("\n *START* \n");
const content = fs.readFileSync("dummy.json");
console.log("Output Content : \n" + content);
console.log("\n *EXIT* \n");