const router = require("express").Router();
const { getAlerts, resolveAlert } = require("../controllers/fraudController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/",         protect, adminOnly, getAlerts);
router.patch("/:id",    protect, adminOnly, resolveAlert);

module.exports = router;
