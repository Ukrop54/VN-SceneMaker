// $("#show-sprstyle").on("click", function () {
//    $("#sprite-style").slideToggle("slow", function () {});
//    $("#sprstylemaindiv").addClass("sprstylemaindiv2");
//    $("#sprstylemaindiv").removeClass("sprstylemaindiv1");
//    $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
// });

// function toggleMenu() {
//    $("#sprite-style").slideToggle("slow", function () {});
//    $("#sprstylemaindiv").toggleClass("sprstylemaindiv2 sprstylemaindiv1");
//    $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
// }

// function toggleEditorMenu(id) {
//    $(`#${id}-editor_content`).slideToggle("slow", function () {});
//    $(`#${id}_arrow`).toggleClass("bi-chevron-down bi-chevron-up");
// }

function toggleMenu(id) {
   $(`#${id}-content`).slideToggle("slow", function () {});
   $(`#${id}-arrow`).toggleClass("bi-chevron-down bi-chevron-up");
}

// $("#sprstyle-select-header").on("click", function () {
//    $("#sprstyle-content").slideToggle("slow", function () {});
//    // $("#sprstylemaindiv").removeClass("sprstylemaindiv1");
//    $("#show-sprstyle").toggleClass("bi-chevron-down bi-chevron-up");
// });

function workinprogress() {
   alert("This feature is still in development. Please check back later.");
}
