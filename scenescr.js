function getCurrentFilter(el) {
   return el.style.filter || window.getComputedStyle(el).filter || "none";
}

const visibleChars = ["char-body", "char-clothes", "char-emotion", "char-accessory"];
const exportChars = ["export-body", "export-clothes", "export-emotion", "export-accessory"];

function setBackground(file) {
   const path = "assets/backgrounds/" + file;
   document.getElementById("bg").src = path;
   const expBg = document.getElementById("export-bg");
   if (expBg) expBg.src = path;
}

function setBlur(value) {
   const filterStr = `blur(${value}px)`;
   document.getElementById("bg").style.filter = filterStr;
   const expBg = document.getElementById("export-bg");
   if (expBg) expBg.style.filter = filterStr;
}

const posMap = {
   left: 20,
   cl: 35,
   center: 50,
   cr: 65,
   right: 80,
};

function parseTranslatePercent(transformStr) {
   if (!transformStr) return -50;
   const regex = /translateX\((-?[\d.]+)%\)/g;
   let total = 0;
   let match;
   while ((match = regex.exec(transformStr)) !== null) {
      total += parseFloat(match[1]);
   }
   return total;
}

function setCharPos(value) {
   const allChars = [...visibleChars, ...exportChars];

   if (isNaN(value)) {
      allChars.forEach((id) => {
         const el = document.getElementById(id);
         if (!el) return;
         el.style.transition = "all 0.3s ease";
         el.style.left = posMap[value] + "%";
         el.style.transform = "translateX(-50%)";
      });
   } else {
      allChars.forEach((id) => {
         const el = document.getElementById(id);
         if (!el) return;
         el.style.left = "50%";
         el.style.transition = "none";
         el.style.transform = `translateX(-50%) translateX(${value}%)`;
      });
   }
}

function setSpriteFilter(value) {
   const styleboxes = ["previewImage", ...visibleChars, ...exportChars];
   styleboxes.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.forEach((cls) => {
         if (cls.startsWith("filter-")) el.classList.remove(cls);
      });
      el.classList.add("filter-" + value);
   });
}

function syncPreview() {
   html2canvas(document.getElementById("scene"), { scale: 0.3 }).then((canvas) => {
      document.getElementById("previewImage").src = canvas.toDataURL();
   });
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
      if (!from || !to) return;

      if (from.src && from.src !== window.location.href) {
         to.src = from.src;
         to.style.display = "block";
      } else {
         to.src = "";
         to.style.display = "none";
      }

      ["left", "transform", "width", "height"].forEach((prop) => {
         if (from.style[prop]) to.style[prop] = from.style[prop];
      });
   });
}

async function exportImage() {
   syncExportScene();

   const WIDTH = 1280;
   const HEIGHT = 720;
   const SCALE = 2;

   const canvas = document.createElement("canvas");
   canvas.width = WIDTH * SCALE;
   canvas.height = HEIGHT * SCALE;
   const ctx = canvas.getContext("2d", { alpha: true });
   ctx.imageSmoothingEnabled = true;

   const bg = document.getElementById("export-bg");
   ctx.filter = getCurrentFilter(bg);
   if (bg.src && bg.src !== window.location.href) {
      const bgImg = new Image();
      await new Promise((r) => {
         bgImg.onload = r;
         bgImg.onerror = r;
         bgImg.src = bg.src;
      });
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
   }
   ctx.filter = "none";

   const charFilter = getCurrentFilter(document.getElementById("export-body"));
   ctx.filter = charFilter;

   for (const id of exportChars) {
      const char = document.getElementById(id);
      if (!char || !char.src || char.src === window.location.href || char.style.display === "none") continue;

      const charImg = new Image();
      await new Promise((r) => {
         charImg.onload = r;
         charImg.onerror = r;
         charImg.src = char.src;
      });

      const widthPx = parseFloat(char.style.width) || 600;
      const heightPx = parseFloat(char.style.height) || 720;

      const transformStr = char.style.transform || "translateX(-50%)";
      const totalTransPct = parseTranslatePercent(transformStr);

      const leftStr = char.style.left || "50%";
      const leftPct = parseFloat(leftStr) || 50;

      const baseX = (leftPct / 100) * WIDTH;
      const offsetX = (totalTransPct / 100) * widthPx;
      const x = (baseX + offsetX) * SCALE;

      const y = (HEIGHT - heightPx) * SCALE;

      ctx.drawImage(charImg, x, y, widthPx * SCALE, heightPx * SCALE);
   }

   ctx.filter = "none";

   const link = document.createElement("a");
   link.download = "scene.png";
   link.href = canvas.toDataURL("image/png", 1.0);
   link.click();
}

window.addEventListener("load", () => {
   // const posHeader = document.getElementById("posselect-header");
   // const posContent = document.getElementById("posselect-content");
   // const posCurrent = document.getElementById("pos-current");
   // const posArrow = document.getElementById("pos-arrow");
   // const posOptions = document.querySelectorAll("#posselect-content .character-option");

   // if (posHeader) {
   //    posHeader.addEventListener("click", () => {
   //       const isHidden = posContent.style.display === "none";
   //       posContent.style.display = isHidden ? "block" : "none";
   //       posArrow.classList.toggle("bi-chevron-down", !isHidden);
   //       posArrow.classList.toggle("bi-chevron-up", isHidden);
   //    });
   // }

   // posOptions.forEach((opt) => {
   //    opt.addEventListener("click", () => {
   //       posOptions.forEach((o) => o.classList.remove("selected"));
   //       opt.classList.add("selected");
   //       posCurrent.textContent = opt.textContent;

   //       setCharPos(opt.dataset.value);

   //       const slider = document.getElementById("posslider");
   //       if (slider) slider.value = 0;

   //       posContent.style.display = "none";
   //       posArrow.classList.add("bi-chevron-down");
   //       posArrow.classList.remove("bi-chevron-up");
   //    });
   // });

   const styleOptions = document.querySelectorAll("#sprite-time .character-option");

   styleOptions.forEach((opt) => {
      opt.addEventListener("click", () => {
         styleOptions.forEach((o) => o.classList.remove("selected"));
         opt.classList.add("selected");
         setSpriteFilter(opt.dataset.value);
      });
   });
   const initialPosOption = document.querySelector("#posselect-content .character-option.selected");
   if (initialPosOption) {
      posCurrent.textContent = initialPosOption.textContent;
      setCharPos(initialPosOption.dataset.value);
   }

   const initialStyleOption = document.querySelector("#sprite-time .character-option.selected");
   if (initialStyleOption) {
      setSpriteFilter(initialStyleOption.dataset.value);
   }

   const posSlider = document.getElementById("posslider");
   if (posSlider) {
      posSlider.addEventListener("input", () => {
         const value = parseFloat(posSlider.value);
         if (!isNaN(value)) {
            setCharPos(value);

            posCurrent.textContent = "Custom";
            posOptions.forEach((o) => o.classList.remove("selected"));
         }
      });
   }
});
