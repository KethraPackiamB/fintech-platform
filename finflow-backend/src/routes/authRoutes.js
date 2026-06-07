const router = require("express").Router();
const { register, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidators");
const validate = require("../middlewares/validateRequest");

router.post("/register", registerValidator, validate, register);
router.post("/login",    loginValidator,    validate, login);
router.get("/me",        protect, getMe);
router.post("/logout",   protect, logout);

module.exports = router;
