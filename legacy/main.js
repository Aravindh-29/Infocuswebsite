$(function () {
  var contentSections = $(".content-section");

  function updateActiveSection() {
    contentSections.each(function () {
      var section = $(this),
        navLink = $('.side-nav a[href="#' + section.attr("id") + '"]');
      if (
        section.offset().top - $(window).height() / 2 < $(window).scrollTop() &&
        section.offset().top + section.height() - $(window).height() / 2 >
          $(window).scrollTop()
      ) {
        navLink.addClass("active-section");
      } else {
        navLink.removeClass("active-section");
      }
    });
  }

  $(".side-nav").on("click", "a", function (e) {
    e.preventDefault();
    $("html, body").animate(
      { scrollTop: $($(this).attr("href")).offset().top },
      100
    );
  });

  $(window).on("scroll", updateActiveSection);
  updateActiveSection();

  var counterAnimated = false;
  $(window).scroll(function () {
    if (
      !counterAnimated &&
      $(window).scrollTop() > $("#counter").offset().top - window.innerHeight
    ) {
      $(".counter-value").each(function () {
        var countElement = $(this),
          countTo = countElement.attr("data-count");
        $({ countNum: countElement.text() }).animate(
          {
            countNum: countTo,
          },
          {
            duration: 2000,
            easing: "swing",
            step: function () {
              countElement.text(Math.floor(this.countNum));
            },
            complete: function () {
              countElement.text(this.countNum);
            },
          }
        );
      });
      counterAnimated = true;
    }
  });
});
