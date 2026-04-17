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

function setCharPos(value) {
   const allChars = [...visibleChars, ...exportChars];

   allChars.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      el.style.left = "50%";
      el.style.transition = "none";
      el.style.transform = `translateX(-50%) translateX(${value}%)`;
   });
}

const radios = document.querySelectorAll('input[name="spritetime"]');
const styleboxes = ["previewImage", ...visibleChars, ...exportChars];

radios.forEach((radio) => {
   radio.addEventListener("change", () => {
      styleboxes.forEach((id) => {
         const el = document.getElementById(id);
         if (!el) return;
         el.classList.forEach((cls) => {
            if (cls.startsWith("filter-")) el.classList.remove(cls);
         });
         el.classList.add("filter-" + radio.value);
      });
   });
});

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

      const transformStr = char.style.transform || "translateX(-50%)";
      const widthPx = parseFloat(char.style.width) || 600;
      const heightPx = parseFloat(char.style.height) || 720;

      let offsetPercent = 0;
      const match = transformStr.match(/translateX\(-50%\) translateX\((-?\d+(?:\.\d+)?)%\)/);
      if (match) {
         offsetPercent = parseFloat(match[1]);
      }

      const centerX = WIDTH / 2 + (offsetPercent / 100) * widthPx;
      const x = (centerX - widthPx / 2) * SCALE;
      const y = (HEIGHT - heightPx) * SCALE;

      ctx.drawImage(charImg, x, y, widthPx * SCALE, heightPx * SCALE);
   }

   ctx.filter = "none";

   const link = document.createElement("a");
   link.download = "scene.png";
   link.href = canvas.toDataURL("image/png", 1.0);
   link.click();
}
