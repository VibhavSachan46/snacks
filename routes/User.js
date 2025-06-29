const express = require("express")
const router = express.Router()
 
const {signup, login, logout, getProfile} = require("../controllers/Auth")

const { auth } = require("../middleware/auth")

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/getProfile",auth, getProfile)

module.exports = router