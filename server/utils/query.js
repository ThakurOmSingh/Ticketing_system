import { connect } from "http2";
import  prisma from "./database.js";


 const createUser = async({data}) =>{

    return await prisma.user.upsert({
          where :{
            email : data.email
          },
          update  : {},
          create :{
            ...data
          }
    });
}

 const createQuery = async({data}) =>{
    return await prisma.query.create({
        data:{
            title : data.title,
            description : data.description,
            origin : data.origin,
            applicationId : data.applicationId,
            priority : data.priority,
            userid : data.uuid,
            userData : data.userData,


        }
    })
}

 const getAllQueries = async ({query , moreQuery}) =>{

    return await prisma.query.findMany({
        ...query,
        ...moreQuery
    })
}

 const getAllUsers = async () =>{
    return await prisma.user.findMany({

    })
}

 const getQuery = async ({uuid}) =>{
    return await prisma.query.findFirst({
        where :{
            uuid : uuid
        },
        include : {
            user : true,
            correspondences : true
        },

    });
}

 const getUserDetails = async ({userid}) =>{
    return await prisma.user.findFirst({
        where:{
            uuid : userid
        }
    })
}

const updateQuery = async ({id , priority , status , type , assignedTo}) =>{
    let data = await prisma.user.findFirst({
        where : {
            email : assignedTo
        }
    })
    // console.log("QUERY",data.id)
    assignedTo = data.id
    // console.log(assignedTo)
    return await prisma.query.update({
        where:{
            id
        },
        data:{
            priority ,
            status,
            type,
            assignedTo,
        }
    })

}

const reopenQuery = async ({uuid , status ,  solvedBy , reason}) =>{
    let id = await prisma.user.findFirst({
        where:{
            email : solvedBy
        }
    })



    return await prisma.query.update({
        where:{
            uuid
        },
        data:{

            status,
            assignedTo : id.id,
            reason,
            solvedBy : null,
        }

    })

}


const filterQueries = async ({data}) =>{
    return await prisma.query.findMany({
        ...data
    })
}


const markAsSolved = async ({uuid  , adminEmail}) =>{
    return await prisma.query.update({
        where:{
            uuid
        },
        data:{
            solvedBy : adminEmail,
            status : "SOLVED"
        },
    })
}

const createCorrespondence = async ({data}) =>{

    return await prisma.correspondence.create({
        data:{
            actionLog : data.actionLog,
            comment : data.comment,
            actionType : data.actionType,
            user:{
                connect:{
                    id : data.adminId
                }
            },
            queries:{
                connect:{
                    id : data.queryId
                }
            }
        }
    })

}

const deleteQuery = async ({uuid}) =>{
    return await prisma.query.delete({
        where:{
            uuid
        }
    })
}

const getChats = async ({queryId}) =>{
    return await prisma.correspondence.findMany({
        where:{
            queryId : parseInt(queryId)
        },
        include:{
            user: {
                select : {
                    id : true,
                    name : true,
                    email : true,
                    groupId : true,
                }
            },
            queries : {
                include:{
                    user : {
                        select:{
                            id : true,
                            name : true,
                            email : true ,
                            phone : true,
                        }
                    }

                }
            } ,
        }
    })
}

export default {
    createUser ,
    createQuery ,
    getAllQueries ,
    getAllUsers ,
    getQuery ,
    getUserDetails,
    updateQuery,
    filterQueries,
    markAsSolved,
    createCorrespondence,
    deleteQuery,
    reopenQuery,
    getChats
}
