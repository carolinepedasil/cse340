document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form.form-card").forEach((form) => {
    const mark = (el) => el.classList.add("touched");

    form.querySelectorAll("input, textarea, select").forEach((el) => {
      el.addEventListener("input", () => mark(el), { passive: true });
      el.addEventListener("change", () => mark(el), { passive: true });
      el.addEventListener("blur", () => mark(el), { passive: true });
    });

    form.addEventListener("submit", () => {
      form.querySelectorAll("input, textarea, select").forEach((el) => mark(el));
    });
  });
});
