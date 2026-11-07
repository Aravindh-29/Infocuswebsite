const cursor = document.getElementById("ifcs-cur-fi"),
  links = document.querySelectorAll("a, .sect-main-part"),
  moveCursor = (r) => {
    let e = r.clientX - cursor.offsetWidth / 2,
      s = r.clientY - cursor.offsetHeight / 2;
    cursor.style.transform = `translate(${e}px, ${s}px)`;
  },
  toggleClass = (r, e, s) => {
    s ? r.classList.add(e) : r.classList.remove(e);
  },
  showCursor = () => toggleClass(cursor, "ifcs-cur-fi_visible", !0),
  hideCursor = () => toggleClass(cursor, "ifcs-cur-fi_hidden", !0),
  hoverCursor = () => toggleClass(cursor, "ifcs-cur-fi_hover", !0),
  unhoverCursor = () => toggleClass(cursor, "ifcs-cur-fi_hover", !1);
document.addEventListener("mousemove", moveCursor),
  document.body.addEventListener("mouseleave", hideCursor),
  document.body.addEventListener("mouseenter", showCursor),
  document.body.addEventListener("click", hoverCursor),
  window.addEventListener("scroll", unhoverCursor),
  links.forEach((r) => {
    r.addEventListener("mouseover", hoverCursor),
      r.addEventListener("mouseout", unhoverCursor);
  });
