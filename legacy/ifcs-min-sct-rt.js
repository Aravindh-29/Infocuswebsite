const ob = new IntersectionObserver(
  (e) => {
    e.forEach((e) => {
      e.isIntersecting &&
        "heading-container-infocus-desk" === e.target.className &&
        f[0].classList.add("animate-line"),
        e.isIntersecting &&
          "pro-main-heading-ifcs" === e.target.className &&
          f[1].classList.add("animate-line"),
        e.isIntersecting &&
          "heading-listen-infocus-testimonials" === e.target.className &&
          f[2].classList.add("animate-line"),
          e.isIntersecting &&
          "heading-trusted-infocus" === e.target.className &&
          f[3].classList.add("animate-line"),
        e.isIntersecting && "main-ifcs-footer" === e.target.className
          ? hid.classList.add("side-hide")
          : hid.classList.remove("side-hide");
    });
  },
  { root: null, threshold: 0.5 }
);

const ff = document.querySelector(".heading-container-infocus-desk"),
  ff0 = document.querySelector(".pro-main-heading-ifcs"),
  ff1 = document.querySelector(".heading-listen-infocus-testimonials"),
  ff3 = document.querySelector(".heading-trusted-infocus"),
  ff2 = document.querySelector(".main-ifcs-footer"),
  f = document.querySelectorAll(".line-heading"),
  hid = document.querySelector(".side-nav");
ob.observe(ff), ob.observe(ff0), ob.observe(ff1), ob.observe(ff2),ob.observe(ff3);

