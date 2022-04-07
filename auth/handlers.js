let uuid = require('uuid')

// Dummy session class -- maybe replace with cookie-session ?
class Session {
    constructor(username, expiresAt) {
        this.username = username
        this.expiresAt = expiresAt
    }

    isExpired() {
        this.expiresAt < (new Date())
    }
}
// Dummy users - Replace with authentication service and lookup users in DB for login.
const users = {
    "user1": "password1",
    "user2": "password2"
}
// Dummy sessions to store sessions localy - replace with DB
const sessions = {}

const loginHandler = (req, res) => {

    // get users credentials from the JSON body
    const { username, password } = req.body
    if (!username) {
        // If the username isn't present, return an HTTP unauthorized code
        res.status(401).end()
        return
    }

    const expectedPassword = users[username]
    if (!expectedPassword || expectedPassword !== password) {
        res.status(401).end()
        return
    }

    const sessionToken = uuid.v4()
    const now = new Date()
    const expiresAt = new Date(+now + 50000 * 1000)

    const session = new Session(username, expiresAt)
    sessions[sessionToken] = session

    // Store session cookie
    res.cookie("session_token", sessionToken, { expires: expiresAt })
    res.end()
}

const logoutHandler = (req, res ) => {

    res.cookie("session_token", "", { expires: new Date()})
    console.log(req.cookies)
    res.send(req.cookies)
}

// Endpoint to GET cookies from local sessions & cookies in browser
const sessionHandler = (req, res) => {
    console.log(sessions)
    console.log(req.cookies)
    res.send(req.cookies)
}

module.exports = {
    loginHandler: loginHandler,
    sessionHandler: sessionHandler,
    logoutHandler: logoutHandler
}


