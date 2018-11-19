// Define JSON File
//const obj_require = require("../dummy.json");
const fs = require("fs");

console.log("\n *STARTING* \n");
console.log(obj_require);

// Get content from file
const jsonData = fs.readFileSync("dummy.json");

// Define to JSON type
const obj = JSON.parse(jsonData);

// Get Value from JSON
console.log(jsonData);
console.log(obj);
console.log("User Name:", obj.username);
console.log("Email:", obj.email);
console.log("Password:", obj.password);

console.log("\n *TRAVERSING OBJ* \n");
for (const myKey in obj) {
    console.log(`key: "${myKey}", value: "${obj[myKey]}"`);
}

console.log("\n *EXIT* \n");