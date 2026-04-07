let FS = {};

fetch("/api/characters")
   .then((res) => res.json())
   .then((data) => {
      FS = data;
   });

fetch("/api/characters")
   .then((res) => res.json())
   .then((data) => {
      FS = data;
      console.log("FS:", FS); // 👈 ВОТ ЭТО
   });

let state = {
   game: "",
   mod: "",
   position: "",
   character: "",
   bodyType: "",
};

document.getElementById("chchoosemodal").addEventListener("shown.bs.modal", () => {
   step = "game";
   render();
});

function render() {
   const container = document.getElementById("sprite-explorer");
   container.innerHTML = "";

   if (step === "game") {
      Object.keys(FS).forEach((game) => {
         addItem(container, "🎮 " + game, () => {
            state.game = game;
            step = "mod";
            render();
         });
      });
   } else if (step === "mod") {
      Object.keys(FS[state.game]).forEach((mod) => {
         addItem(container, "🧩 " + mod, () => {
            state.mod = mod;
            step = "position";
            render();
         });
      });
   } else if (step === "position") {
      Object.keys(FS[state.game][state.mod]).forEach((position) => {
         addItem(container, "📏 " + position, () => {
            state.position = position;
            step = "character";
            render();
         });
      });
   } else if (step === "character") {
      Object.keys(FS[state.game][state.mod][state.position]).forEach((ch) => {
         addItem(container, "👤 " + ch, () => {
            state.character = ch;
            step = "body";
            render();
         });
      });
   } else if (step === "body") {
      const files = getFiles();

      const bodies = files.filter((f) => f.includes("_body"));

      bodies.forEach((file) => {
         addItem(container, "🧍 " + file, () => {
            state.bodyType = file.split("_body")[0]; // dv_1
            setDirectLayer("char-body", file);

            step = "clothes";
            render();
         });
      });
   } else if (step === "clothes") {
      const data = splitFiles();

      data.clothes.forEach((file) => {
         addItem(container, "👕 " + file, () => {
            setDirectLayer("char-clothes", file);
         });
      });

      next(container, "emotion");
   } else if (step === "emotion") {
      const data = splitFiles();

      data.emotions.forEach((file) => {
         addItem(container, "😊 " + file, () => {
            setDirectLayer("char-emotion", file);
         });
      });

      next(container, "accessory");
   } else if (step === "accessory") {
      const data = splitFiles();

      data.accessories.forEach((file) => {
         addItem(container, "🕶 " + file, () => {
            setDirectLayer("char-accessory", file);
         });
      });
   }

   back(container);
}

function splitFiles() {
   const files = getFiles();

   const result = {
      body: [],
      clothes: [],
      emotions: [],
      accessories: [],
   };

   files.forEach((file) => {
      if (!file.startsWith(state.bodyType)) return;

      if (file.includes("_body")) {
         result.body.push(file);
      } else if (isEmotion(file)) {
         result.emotions.push(file);
      } else if (isAccessory(file)) {
         result.accessories.push(file);
      } else {
         result.clothes.push(file);
      }
   });

   return result;
}

function getFiles() {
   if (!state.character) return [];
   return FS[state.game][state.mod][state.position][state.character];
}

function setDirectLayer(id, file) {
   const path = `assets/characters/${state.game}/${state.mod}/${state.position}/${state.character}/${file}`;
   document.getElementById(id).src = path;
}

function isEmotion(file) {
   const emotions = [
      "angry",
      "cry",
      "sad",
      "smile",
      "surprise",
      "shy",
      "laugh",
      "serious",
      "normal",
      "fingal",
      "upset",
      "grin",
      "scared",
      "bored",
      "sweat",
      "confused",
      "dizzy",
      "scream",
      "smug",
      "pout",
      "sweatdrop",
      "guilty",
      "dontlike",
      "bukal",
      "tender",
      "evil_smile",
      "cry_smile",
      "calml",
      "fear",
      "surp",
      "shocked",
   ];

   return emotions.some((e) => file.includes("_" + e));
}

function isAccessory(file) {
   const acc = ["glasses", "hat", "cap", "panama", "stethoscope", "stetoscope", "watch", "bag"];

   return acc.some((a) => file.includes("_" + a));
}

function getData() {
   return FS[state.game][state.mod][state.character];
}

function addItem(container, text, click) {
   const el = document.createElement("div");
   el.className = "explorer-item";
   el.innerHTML = text;
   el.onclick = click;

   container.appendChild(el);
}

function next(container, nextStep) {
   const el = document.createElement("div");
   el.className = "explorer-item";
   el.innerHTML = "➡ Далее";
   el.onclick = () => {
      step = nextStep;
      render();
   };
   container.appendChild(el);
}

function back(container) {
   if (step === "game") return;

   const el = document.createElement("div");
   el.className = "explorer-item";
   el.innerHTML = "⬅ Назад";

   el.onclick = () => {
      if (step === "mod") step = "game";
      else if (step === "position") step = "mod";
      else if (step === "character") step = "position";
      else if (step === "body") step = "character";
      else if (step === "clothes") step = "body";
      else if (step === "emotion") step = "clothes";
      else if (step === "accessory") step = "emotion";

      render();
   };

   container.prepend(el);
}

// function loadBody() {
//    const findbody = str.includes("body.png");
//    const path = `assets/characters/${state.game}/${state.mod}/${state.position}/${state.character}/${findbody}`;
//    document.getElementById("char-body").src = path;
// }

// function setLayer(id, folder, file) {
//    const path = `assets/characters/${state.game}/${state.mod}/${state.position}/${state.character}/${folder}/${file}`;
//    document.getElementById(id).src = path;
// }
