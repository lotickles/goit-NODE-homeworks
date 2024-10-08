import {app} from "./app.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {DB_HOST,PORT} = process.env;

mongoose.connect(DB_HOST)
.then(() => {
  app.listen(PORT,() =>{
    console.log("Server is running. Use our API on port: 3000");
  })
  console.log("Database connect successful");
})
.catch((error) => {
  console.error(`Server not running.Error message: ${error.message}`);
  process.exit(1); // exit the process with an error code
})

