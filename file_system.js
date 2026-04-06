let FS = {};

fetch("/api/characters")
   .then((res) => res.json())
   .then((data) => {
      FS = data;
   });

let state = {
   game: "",
   mod: "",
   character: "",
};

let step = "game";

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
            step = "character";
            render();
         });
      });
   } else if (step === "character") {
      Object.keys(FS[state.game][state.mod]).forEach((ch) => {
         addItem(container, "👤 " + ch, () => {
            state.character = ch;
            loadBody();
            step = "clothes";
            render();
         });
      });
   } else if (step === "clothes") {
      getData().clothes.forEach((item) => {
         addItem(container, "👕 " + item, () => {
            setLayer("char-clothes", "clothes", item);
         });
      });

      next(container, "emotion");
   } else if (step === "emotion") {
      getData().emotions.forEach((item) => {
         addItem(container, "😊 " + item, () => {
            setLayer("char-emotion", "emotions", item);
         });
      });

      next(container, "accessory");
   } else if (step === "accessory") {
      getData().accessories.forEach((item) => {
         addItem(container, "🕶 " + item, () => {
            setLayer("char-accessory", "accessories", item);
         });
      });
   }

   back(container);
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
      else if (step === "character") step = "mod";
      else if (step === "clothes") step = "character";
      else if (step === "emotion") step = "clothes";
      else if (step === "accessory") step = "emotion";

      render();
   };

   container.prepend(el);
}

function loadBody() {
   const path = `assets/characters/${state.game}/${state.mod}/${state.character}/body.png`;
   document.getElementById("char-body").src = path;
}

function setLayer(id, folder, file) {
   const path = `assets/characters/${state.game}/${state.mod}/${state.character}/${folder}/${file}`;
   document.getElementById(id).src = path;
}
