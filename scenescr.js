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

function exportImage() {
   const scene = document.querySelector("#scene");

   html2canvas(scene, {
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
