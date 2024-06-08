import { Router } from "express";
import { createAdmin, createGroup, forgetPassword ,login  , getAllAdmin , userDetails ,getGroups} from "../controller/admin.js";
import { authorization } from "../middlewares/authorization.js";
const router = Router()

router.post('/create',createAdmin); //notused
router.post('/reset/password',forgetPassword);
router.post('/login',login);
// router.get('/get-admin',authorization, getAdmin);
router.get('/get/all/admins',authorization,getAllAdmin);

router.get('/details',authorization,userDetails); //not used

router.post('/group/create',createGroup) //not used
router.get('/get/groups',getGroups)

export default router