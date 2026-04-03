$("#show-sprtime").on("click", function () {
   $("#sprite-time").slideToggle("slow", function () {});
   $("#show-sprtime").toggleClass("bi-chevron-up bi-chevron-down");
});

$("#show-sprdec").on("click", function () {
   $("#sprite-decoration").slideToggle("slow", function () {});
   $("#show-sprdec").toggleClass("bi-chevron-up bi-chevron-down");
});
