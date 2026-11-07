const sections = document.querySelectorAll(".centered-content-infocus-desk");
sections.forEach((section) => {
  const paragraphs = section.querySelectorAll(
    ".para-container-main-part-infocus-desk"
  );
  const links = section.querySelectorAll(".sect-main-part");
  const setSelected = (index) => {
    paragraphs.forEach((paragraph) =>
      paragraph.classList.remove(
        "para-container-main-part-infocus-desk-selected"
      )
    );
    links.forEach((link) => link.classList.remove("sect-main-part-selected"));
    paragraphs[index].classList.add(
      "para-container-main-part-infocus-desk-selected"
    );
    links[index].classList.add("sect-main-part-selected");
  };
  links.forEach((link, index) => {
    link.addEventListener("click", () => {
      setSelected(index);
    });
  });
  setSelected(0);
});
