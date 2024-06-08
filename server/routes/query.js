import { Router } from "express";
import { createQuery ,getAllQueries , getAllUsers , getQuery , getUserDetails , updateQuery , filterQuery , markAsSolved , createChat ,deleteQuery , reopenQuery , getChats ,getCount} from "../controller/query.js";
import { authorization } from "../middlewares/authorization.js";
import multer from "multer";
import path from "path";



const router = Router()
var storage = multer.diskStorage({
    destination : function(req,file ,cb) {
        cb(null , `./uploads/`)
},

filename : function(req , file , cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
}
}
)


const upload = multer({storage : storage})


router.post('/create',upload.array('screenshot'),createQuery)
router.get('/get/all/tickets',authorization,getAllQueries)
router.get('/get/count', authorization , getCount)
router.get('/get-all-users',authorization,getAllUsers)//notused
router.get('/get-user',authorization,getUserDetails) //not used
router.get('/get-query',authorization,getQuery) //not used
router.post('/update/ticket',authorization,updateQuery)
router.post('/reopen-ticket',reopenQuery) //not used
router.get('/filter',authorization,filterQuery) //not used
router.post('/mark-as-solved',markAsSolved) //not used


router.delete('/delete',deleteQuery) //not used

router.post('/create/chat',createChat)
router.get('/fetch/history', getChats)


export default router