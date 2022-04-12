const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { loginHandler, sessionHandler, logoutHandler} = require('./handlers')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.post('/loginHandler', loginHandler)
app.get('/logoutHandler', logoutHandler)
app.get('/sessions', sessionHandler)


app.listen(8080)