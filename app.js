const express = require('express')
const path = require('path')
const homeRoute = require('./routes/home')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', homeRoute)

app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", { title: "500 Error" });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`CSE Motors running on http://localhost:${PORT}`)
})
