document.querySelectorAll(".navigation-middle").forEach((carousel) => {
    const items1 = carousel.querySelectorAll(".content-centered-services");
    const buttons1 = carousel.querySelectorAll(".sec");
    buttons1.forEach((button1, i) => {
      button1.addEventListener("click", () => {
        items1.forEach((item) => {
          item.classList.remove("content-centered-services-selected");
        });
        buttons1.forEach((button1) =>
          button1.classList.remove("sec-selected")
        );
        items1[i].classList.add("content-centered-services-selected");
        button1.classList.add("sec-selected");
      });
      items1[0].classList.add("content-centered-services-selected");
      buttons1[0].classList.add("sec-selected");
    });
  });