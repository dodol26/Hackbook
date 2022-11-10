const express = require('express')
const app = express()
const router = require('./routers')
var session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true 
  },
}))

app.use('/', router)
app.use('/public', express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})