const router = require('express').Router();
const AuthController = require("./controllers/api/AuthController")
const authmiddleware = require("./middlewares/admin/authmiddleware")

router.post('/logout', authmiddleware, AuthController.logout);
router.post('/login', AuthController.login);
router.get('/check/auth', AuthController.checkLogin)

module.exports = router;