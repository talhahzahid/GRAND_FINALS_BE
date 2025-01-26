

import express from "express";
import { clientLogin, clientPasswordUpdate, registerUser } from "../controllers/client.controllers.js";
import { authenticate } from "../middleware/userRef.middleware.js";
const router = express.Router()

router.post('/register', registerUser)
router.post('/clientlogin', clientLogin)
router.post('/clientpasswordupdate', authenticate, clientPasswordUpdate)

export default router