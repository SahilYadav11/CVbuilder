require("dotenv").config({ path: __dirname + "/.env" })
const app = require('./Backend/src/App');
const connectToDB = require("./Backend/src/config/database")

async function start() {
    await connectToDB()
    app.listen(3000, ()=>{
        console.log("server is running on port 3000")
    })
}

start()