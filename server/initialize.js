import fs from 'fs'
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

function jsonToEnv(jsonData) {
    let envData = "";
    for (const key in jsonData) {
      if (Object.hasOwnProperty.call(jsonData, key)) {
        envData += `${key}=${jsonData[key]}\n`;
      }
    }
    return envData;
  }


try{

    let response = await axios.get(`${process.env.SSO_URL}/api/v2/application/environment/configuration/${process.env.APPLICATION_ID}` , {
        headers: {
            Authorization: `Bearer ${process.env.DIRECTORY_TOKEN}`,
        },
    })

    let jsonData = response.data.data
    console.log("init");
    console.log(jsonData);

    jsonData["SSO_URL"] = process.env.SSO_URL
    jsonData["APPLICATION_ID"] = process.env.APPLICATION_ID
    jsonData["DIRECTORY_TOKEN"] = process.env.DIRECTORY_TOKEN

    const envData = jsonToEnv({
        SSO_URL: jsonData["SSO_URL"],
        APPLICATION_ID: jsonData["APPLICATION_ID"],
        DIRECTORY_TOKEN: jsonData["DIRECTORY_TOKEN"],
        DATABASE_URL: process.env.DATABASE_URL,
    });

    fs.writeFile(".env", envData, (err) => {
        if (err) {
          console.error("Error writing to .env file:", err);
        } else {
          console.log(".env file has been created successfully.");
        }
      });

      fs.writeFile("env.js", `export default ${JSON.stringify(jsonData, null, 2)}`, (err) => {
        if (err) {
          console.error("Error writing to .env file:", err);
        } else {
          console.log("env.json file has been created successfully.");
        }
      });


}catch(error){
    console.log("Error occurred while fetching data",error)
}