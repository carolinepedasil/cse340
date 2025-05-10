const express = require('express')
const path = require('path')
const homeRoute = require('./routes/home')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', homeRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`CSE Motors running on http://localhost:${PORT}`)
})
