router.get("/cause-error", function (req, res, next) {
  throw new Error("Intentional Server Error for Testing");
});
