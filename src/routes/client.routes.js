

import express from "express";
import { clientLogin, registerUser } from "../controllers/client.controllers.js";
const router = express.Router()

router.post('/register', registerUser)
router.post('/clientlogin', clientLogin)

export default router