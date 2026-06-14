const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(cookieParser)
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
const authrouter = require("./routes/auth.routes")

// for the api's 
app.use("/api/auth", authrouter)

module.exports = app