

import express from "express"
import { createLoan, getLoans } from "../controllers/loan.controllers.js"

const router = express.Router()

router.post('/createloans', createLoan)
router.get('/loan', getLoans)

export default router