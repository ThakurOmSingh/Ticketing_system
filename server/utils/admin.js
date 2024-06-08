import { error } from "console";
import prisma from "./database.js"
import bcrypt from "bcrypt";


const findGroup = async(name)=>{
    return await prisma.group.findFirst({
        where:{
            name
        }
    })
}

const createGroup = async (data) =>{
    return await prisma.group.create({
         data
        })
    }
    const createAdmin = async ({ data }) =>{
        return await prisma.user.create({
            data:data
        })
    }

    const findAdmin = async({email})=>{
          return await prisma.user.findFirst({
            where:{
                email
            }
          })
    }
const forgetPassword = async  ({email , encryptedPassword}) =>{

    return await prisma.user.update({
        where:{
            email
        },
        data:{
            password : encryptedPassword
        }
    })
}

 const login = async ({email , password}) =>{

    const findEmail =  await prisma.user.findFirst({
        where: {
            email
        }
    });

    if(!findEmail){
        throw new Error("Email Not found")
    }

    let comparedPass = bcrypt.compareSync(password,findEmail.password)

    if(!comparedPass){
            throw new Error("Password is wrong.")
        }

    return findEmail;

    }


 const getAdmin = async  ({uuid}) =>{
    return await prisma.user.findFirst({
        where:{
            uuid
        }
    })
}


 const getAllAdmin = async  () =>{
    return await prisma.user.findMany({
        where :{
            isAdmin : true
        },
        include:{
            group : true
        }
    })
}

const getRecipients = async  ()=>{
    return await prisma.user.findMany({
        where:{
            notification : true
        },select:{
            email : true
        }
    })
}

export default {
    createAdmin,
    createGroup,
    forgetPassword ,
    login ,
    getAdmin ,
    findGroup,
    getAllAdmin,
    findAdmin,
    getRecipients
}