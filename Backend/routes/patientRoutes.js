const express = require("express");
const router = express.Router();

const {
  createPatientWithLesions,
  getPatients,
  updatePatient,
  updatePatientLesions,
  deletePatient,
} = require("../controllers/patientController.js");

router.post("/create", createPatientWithLesions);

router.get("/:userID", getPatients);

router.put("/update/:id", updatePatient);

router.delete("/:id", deletePatient);

module.exports = router;
