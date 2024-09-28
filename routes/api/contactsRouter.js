import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from "../../models/contacts.js";

const router = express.Router();

//listContacts READ
//http://localhost:3000/api/contacts/  -endpoint,to type in postman
router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
//contactById READ
//http://localhost:3000/api/contacts/1

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    // res.send(contactId);
    const result = await getContactById(contactId);
    if (!result) {
      res.status(404).json({ message: "No found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
//addContact CREATE
//http://localhost:3000/api/contacts/
router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
//removeContact DELETE
//http://localhost:3000/api/contacts/2
router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (!result) {
      res.status(404).json({ message: "No found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});
//updateContact UPDATE
//http://localhost:3000/api/contacts/1
router.put("/:contactId", async (req, res, next) => {
  try {
    const result = await updateContact(req.params.contactId, req.body);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { router };
