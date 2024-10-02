import express from "express";
import {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,} from "./controllers/contactControllers.js"


const router = express.Router();

//READ
//corresponds to listContacts
//http://localhost:3000/api/contacts/  -endpoint,to type in postman
router.get("/",getAllContacts);

//corresponds to contactById 
//READ
//http://localhost:3000/api/contacts/<id>
router.get("/:contactId",getContactById);


//ADDCONTACT- CREATE-
//http://localhost:3000/api/contacts/
router.post("/", addContact);

//removeContact 
//DELETE
//http://localhost:3000/api/contacts/<"id">
router.delete("/:contactId",deleteContact);

//updateContact UPDATE
//http://localhost:3000/api/contacts/1
router.put("/:contactId",  updateContact);

//patch -favorite
router.patch("/:contactId/favorite",updateContact);

export { router };
