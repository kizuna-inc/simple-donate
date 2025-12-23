const fadeIn = async (element) => {
  element.classList.add("inFade");

  setTimeout(() => {
    element.classList.add("show");
    element.classList.remove("inFade");
  }, 600);
};

const fadeOut = async (element) => {
  element.classList.add("outFade");

  setTimeout(() => {
    element.classList.remove("show");
    element.classList.remove("outFade");
  }, 600);
};
