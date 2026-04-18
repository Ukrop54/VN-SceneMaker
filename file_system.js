let FS = {};
let BGFS = {};

document.getElementById("bgchoosemodal").addEventListener("shown.bs.modal", () => {
   bgStep = "game";
   renderBGSelector();
});

fetch("/api/characters")
   .then((res) => res.json())
   .then((data) => {
      FS = data;
   });

// fetch("/api/backgrounds")
//    .then((res) => res.json())
//    .then((data) => {
//       BGFS = data;
//    });

fetch("/api/backgrounds")
   .then((res) => {
      if (!res.ok) throw new Error("API error");
      return res.json();
   })
   .then((data) => {
      BGFS = data;
   })
   .catch((err) => {
      console.error("BG load error:", err);
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

let currentBgState = {
   background: "",
   mod: "",
   category: "",
   page: 0,
   selected: null,
};

const ITEMS_PER_PAGE = 9;

function getBGPath(file) {
   return `assets/backgrounds/${currentBgState.game}/${currentBgState.mod}/${currentBgState.category}/${file}`;
}

function getBgFiles() {
   return BGFS[currentBgState.game]?.[currentBgState.mod]?.[currentBgState.category] || [];
}

function setBackgroundFromState(file) {
   currentBgState.selected = file;
   document.getElementById("bg").src = getBGPath(file);
}

function paginate(files, page = 0) {
   const start = page * ITEMS_PER_PAGE;
   return files.slice(start, start + ITEMS_PER_PAGE);
}

function renderBGGrid(container) {
   const files = paginate(getBgFiles(), currentBgState.page);

   container.innerHTML = "";

   const grid = document.createElement("div");
   grid.className = "bg-grid";

   files.forEach((file) => {
      const img = document.createElement("img");
      img.src = getBGPath(file);
      img.loading = "lazy";
      img.className = "bg-thumb";
      img.crossOrigin = "anonymous";

      if (file === currentBgState.selected) {
         img.classList.add("selected");
      }

      img.onclick = () => {
         setBackgroundFromState(file);
         renderBGExplorer();
      };

      grid.appendChild(img);
   });

   container.appendChild(grid);
}

function renderPagination(container, total) {
   const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

   const nav = document.createElement("div");
   nav.className = "bg-pagination";

   nav.style.display = "flex";
   nav.style.alignItems = "center";
   nav.style.gap = "10px";

   const prev = document.createElement("button");
   prev.textContent = "←";
   prev.disabled = currentBgState.page === 0;
   prev.className = "btn btn-outline-light";

   prev.onclick = () => {
      currentBgState.page--;
      renderBGExplorer();
   };

   const next = document.createElement("button");
   next.textContent = "→";
   next.disabled = currentBgState.page >= totalPages - 1;
   next.className = "btn btn-outline-light";

   next.onclick = () => {
      currentBgState.page++;
      renderBGExplorer();
   };

   const pageText = document.createElement("span");
   pageText.textContent = `${currentBgState.page + 1} / ${totalPages}`;

   nav.append(prev, pageText, next);
   container.appendChild(nav);
}

function renderBGExplorer() {
   const container = document.getElementById("background-explorer");
   bgStep = "viewer";
   if (!container) return;

   const files = getBgFiles();

   container.innerHTML = "";

   renderBGGrid(container);
   bgback(container);
   renderPagination(container, files.length);
}

let step = "game";
let bgStep = "game";

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

function resetCharacterLayers() {
   currentState.bodyType = "";
   currentState.clothes = null;
   currentState.emotion = null;
   currentState.accessory = null;

   clearLayer("char-body");
   clearLayer("char-clothes");
   clearLayer("char-emotion");
   clearLayer("char-accessory");
}

function getFiles() {
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
      "rage",
      "happy",
   ];
   return emotions.some((e) => file.includes("_" + e));
}

function renderBGSelector() {
   // const container = document.getElementById("bg-selector");
   const container = document.getElementById("background-explorer");

   container.innerHTML = "";

   if (bgStep === "game") {
      Object.keys(BGFS).forEach((game) => {
         addItem(container, game, () => {
            currentBgState.game = game;
            bgStep = "mod";
            renderBGSelector();
         });
      });
   } else if (bgStep === "mod") {
      Object.keys(BGFS[currentBgState.game]).forEach((mod) => {
         addItem(container, mod, () => {
            currentBgState.mod = mod;
            bgStep = "category";
            renderBGSelector();
         });
      });
   } else if (bgStep === "category") {
      Object.keys(BGFS[currentBgState.game][currentBgState.mod]).forEach((cat) => {
         addItem(container, cat, () => {
            currentBgState.category = cat;
            currentBgState.page = 0;

            renderBGExplorer();
         });
      });
   }
   bgback(container);
}

function bgback(container) {
   if (bgStep === "game") return;
   const el = document.createElement("div");
   el.className = "explorer-item";
   el.textContent = "← Назад";
   el.onclick = () => {
      if (bgStep === "mod") {
         bgStep = "game";
         currentBgState.game = "";
      } else if (bgStep === "category") {
         bgStep = "mod";
         currentBgState.mod = "";
      } else if (bgStep === "viewer") {
         bgStep = "category";
      }
      renderBGSelector();
   };

   container.prepend(el);
}

function isAccessory(file) {
   const acc = ["glasses", "hat", "cap", "panama", "stethoscope", "watch", "bag"];
   return acc.some((a) => file.includes("_" + a));
}

function renderLeftPanel() {
   if (!currentState.bodyType) {
      $(".sprite-editor").hide();
      $("#posslider").hide();
      $("#preview-scene-container").hide();
      $("#addcharacter").show();
      return;
   }
   $(".sprite-editor").show("slow");
   $("#posslider").show("slow");
   $("#preview-scene-container").show("slow");
   $("#addcharacter").hide("slow");

   renderCategory("body", "#left-body", getAllBodies(), true);
   renderCategory("clothes", "#left-clothes", splitFiles().clothes);
   renderCategory("emotion", "#left-emotions", splitFiles().emotions);
   renderCategory("accessory", "#left-decor", splitFiles().accessories);
}

function getAllBodies() {
   const files = getFiles();

   const bodies = files.filter((f) => f.includes("_body"));
   if (bodies.length > 0) return bodies;

   const bases = [...new Set(files.map((f) => f.split("_").slice(0, 2).join("_")))];

   return bases.map((b) => b + "_body");
}

function renderCategory(type, containerId, files, isBody = false) {
   const container = document.querySelector(containerId);
   if (!container) return;

   container.innerHTML = "";

   if (!isBody) {
      const none = createOptionDiv("None", !currentState[type]);
      none.onclick = () => {
         currentState[type] = null;
         clearLayer(`char-${type}`);
         renderLeftPanel();
      };
      container.appendChild(none);
   }

   files.forEach((file) => {
      const selected = isBody ? file.includes(currentState.bodyType) : file === currentState[type];

      const div = createOptionDiv(file, selected);

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
            setDirectLayer(`char-${type}`, file);
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
            resetCharacterLayers();
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
      next(container, "exit");
   } else if (step === "exit") {
      var modalInstance = bootstrap.Modal.getInstance($("#chchoosemodal"));
      modalInstance.hide();
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
