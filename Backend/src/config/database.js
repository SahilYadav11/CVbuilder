//connection to database

const mongoose = require("mongoose")

async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        console.log("connected to database")
    }
    catch(err) {
         console.error("Database connection error:", err.message)
    }
    
}
module.exports = connectToDB 