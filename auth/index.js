const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { loginHandler, sessionHandler} = require('./handlers')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.post('/loginHandler', loginHandler)
app.get('/sessions', sessionHandler)
// app.get('/welcome', welcomeHandler)

app.listen(8080)