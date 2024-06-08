import jwt from "jsonwebtoken"
import ENV from '../env.js'

export const authorization = (req , res , next) =>{
    try {

        const authHeader = req.header("authorization");
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized auth',  status: false });
        }
        var token = authHeader.split(' ')[1];
        // console.log(token)
        if (!token || token === "") {
            return res.status(401).json({ message: 'Unauthorized token',  status: false });
        }

        let decodedToken = null;

        try {
            decodedToken = jwt.verify(token, ENV.SECRET_KEY);
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorize decode',  status: false });
        }

        if (!decodedToken) {
            req.isAuth = false;
            return res.status(401).json({  msg: "Unauthorized dtokekn" , status: 0 });
        }

        if (decodedToken) {
            req.userId = decodedToken.uuid
            return next();
        };


    } catch (error) {
        console.log(error);
        return res.status(401).json({  msg: `Unauthorized ${error}` ,status: 0});
    }
}