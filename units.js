const fs = require("fs/promises");
const { stringify } = require("querystring");

const readFileAndParse = async (filePath, Parse) => {
    if(!filePath) return;
    const readData = await fs.readFile(filePath, "utf-8");
    return Parse? JSON.parse(readData) : readData;
}


const writeFileAndStringify = async (filePath,data, stringify) =>{
if(!filePath) return;
const readData = stringify? JSON.stringify(data) : data;


await fs.writeFile(filePath, readData);
console.log("File written successfully");

}

module.exports = {readFileAndParse, writeFileAndStringify}