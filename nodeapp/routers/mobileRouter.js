const express = require("express");
const mobileController = require("../controllers/mobileController");
const { validateToken } = require("../authUtils");
const router = express.Router();

router.post("/getAllMobiles",mobileController.getAllMobiles);
router.post("/getMobilesByUserId", mobileController.getMobilesByUserId);
router.get("/getMobileById/:id",mobileController.getMobileById);
router.post("/addMobile",mobileController.addMobile);
router.put("/updateMobile/:id", mobileController.updateMobile);
router.delete("/deleteMobile/:id", mobileController.deleteMobile);

module.exports = router;
