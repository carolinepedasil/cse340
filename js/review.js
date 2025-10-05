(function(){
  const form = document.getElementById("reviewForm");
  if (!form) return;
  form.addEventListener("submit", function(e){
    const rating = Number(form.rating.value);
    const comment = String(form.comment.value || "").trim();
    const errs = [];
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) errs.push("Rating must be 1-5.");
    if (comment.length < 5) errs.push("Comment must be at least 5 characters.");
    if (errs.length){
      e.preventDefault();
      alert(errs.join("\n"));
    }
  });
})();
