import {Schema} from "mongoose";
import mongoose from "mongoose";
//MONGOOSE SCHEMA VALIDATION
//VALIDATES THE DATA BOFRE SAVING IT TO THE MONGODB DATABASE
//this happend after the network request
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'], 
      index:1,  
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true },

);
const Contact= mongoose.model("contacts",contactSchema);
export {Contact};

//MVC Architecture
// What is MVC? The Model-View-Controller (MVC) framework is an architectural/design pattern that separates an application into three main logical components Model, View, and Controller. Each architectural component is built to handle specific development aspects of an application.