

import express from "express";
import { getAllApplications, updateApplicationStatus } from "../controllers/admin.cotrollers.js";
const router = express.Router();
router.get('/get', getAllApplications)
router.put('/status/:id', updateApplicationStatus)

export default router;