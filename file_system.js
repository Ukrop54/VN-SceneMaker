let FS = {};

fetch("/api/characters")
   .then((res) => res.json())
   .then((data) => {
      FS = data;
   });

let currentState = {
   game: "",
   mod: "",
   position: "",
   character: "",
   bodyType: "",
   clothes: null,
   emotion: null,
   accessory: null,
};

let step = "game";

function setDirectLayer(id, file) {
   if (!file) {
      document.getElementById(id).src = "";
      return;
   }
   const path = `assets/characters/${currentState.game}/${currentState.mod}/${currentState.position}/${currentState.character}/${file}`;
   document.getElementById(id).src = path;
}

function clearLayer(id) {
   document.getElementById(id).src = "";
}

function getFiles() {
   if (!currentState.character) return [];
   return FS[currentState.game]?.[currentState.mod]?.[currentState.position]?.[currentState.character] || [];
}

function splitFiles() {
   const files = getFiles();
   const result = { clothes: [], emotions: [], accessories: [] };

   files.forEach((file) => {
      if (!file.startsWith(currentState.bodyType + "_")) return;

      if (isEmotion(file)) result.emotions.push(file);
      else if (isAccessory(file)) result.accessories.push(file);
      else result.clothes.push(file);
   });

   return result;
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
   const acc = ["glasses", "hat", "cap", "panama", "stethoscope", "watch", "bag"];
   return acc.some((a) => file.includes("_" + a));
}

function renderLeftPanel() {
   renderCategory("body", "#left-body", getAllBodies(), true);
   renderCategory("clothes", "#left-clothes", splitFiles().clothes, false);
   renderCategory("emotion", "#left-emotions", splitFiles().emotions, false);
   renderCategory("accessory", "#left-decor", splitFiles().accessories, false);
}

function getAllBodies() {
   return getFiles().filter((f) => f.includes("_body"));
}

function renderCategory(type, containerId, files, isBody = false) {
   const container = document.querySelector(containerId);
   if (!container) return;
   container.innerHTML = "";

   if (!isBody) {
      const noneDiv = createOptionDiv("None", !currentState[type]);
      noneDiv.onclick = () => {
         currentState[type] = null;
         clearLayer(`char-${type === "accessory" ? "accessory" : type}`);
         renderLeftPanel();
      };
      container.appendChild(noneDiv);
   }

   files.forEach((file) => {
      const isSelected = isBody ? file.includes(currentState.bodyType) : file === currentState[type];

      const div = createOptionDiv(file, isSelected);

      div.onclick = () => {
         if (isBody) {
            currentState.bodyType = file.split("_body")[0];
            currentState.clothes = null;
            currentState.emotion = null;
            currentState.accessory = null;

            setDirectLayer("char-body", file);
            clearLayer("char-clothes");
            clearLayer("char-emotion");
            clearLayer("char-accessory");
         } else {
            currentState[type] = file;
            setDirectLayer(`char-${type === "accessory" ? "accessory" : type}`, file);
         }
         renderLeftPanel();
      };
      container.appendChild(div);
   });
}

function createOptionDiv(text, isSelected) {
   const div = document.createElement("div");
   div.className = `character-option ${isSelected ? "selected" : ""}`;
   div.textContent = text;
   return div;
}

document.getElementById("chchoosemodal").addEventListener("shown.bs.modal", () => {
   step = "game";
   render();
});

function render() {
   const container = document.getElementById("sprite-explorer");
   container.innerHTML = "";

   if (step === "game") {
      Object.keys(FS).forEach((game) => {
         addItem(container, "Game: " + game, () => {
            currentState.game = game;
            step = "mod";
            render();
         });
      });
   } else if (step === "mod") {
      Object.keys(FS[currentState.game]).forEach((mod) => {
         addItem(container, "Mod: " + mod, () => {
            currentState.mod = mod;
            step = "position";
            render();
         });
      });
   } else if (step === "position") {
      Object.keys(FS[currentState.game][currentState.mod]).forEach((pos) => {
         addItem(container, "Position: " + pos, () => {
            currentState.position = pos;
            step = "character";
            render();
         });
      });
   } else if (step === "character") {
      Object.keys(FS[currentState.game][currentState.mod][currentState.position]).forEach((ch) => {
         addItem(container, "Character: " + ch, () => {
            currentState.character = ch;
            step = "body";
            render();
         });
      });
   } else if (step === "body") {
      const bodies = getAllBodies();
      bodies.forEach((file) => {
         addItem(container, file, () => {
            currentState.bodyType = file.split("_body")[0];
            setDirectLayer("char-body", file);
            step = "clothes";
            render();
            renderLeftPanel();
         });
      });
   } else if (step === "clothes") {
      const data = splitFiles();
      addNoneItem(container, "char-clothes", "clothes");
      data.clothes.forEach((file) => {
         addItem(container, file, () => {
            currentState.clothes = file;
            setDirectLayer("char-clothes", file);
            renderLeftPanel();
         });
      });
      next(container, "emotion");
   } else if (step === "emotion") {
      const data = splitFiles();
      addNoneItem(container, "char-emotion", "emotion");
      data.emotions.forEach((file) => {
         addItem(container, file, () => {
            currentState.emotion = file;
            setDirectLayer("char-emotion", file);
            renderLeftPanel();
         });
      });
      next(container, "accessory");
   } else if (step === "accessory") {
      const data = splitFiles();
      addNoneItem(container, "char-accessory", "accessory");
      data.accessories.forEach((file) => {
         addItem(container, file, () => {
            currentState.accessory = file;
            setDirectLayer("char-accessory", file);
            renderLeftPanel();
         });
      });
   }

   back(container);
}

function addNoneItem(container, layerId, stateKey) {
   addItem(container, "None", () => {
      currentState[stateKey] = null;
      clearLayer(layerId);
      renderLeftPanel();
   });
}

function addItem(container, text, clickHandler) {
   const el = document.createElement("div");
   el.className = "explorer-item";
   el.textContent = text;
   el.onclick = clickHandler;
   container.appendChild(el);
}

function next(container, nextStep) {
   const el = document.createElement("div");
   el.className = "explorer-item";
   el.textContent = "→ Далее";
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
   el.textContent = "← Назад";
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

document.getElementById("chchoosemodal").addEventListener("shown.bs.modal", () => {
   renderLeftPanel();
});

window.addEventListener("load", () => {
   renderLeftPanel();
});
