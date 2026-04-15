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
   const computed = window.getComputedStyle(from);

   for (let prop of computed) {
      to.style.setProperty(prop, computed.getPropertyValue(prop));
   }
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

      if (from.src && from.src !== window.location.href) {
         to.src = from.src;
         copyStyles(from, to);
      } else {
         to.src = "";
      }
      copyStyles(from, to);
   });
}

// function copyLayer(fromId, toId) {
//    const from = document.getElementById(fromId);
//    const to = document.getElementById(toId);

//    if (from.src && from.src !== window.location.href) {
//       to.src = from.src;
//       to.style.display = "block";
//    } else {
//       to.style.display = "none";
//    }
// }
function setCharPos(value) {
   const chars = ["char-body", "char-clothes", "char-emotion", "char-accessory"];

   chars.forEach((id) => {
      const el = document.getElementById(id);

      if (isNaN(value)) {
         const posMap = {
            left: 20,
            cl: 35,
            center: 50,
            cr: 65,
            right: 80,
         };
         el.style.transition = "all 0.3s ease";
         el.style.left = posMap[value] + "%";
         el.style.transform = "translateX(-50%)";
      } else {
         el.style.left = "50%";
         el.style.transition = "none";
         // el.style.transform = `translateX(calc(-50% + ${value}%))`;
         el.style.transform = `translateX(-50%) translateX(${value}%)`;
      }
   });
}

function syncPreview() {
   html2canvas(document.getElementById("scene"), {
      scale: 0.3,
   }).then((canvas) => {
      document.getElementById("previewImage").src = canvas.toDataURL();
   });
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
      backgroundColor: null,
   }).then((canvas) => {
      let link = document.createElement("a");
      link.download = "scene.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
   });
}
