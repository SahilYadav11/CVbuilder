const userModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const tokenblacklistModel = require("../models/blacklist.model");
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerUserController(req, res){
    //taking the username, email and password form the input box/user eneterd 
     const {username, email, password} = req.body


     //checking all required attributed are entered or not
    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide username, email and password"
        })
    }


    //checking if user already exists or not by checking the email he entered, in the database
    const isUserExists = await userModel.findOne({
        $or : [{username}, {email}]
    })
    

    if(isUserExists){
        // if(isUserExists.username == username) if username already exists
        // if(isUserExists.email == email) if email already exists
        return res.status(400).json({
            message : "Account Already Exists with this email or username"
        })
    }

    //hashing the password enterd by the user, using bcrypt library
    const hash = await bcrypt.hash(password, 10)

    //creating a user using userModel
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    //creating a token and sent to the user
    const token = jwt.sign(
        {id: user._id, username : user.username},
        process.env.JWT_SECRET,
        { expiresIn :"1d"}
    )

    res.cookie("token", token)

    res.status(201).json({
        message : "user registered successfully",
        user : {
            id : user._id,
            username: user.username,
            email : user.email
        }
    })
}


//code for loging in a user 
async function loginController(req, res){
    const {email, password} = req.body
    const user = await userModel.findOne({email})    //finding the email of the user in database, wheather there is a user with this email or not


    //if email not found (means there is no user with this email, its a new email), this message will pass or sent otherwise this if() will not run
    if(!user){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }


    // now checking the password, wheather the password user entered is correct or not by comparing the password user entered and password in the database 
    const isPasswordValid  = await bcrypt.compare(password, user.password);

    //if password doesn't match with the password assigned to that email
    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid email or password"
        })
    }


    //a token is sent to the user
    const token = jwt.sign(
        {id: user._id, username : user.username},
        process.env.JWT_SECRET,
        { expiresIn :"1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message : "user loggedIn successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

async function logoutController(req,res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message : "user logged out successfully"
    })
}

async function getMeController(req, res){
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message : "user detail fetched successfully",
        user : {
            id: user._id,
            username : user.username,
            email : user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginController,
    logoutController,
    getMeController
}