const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(require("./routes/static"))

app.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors" })
})

const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
