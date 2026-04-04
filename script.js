// $("#show-sprstyle").on("click", function () {
//    $("#sprite-style").slideToggle("slow", function () {});
//    $("#sprstylemaindiv").addClass("sprstylemaindiv2");
//    $("#sprstylemaindiv").removeClass("sprstylemaindiv1");
//    $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
// });

function toggleMenu() {
   $("#sprite-style").slideToggle("slow", function () {});
   $("#sprstylemaindiv").addClass("sprstylemaindiv2");
   $("#sprstylemaindiv").removeClass("sprstylemaindiv1");
   $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
}

// const select = document.getElementById("mySelect");

// select.addEventListener("click", () => {
//    select.classList.toggle("active");
// });

$("#sprstyle-select-header").on("click", function () {
   $("#sprstyle-content").slideToggle("slow", function () {});
   // $("#sprstylemaindiv").removeClass("sprstylemaindiv1");
   $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
});

const radios = document.querySelectorAll('input[name="spritetime"]');
const image = document.getElementById("previewImage");

radios.forEach((radio) => {
   radio.addEventListener("change", () => {
      image.className = "img-fluid rounded";

      image.classList.add("filter-" + radio.value);
   });
});
