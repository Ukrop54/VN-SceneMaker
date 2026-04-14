function setBackground(file) {
   document.getElementById("bg").src = "assets/backgrounds/" + file;
}

function setBlur(value) {
   document.getElementById("bg").style.filter = `blur(${value}px)`;
}

// function syncExportScene() {
//    document.getElementById("export-bg").src = document.getElementById("bg").src;

//    document.getElementById("export-body").src = document.getElementById("char-body").src;

//    document.getElementById("export-clothes").src = document.getElementById("char-clothes").src;

//    document.getElementById("export-emotion").src = document.getElementById("char-emotion").src;

//    document.getElementById("export-accessory").src = document.getElementById("char-accessory").src;
// }

function copyStyles(from, to) {
   const style = window.getComputedStyle(from);
   to.style.cssText = style.cssText;
}

function syncExportScene() {
   const pairs = [
      ["bg", "export-bg"],
      ["char-body", "export-body"],
      ["char-clothes", "export-clothes"],
      ["char-emotion", "export-emotion"],
      ["char-accessory", "export-accessory"],
   ];

   pairs.forEach(([fromId, toId]) => {
      const from = document.getElementById(fromId);
      const to = document.getElementById(toId);

      to.src = from.src;
      copyStyles(from, to);
   });
}

function copyLayer(fromId, toId) {
   const from = document.getElementById(fromId);
   const to = document.getElementById(toId);

   if (from.src && from.src !== window.location.href) {
      to.src = from.src;
      to.style.display = "block";
   } else {
      to.style.display = "none";
   }
}

// function clearSceneLayer(id) {
//    const el = document.getElementById(id);
//    el.src = "";
// }

function exportImage() {
   syncExportScene();

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
