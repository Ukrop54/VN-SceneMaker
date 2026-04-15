const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

function scanCharacters(basePath) {
   const result = {};

   const games = fs.readdirSync(basePath);

   games.forEach((game) => {
      result[game] = {};

      const gamePath = path.join(basePath, game);
      const mods = fs.readdirSync(gamePath);

      mods.forEach((mod) => {
         result[game][mod] = {};

         const modPath = path.join(gamePath, mod);

         const positions = fs.readdirSync(modPath).filter((p) => fs.lstatSync(path.join(modPath, p)).isDirectory());

         positions.forEach((position) => {
            result[game][mod][position] = {};

            const posPath = path.join(modPath, position);

            const characters = fs.readdirSync(posPath).filter((c) => fs.lstatSync(path.join(posPath, c)).isDirectory());

            characters.forEach((char) => {
               const charPath = path.join(posPath, char);

               const files = fs.readdirSync(charPath).filter((f) => f.endsWith(".png"));

               result[game][mod][position][char] = files;
            });
         });
      });
   });

   return result;
}

app.get("/api/characters", (req, res) => {
   const data = scanCharacters(path.join(__dirname, "assets/characters"));
   res.json(data);
});

app.get("/api/backgrounds", (req, res) => {
   const bgdata = path.join(__dirname, "assets/backgrounds");
   res.json(bgdata);
});

app.listen(PORT, () => {
   console.log(`Server running: http://localhost:${PORT}`);
});
