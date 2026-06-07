const router = require("express").Router();
const { submitKYC, getMyKYC } = require("../controllers/kycController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../config/multerConfig");

router.post("/",  protect, upload.fields([{ name: "aadhaarDoc" }, { name: "panDoc" }]), submitKYC);
router.get("/",   protect, getMyKYC);

module.exports = router;
