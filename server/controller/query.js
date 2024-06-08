import { error } from "console";
import QueryUtils from "../utils/query.js";
import AdminUtils from "../utils/admin.js";
import { receiveMessageOnPort } from "worker_threads";
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import prisma from "../utils/database.js";
import env from '../env.js'
import { connect } from "http2";
import axios from "axios"



export const createChat = async (req,res) => {
  try{
    let {adminId , actionType , actionLog , comment , queryId} = req.body

    let data ={
      adminId ,
      actionType ,
      actionLog ,
      comment ,
      queryId
    }

    let response = await QueryUtils.createCorrespondence({data})

    return res.status(200).json({
      status: true,
      data: response,
    });

  }catch (error) {
    console.log(error)
  return res.status(422).json({
      status: false,
      message: error.message,
    });
  }

}

export const createQuery = async (req, res) => {

  const {

    uuid,
    userData,
    isAdmin ,
    title,
    description,
    origin,
    applicationId,
    priority,
  } = req.body;
  const filePaths = req.files.map(file => file.path);
  let data ={}

  try {

     if(uuid){

       data = {
         uuid,
         title,
         description,
         origin,
         priority,
         applicationId,
         userRegistered : true
       };
     }else{
      data = {
        userData,
        title,
        description,
        origin,
        priority,
        applicationId,
        userRegistered : false
      };
     }
    // Creating new query
    let response = await QueryUtils.createQuery({ data });



    for(let i of filePaths){
      let fileRes = await prisma.files.create({
        data:{
          path : i,
            query : {connect : {
                    id : response.id
            }
          }

        }
      })
    }

    // Fetching Recipients who will receive email
    // let recipients = await AdminUtils.getRecipients()


    // Preparing data for sending email of new registered query
    // let filepath = "template/newQuery.html"
    // let replacement = {
    //   queryId : response.uuid,
    //   title : response.title,
    //   description : response.description,
    //   priority : response.priority
    // }
    // let subject = "New Query has been Registered "

    // sending mail to evry repient
    // for(let i of recipients){
    //   await sendmail(i["email"] , filepath , replacement , subject)
    // }

  return res.status(200).json({
      status: true,
      data: "response",
    });

  } catch (error) {
    //handling errors
    console.log(error)
   return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllQueries = async (req, res) => {

  // const {token} = req.headers
  const token =  req.header("authorization").split(" ")[1]

  try {
    let query = {}
    let moreQuery = {}
    let {status , page} = req.query

    if(status == "Unsolved"){
      query.where = { NOT : [{status : "SOLVED" }]
    }}else{
      query.where = {status : status }
    }

    query.include ={
      files : true,
    }
    if(page){
       moreQuery = {
        skip : (page-1)*10,
        take : 10
      }
    }

    let response = await QueryUtils.getAllQueries({query , moreQuery});


    for(let item of response){
      if(item.userid){
        let {data} = await axios.get(`${env.UNO_URL}/api/user/details/${item.userid}`,{
          headers:{
            authorization : `Bearer ${token}`
          }
        })
        delete(data.data.token)
        item.userData = data.data.user
      }else{
        item.userData = JSON.parse(item.userData)
      }
    }

    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    //handling errors
    console.log(error)
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let response = await QueryUtils.getAllUsers();
  return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    //handling errors
  return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const getQuery = async (req, res) => {
  try {

    let response = await QueryUtils.getQuery({ uuid: req.query.uuid });

  return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    //handling errors
  return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {

  try {

    //fetching user details for a specific uuid
    let response = await QueryUtils.getUserDetails(req.query.userid);


  return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    //handling errors
  return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const updateQuery = async (req, res) => {
  try {

    console.log(req.body)
    let { id, priority, status, type ,assignedTo , adminId , actionLog , actionType , comment } = req.body;
    let logData = {
      logs  : actionLog
    }
    console.log(logData)
    //Preparing Data for creating correspondence
    let data = {
      adminId ,
      actionType ,
      actionLog : logData,
      comment,
      queryId : id,
    }
    console.log("DATA")
    console.log(data)

    //creating correspondence
    let response = await QueryUtils.createCorrespondence({data})


    // updating the query
     response = await QueryUtils.updateQuery({
      id,
      priority,
      status,
      type,
      assignedTo,
    });


    return res.status(200).json({
      status: true,
      data: "response",
    });
  } catch (err) {
    //handling errors
    console.log(err)
    return res.status(422).json({
      status: false,
      message: err,
    });
  }
};

export const reopenQuery = async (req, res) => {
  try {
    // console.log(req.body)
    let { uuid, status, reason , solvedBy} = req.body;


    //Fetching uuid of admin who solved this ticket
    let adminId = await prisma.user.findFirst({
      where:{
        email : solvedBy,
        isAdmin : true,
      },
      select : {
        uuid : true,
    }
    })

    //Preparing Data for creating correspondence
    let data = {
      adminId : adminId.uuid ,
      actionType : "STATUS",
      actionLog : {
        logs : [{
          type : "STATUS",
          prev : "SOLVED",
          update  : "REOPEN"
        }]
      },
      comment : reason,
      queryId : uuid
    }

    //creating correspondence
    let response = await QueryUtils.createCorrespondence({data})

    //reopening query
     response = await QueryUtils.reopenQuery({
      uuid,
      status,
      reason,
      solvedBy
    });

    // sending mail to the admin
    let recipient = solvedBy ;
    let replacement = {
      queryId : response.uuid,
      title : response.title,
      description :  response.description,
      reason
    };
    let subject = "Ticket Reopened" ;
    let filepath = "template/queryReopened.html"
    sendmail(recipient , filepath , replacement , subject)


    return res.status(200).json({
      status: true,
      data: "response",
    });


  } catch (err) {
    //handling errors
    console.log(err)
    return res.status(422).json({
      status: false,
      message: err,
    });
  }
};


export const filterQuery = async (req , res) =>{


  let { status, priority, assignedTo, type , applicationId } = req.query

  let query = {}
  //filtering the query fetching based on options like status, priority, assignedTo, type
  try {

    if(status){
      query.where = {status : status }
    }
    if(priority){
      query.where = { priority : priority }
    }
    if(assignedTo){
      query.where = { assignedTo : assignedTo }
                  }
    if(type){
      query.where = { type : type }
    }

    if(applicationId){
      query.where ={applicationId : applicationId}
    }


    //fetching queries based on filters
    let response = await QueryUtils.filterQueries({data : query })

    return res.status(200).json({
      status: true,
      data: response,
    });



  } catch (error) {
    //handling errors
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
}

export const markAsSolved = async (req, res) => {
  try {

    // uPDATING THE STATUS OR QUERY TO SOLVED
    let { uuid, adminEmail , userEmail , comment , adminId } = req.body;

    //Preparing Data for creating correspondence
    let data = {
      adminId : adminId ,
      actionType : "STATUS",
      action : {} ,
      comment : comment ? comment : "THE QUERY HAS BEEN RESOLVED",
      queryId : uuid
    }

    let response = await QueryUtils.createCorrespondence({data})



    response = await QueryUtils.markAsSolved({ uuid, adminEmail });

    //preparing data for sending the mail to the user
    let recipient = response.user.email ;
    let replacement = {
      queryId : response.uuid,
      solvedBy : response.solvedBy
    };
    let subject = "Your Ticket has been Resolved" ;
    let filepath = "template/querySolved.html"
    sendmail(recipient , filepath , replacement , subject)




  return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {

    //handling errors
    console.log(err);
    return res.status(422).json({
      status: false,
      message: err,
    });
  }
};



export const deleteQuery = async (req , res) =>{
  try {

    let{uuid} = req.query
    let result = await QueryUtils.deleteQuery({uuid})

  return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {

    //handling errors
    console.log(err);
    return res.status(422).json({
      status: false,
      message: err,
    });
  }
}

export const getChats = async(req, res) =>{
  try {

    let {queryId} = req.query

    //FETCHING ALL THE CORRESPONDENCE RELATED TO A SPECIFIC QUERY ID
    let response = await QueryUtils.getChats({queryId})
    console.log("response")
    console.log(response)
  return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {

    //handling errors
    console.log(err);
    return res.status(422).json({
      status: false,
      message: err,
    });
  }
}


export const getCount = async(req , res) =>{
  try{

    let data = {}

  data.solvedCount = await prisma.query.count({
    where :{
      status : "SOLVED"
    }
  })


  data.unSolvedCount = await prisma.query.count({
    where :{
      NOT :{
        status : "SOLVED"
      }
    }
  })

  data.inProgress = await prisma.query.count({
    where :{
      status : "INPROGRESS"
    }
  })

  data.latest = await prisma.query.findFirst({
    where :{
      NOT :{
        status : "SOLVED"
      }
    },
    orderBy:{
      createdAt: 'desc'
    },
    include:{
      files: true,

    }
  })



  return res.status(200).json({
    status : true,
    response : data
  })

  }catch(error){
    console.log(error)
    return res.status(422).json({
      status : false,
      error: error
    })
  }

}


//Send mail Function(Called when a mail to be sent)
const sendmail = async (recipient , filepath , replacement , subject) =>{


  let smtpTransport = nodemailer.createTransport({
    host : process.env.NODEMAILER_SERVICE_HOST,
        service: process.env.NODEMAILER_SERVICE,
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD,
        }
  });

  var html = fs.readFileSync(`${filepath}`, {encoding:'utf-8'});
  var template = handlebars.compile(html);

  // var replacements ={
  //     queryId : response.uuid,
  //     title : response.title,
  //     description : response.description,
  //     priority : response.priority

  // }

  let htmlToSend = template(replacement)

  let mailOptions = {
    from : process.env.NODEMAILER_EMAIL,
    to : recipient,
    subject : `${subject}`,
    html : htmlToSend
  }
  smtpTransport.sendMail(mailOptions , (err) =>{
    if(err){
      console.log(err)
      throw new error("SOMETHING WENT WRONG")
    }else{
      console.log("Mail sent Successfully")
    }
  })
  smtpTransport.close()
}


