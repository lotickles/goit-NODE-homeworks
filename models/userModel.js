import {Schema} from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, //must not be repeated
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],//datatype,collection
    default: "starter"
  },
  token: {
    type: String,
    default: null,
    },
  },
  { versionKey: false }
);

const User = model("user",userSchema);

export {User};

//MVC creation
//1. model View
//2.router
//3.controller