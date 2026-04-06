const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

function scanCharacters(basePath) {
   const result = {};

   if (!fs.existsSync(basePath)) return result;

   const games = fs.readdirSync(basePath);

   games.forEach((game) => {
      result[game] = {};

      const gamePath = path.join(basePath, game);
      const mods = fs.readdirSync(gamePath);

      mods.forEach((mod) => {
         result[game][mod] = {};

         const modPath = path.join(gamePath, mod);
         const chars = fs.readdirSync(modPath);

         chars.forEach((char) => {
            const charPath = path.join(modPath, char);

            result[game][mod][char] = {
               body: "body.png",
               clothes: getFiles(charPath, "clothes"),
               emotions: getFiles(charPath, "emotions"),
               accessories: getFiles(charPath, "accessories"),
            };
         });
      });
   });

   return result;
}

function getFiles(base, folder) {
   const fullPath = path.join(base, folder);
   if (!fs.existsSync(fullPath)) return [];
   return fs.readdirSync(fullPath);
}

app.get("/api/characters", (req, res) => {
   const data = scanCharacters(path.join(__dirname, "assets/characters"));
   res.json(data);
});

app.listen(PORT, () => {
   console.log(`Server running: http://localhost:${PORT}`);
});
