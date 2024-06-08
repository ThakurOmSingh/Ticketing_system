import { Router } from "express";
import AdminRoutes from './Admin.js'
import ticketRoutes from './query.js'
import express  from "express";

const router = Router()

router.use('/admin',AdminRoutes)
// router.use('/user', AdminRoutes)
router.use('/ticket',ticketRoutes)
router.use('/uploads', express.static('uploads'))



export default router