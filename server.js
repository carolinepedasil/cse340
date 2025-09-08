const express = require("express")
const path = require("path")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/main")

app.use(require("./routes/static"))

app.get("/", (req, res) => {
  res.render("index", { title: "CSE Motors" })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app listening on  ${port}`)
})
