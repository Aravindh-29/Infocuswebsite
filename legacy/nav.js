var $body = $("body");
var $main = $("main");

$(".nav_bar").each(function () {
  var $samEleDrop = $(this).find(".sam-ele-drop");
  var $linkCon = $(this).find(".link-con");

  $linkCon.each(function (index) {
    $(this).on("click", function () {
      $samEleDrop.removeClass("sam-ele-drop-selected");
      $linkCon.removeClass("cell-but-ifcs-nav-selected");
      $samEleDrop.eq(index).addClass("sam-ele-drop-selected");
      $(this).addClass("cell-but-ifcs-nav-selected");
    });
  });

  $main.on("click", function () {
    $(".cell-but-ifcs-nav-selected").removeClass("cell-but-ifcs-nav-selected");
    $(".sam-ele-drop-selected").removeClass("sam-ele-drop-selected");
  });

  var $rightInfIfcsNavMain = $(this).find(".right-inf-ifcs-nav-main");
  var $sideHovHolderSections = $(this).find(".side-hov-holder-sections");

  $sideHovHolderSections.each(function (index) {
    $(this).on("click", function () {
      $rightInfIfcsNavMain.removeClass("right-inf-ifcs-nav-main-selected");
      $sideHovHolderSections.removeClass("side-hov-holder-sections-selected");
      $rightInfIfcsNavMain
        .eq(index)
        .addClass("right-inf-ifcs-nav-main-selected");
      $(this).addClass("side-hov-holder-sections-selected");
    });
  });

  $rightInfIfcsNavMain.eq(0).addClass("right-inf-ifcs-nav-main-selected");
  $sideHovHolderSections.eq(0).addClass("side-hov-holder-sections-selected");

  $main.on("click", function () {
    $(".cell-but-ifcs-nav-selected").removeClass("cell-but-ifcs-nav-selected");
    $(".sam-ele-drop-selected").removeClass("sam-ele-drop-selected");
  });

  var $rightInfIfcsNavMain1 = $(this).find(".right-inf-ifcs-nav-main-1");
  var $sideHovHolderSections1 = $(this).find(".side-hov-holder-sections-1");

  $sideHovHolderSections1.each(function (index) {
    $(this).on("click", function () {
      $rightInfIfcsNavMain1.removeClass("right-inf-ifcs-nav-main-1-selected");
      $sideHovHolderSections1.removeClass(
        "side-hov-holder-sections-1-selected"
      );
      $rightInfIfcsNavMain1
        .eq(index)
        .addClass("right-inf-ifcs-nav-main-1-selected");
      $(this).addClass("side-hov-holder-sections-1-selected");
    });
  });

  $rightInfIfcsNavMain1.eq(0).addClass("right-inf-ifcs-nav-main-1-selected");
  $sideHovHolderSections1.eq(0).addClass("side-hov-holder-sections-1-selected");

  $main.on("click", function () {
    $(".cell-but-ifcs-nav-selected").removeClass("cell-but-ifcs-nav-selected");
    $(".sam-ele-drop-selected").removeClass("sam-ele-drop-selected");
  });

  var $rightInfIfcsNavMain2 = $(this).find(".right-inf-ifcs-nav-main-2");
  var $sideHovHolderSections2 = $(this).find(".side-hov-holder-sections-2");

  $sideHovHolderSections2.each(function (index) {
    $(this).on("click", function () {
      $rightInfIfcsNavMain2.removeClass("right-inf-ifcs-nav-main-2-selected");
      $sideHovHolderSections2.removeClass(
        "side-hov-holder-sections-2-selected"
      );
      $rightInfIfcsNavMain2
        .eq(index)
        .addClass("right-inf-ifcs-nav-main-2-selected");
      $(this).addClass("side-hov-holder-sections-2-selected");
    });
  });
  $rightInfIfcsNavMain2.eq(0).addClass("right-inf-ifcs-nav-main-2-selected");
  $sideHovHolderSections2.eq(0).addClass("side-hov-holder-sections-2-selected");

  $main.on("click", function () {
    $(".cell-but-ifcs-nav-selected").removeClass("cell-but-ifcs-nav-selected");
    $(".sam-ele-drop-selected").removeClass("sam-ele-drop-selected");
  });
});
const tog = document.querySelector(".ic-h");
const togclose = document.querySelector(".ic-c");

tog.addEventListener("click", () => {
  const over = document
    .querySelector(".overlay_nav_bar")
    .classList.add("overlay-add");
    tog.classList.add("hi");
    togclose.classList.add("sh");

});
togclose.addEventListener("click", () => {
  const over = document
    .querySelector(".overlay_nav_bar")
    .classList.remove("overlay-add");
    tog.classList.remove("hi");
    togclose.classList.remove("sh");
  
});
const remove_overla=()=>{
  const over = document
  .querySelector(".overlay_nav_bar")
  .classList.remove("overlay-add");
  tog.classList.remove("hi");
  togclose.classList.remove("sh");
}









