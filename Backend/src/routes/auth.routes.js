const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")


const authrouter = Router()

//signup or register router calling registerUsercontroller function instead of writing code here (which is written in auth.controller)
authrouter.post("/register", authController.registerUserController)


//login router calling logincontroller function instead of writing code here (which is written in auth.controller)
authrouter.post("/login", authController.loginController)


//for logout, clearing cookies and token from user cookie and adding token to blacklist

authrouter.get("/logout", authController.logoutController)


authrouter.get("/get-me", authMiddleware.authUser,authController.getMeController)


module.exports = authrouter