// 1) Create a server and handle this route /delete-file?filepath=test.txt,
//and delete this file, if this file does not exists handle some error message.

// const http = require('http');
// const url = require('url');
// const fs = require('fs');
// const path = require('path');

// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);
//   const pathname = parsedUrl.pathname;
//   const filepath = parsedUrl.query.filepath;

//   if (pathname === '/delete-file') {
//     if (!filepath) {
//       res.writeHead(400, { 'Content-Type': 'text/plain' });
//       return res.end('Error: No filepath provided.');
//     }

//     const fullPath = path.join(__dirname, filepath);

//     fs.unlink(fullPath, (err) => {
//       if (err) {
//         if (err.code === 'ENOENT') {
//           res.writeHead(404, { 'Content-Type': 'text/plain' });
//           res.end(`Error: File "${filepath}" does not exist.`);
//         } else {
//           res.writeHead(500, { 'Content-Type': 'text/plain' });
//           res.end(`Error deleting file: ${err.message}`);
//         }
//       } else {
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end(`File "${filepath}" was successfully deleted.`);
//       }
//     });
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('Route not found.');
//   }
// });

// server.listen(4000, () => {
//   console.log('Server is running on http://localhost:4000');
// });

// 2) Create a server that handles products CRUD. create products.json and paste some products data.
// user should add/update/delete/get products. There should be pagination and also
//add filters like /posts?priceFrom=100&priceTo=300 should return all products within price range of 100-300.

const fs = require("fs/promises");
const http = require("http");
const url = require("url");
const { readFileAndParse, writeFileAndStringify } = require("./units.js");

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);


  if (parsedUrl.pathname === "/products" && req.method === "GET") {
    const { page = 1, limit = 10 } = parsedUrl.query;
    const products = await readFileAndParse("products.json", true);
  
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + Number(limit));
  
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(paginatedProducts));
  }


  if (parsedUrl.pathname === "/products" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const parsedData = JSON.parse(body);

      const products = await readFileAndParse("products.json", true);
      const lastId = products.length > 0 ? products[products.length - 1].id : 0;
      const newUser = {
        id: lastId + 1,
        name: parsedData.name,
        price: parsedData.price,
      };

      products.push(newUser);
      await writeFileAndStringify("products.json", products, true);

      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("products added successfully");
    });
  }

  if (parsedUrl.pathname === "/products" && req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const parsedData = JSON.parse(body);

      const products = await readFileAndParse("products.json", true);
      const updatedUsers = products.map((user) =>
        user.id === parsedData.id ? parsedData : user
      );

      await writeFileAndStringify("products.json", updatedUsers, true);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("products updated successfully");
    });
  }

  if (parsedUrl.pathname === "/products" && req.method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const parsedData = JSON.parse(body);

      const products = await readFileAndParse("products.json", true);
      const updatedUsers = products.filter((user) => user.id !== parsedData.id);

      await writeFileAndStringify("products.json", updatedUsers, true);

      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("products deleted successfully");
    });
  }
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

// 3) Create a server and handle this route /time?city=London, it should return what time is that city.
// Try to support few countries like NY, Berlin, Madrid, Pekin, Kiev and etc.


// const http = require("http");
// const { parse } = require("url");


// const cityTimeZones = {
//   london: "Europe/London",
//   berlin: "Europe/Berlin",
//   madrid: "Europe/Madrid",
//   pekin: "Asia/Shanghai", 
//   kiev: "Europe/Kyiv",
//   ny: "America/New_York",
// };

// const server = http.createServer((req, res) => {
//   const parsedUrl = parse(req.url, true);

//   if (parsedUrl.pathname === "/time" && req.method === "GET") {
//     const cityParam = parsedUrl.query.city;

//     if (!cityParam) {
//       res.writeHead(400, { "Content-Type": "text/plain" });
//       return res.end("Please provide a city name using ?city=CityName");
//     }

//     const city = cityParam.toLowerCase();
//     const timeZone = cityTimeZones[city];

//     if (!timeZone) {
//       res.writeHead(404, { "Content-Type": "text/plain" });
//       return res.end("City not supported.");
//     }

//     const date = new Date();
//     const cityTime = new Intl.DateTimeFormat("en-US", {
//       timeZone,
//       timeStyle: "full",
//       dateStyle: "full",
//     }).format(date);

//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end(`Current time in ${cityParam} is:\n${cityTime}`);
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("Route not found.");
//   }
// });

// server.listen(4000, () => {
//   console.log("Server is running at http://localhost:4000");
// });
