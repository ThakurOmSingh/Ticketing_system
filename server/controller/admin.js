import { error } from "console";
import generator from "generate-password";
import AdminUtils from "../utils/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/database.js";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import { connect } from "http2";
import ENV from '../env.js'

export const createAdmin = async (req, res) => {
  try {
    console.log(req.body)
    const {
      name,
      email,
      phone,
      isAdmin,
      notification,
      groupId  ,
      uuid,
    } = req.body;

    // Check if the email exist in system or not
    const findAdmin = await AdminUtils.findAdmin({ email });


    // if email already exist in our system
    if (findAdmin) {
      return res.status(422).json({
        status: false,
        message: "This email already exist.",
      });
    }


    //generate a random password
    const password = generator.generate({
      length: 5,
      numbers: true,
      uppercase: false,
      excludeSimilarCharacters: true,
    });

    // ENCRYPTING THE PASSOWRD using HASH SYNC
    let encryptedPassword = bcrypt.hashSync(password, 10);

    const data = {
      name,
      uuid,
      email,
      isAdmin,
      phone,
      password: encryptedPassword,
      notification,
      group: {
        connect: {
          id: parseInt(groupId),
        },
      },
    };





    // Creating Admin
    let response = await AdminUtils.createAdmin({ data });
    delete response.password;
    delete response.superadmin;

    // preparing data for sending email
    let recipient = email;
    let replacement = {
      email: email,
      password: password,
    };
    let subject = "Congratulations You have gained access of Ticketing System";
    let filepath = "template/newadmin.html";

    // sending email
    sendmail(recipient, filepath, replacement, subject);

    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    // Finding if the group already exist in the system
    const findGroup = await AdminUtils.findGroup(name);

    // if group already exist
    if (findGroup) {
      return res.status(422).json({
        status: false,
        message: "This group already exist.",
      });
    }

    const data = {
      name,
    };

    // creating new group
    let response = await AdminUtils.createGroup(data);

    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // checking if the user is Allowed to login else an error occur
    let response = await AdminUtils.login({ email, password });

    delete response.password;

    let data = {
      uuid: response.uuid,
      email: response.email,
    };
    // fetching secret key
    const secretKey = ENV.SECRET_KEY;
    // creating jwt token
    const token = jwt.sign(data, secretKey);

    return res.status(200).json({
      status: true,
      data: { ...response, token },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const forgetPassword = async (req, res) => {

  try {
    const { email, password, newPassword, type } = req.body;


    // searching user email
    let result = await AdminUtils.findAdmin({ email });

    // IF USER EMAIL FOUND
    if (result) {
        // handling forget password request
      if (type == "forget") {
        let password = generator.generate({
          length: 5,
          numbers: true,
          uppercase: false,
          excludeSimilarCharacters: true,
        });

        let encryptedPassword = bcrypt.hashSync(password, 10);
        let response = await AdminUtils.forgetPassword({
          email,
          encryptedPassword,
        });

        if (response) {
          // let response = await AdminUtils.createAdmin({ data });
          delete response.password;
          delete response.superadmin;

          let recipient = email;
          let replacement = {
            email: email,
            password: password,
          };
          let subject = "New Password for logging in";
          let filepath = "template/password_reset.html";
          sendmail(recipient, filepath, replacement, subject);
        } else {
          res.status(200).json({
            status: true,
            data: "something went wrong",
          });
        }
        res.status(200).json({
          status: true,
          data: password,
        });
      }else  //Handling request for Reset Password
      {
        let encryptedPassword = bcrypt.hashSync(newPassword, 10);
        let response = await AdminUtils.forgetPassword({
          email,
          encryptedPassword,
        });
        res.status(200).json({
          status: true,
          data: response,
        });
      }
    } else // If email id is not found
    {
      res.status(422).json({
        status: false,
        data: "Email Id is not registered",
      });
    }
  } catch (error) {
    res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

// export const  getAdmin = async (req ,res) =>{
//     try{

//         let uuid = req.query.uuid
//         let response =  await AdminUtils.getAdmin({uuid})
//         return res.status(200).json({
//             status:true,
//             data : response

//         })
//     }catch(error){

//         return res.status(422).json({
//             status: false,
//             message: error.message
//         })
//     }
// }

export const getAllAdmin = async (req, res) => {
  try {
    // fetching all admin details
    let response = await AdminUtils.getAllAdmin();

    response.forEach(admin => {
      delete admin.password;
      delete admin.isAdmin;
  });
    console.log(response)
    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
};

export const userDetails = async (req, res) => {
  try {
    const { userId } = req;

    // fetching user details for specific userId
    let userData = await prisma.user.findFirst({
      where: {
        uuid: userId,
      },
    });

    delete userData.password;

    return res.status(200).json({
      status: false,
      data: userData,
    });
  } catch (error) {
    return res.status(422).json({
      status: false,
      message: error,
    });
  }
};

export const getGroups = async (req , res) =>{
  try {
    // fetching all admin details
    let response = await prisma.group.findMany();

    return res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    return res.status(422).json({
      status: false,
      message: error.message,
    });
  }
}

//Send mail Function(Called when a mail to be sent)
const sendmail = async (recipient, filepath, replacement, subject) => {


  let smtpTransport = nodemailer.createTransport({
    host: process.env.NODEMAILER_SERVICE_HOST,
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  var html = fs.readFileSync(`${filepath}`, { encoding: "utf-8" });
  var template = handlebars.compile(html);

  // var replacements ={
  //     queryId : response.uuid,
  //     title : response.title,
  //     description : response.description,
  //     priority : response.priority

  // }

  let htmlToSend = template(replacement);

  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: recipient,
    subject: `${subject}`,
    html: htmlToSend,
  };
  smtpTransport.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      throw new error("SOMETHING WENT WRONG");
    } else {
      console.log("Mail sent Successfully");
    }
  });
  smtpTransport.close();
};
