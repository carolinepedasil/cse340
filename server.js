const express = require("express")
const path = require("path")
const app = express()

app.use("/css", express.static(path.join(__dirname, "public/css")))
app.use("/images", express.static(path.join(__dirname, "public/images")))

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors" })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app listening on  ${port}`)
})
