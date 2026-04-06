let currentCharacter = "girl";

function setBackground(file) {
   document.getElementById("bg").src = "assets/backgrounds/" + file;
}

function setBlur(value) {
   document.getElementById("bg").style.filter = `blur(${value}px)`;
}

function loadCharacter(name) {
   currentCharacter = name;

   document.getElementById("char-body").src = `assets/characters/${name}/body.png`;
   document.getElementById("char-clothes").src = "";
   document.getElementById("char-emotion").src = "";
}

function setClothes(file) {
   document.getElementById("char-clothes").src = `assets/characters/${currentCharacter}/clothes/${file}`;
}

function setEmotion(file) {
   document.getElementById("char-emotion").src = `assets/characters/${currentCharacter}/emotions/${file}`;
}

function syncExportScene() {
   document.getElementById("export-bg").src = document.getElementById("bg").src;

   document.getElementById("export-body").src = document.getElementById("char-body").src;

   document.getElementById("export-clothes").src = document.getElementById("char-clothes").src;

   document.getElementById("export-emotion").src = document.getElementById("char-emotion").src;

   document.getElementById("export-accessory").src = document.getElementById("char-accessory").src;
}

function copyLayer(fromId, toId) {
   const from = document.getElementById(fromId);
   const to = document.getElementById(toId);

   if (from.src && from.src !== window.location.href) {
      to.src = from.src;
      to.style.display = "block";
   } else {
      to.style.display = "none"; // ❗ ключ
   }
}

function clearLayer(id) {
   const el = document.getElementById(id);
   el.src = "";
}

function exportImage() {
   const scene = syncExportScene();

   html2canvas(document.getElementById("export-scene"), {
      width: 1280,
      height: 720,
      scale: 2,
   }).then((canvas) => {
      let link = document.createElement("a");
      link.download = "scene.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
   });
}
