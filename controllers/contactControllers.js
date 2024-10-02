//mongoose connection
//mvC-controller
import { Contact } from "../models/contactsModel.js"
import {contactValidation, favoriteValidation} from "../validation/validation.js"


//MVC Architecture 
//M-model, V-view, C -controller
const getAllContacts = async (_req, res, next) => {
  try {
    const result = await Contact.find({});
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({_id: contactId});
    if (!result) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    next(error); 
  }
};
const addContact = async (req, res, next) => {
  const { error } = contactValidation.validate(req.body);
  if (error) {
    res.status(400).json({ message: "missing required name field" });
  }
  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);//201-created
  } catch (error) {
    next(error);
  }
};
  const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;// Get contactId from request parameters
      const result = await Contact.findByIdAndDelete(contactId);// Attempt to delete the contact
      if (!result) {
        // If no contact was found and deleted, return a 404 status
        return res.status(404).json({ message: "Not found" });
      }
      // If successful, return the deleted contact
        return res.status(200).json(result);
      }   catch (error) {
          // Pass the error to the next middleware (error handler)
        next(error);
      }
  };
const updateContact = async (req, res, next) => {
  const { error } = contactValidation.validate(req.body);

  if (error) {
    res.status(400).json({ message: "missing required name field" });
  }
  try {
    const result = await Contact.findByIdAndUpdate(
      req.params.contactId,req.body);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    // Validate the request body for the favorite field
    const { error } = favoriteValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const { contactId } = req.params;
    // Attempt to find and update the contact
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    // Send the updated contact data as a response
    res.json(result);
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};
const updateFavorite = async(req,res,next) =>{
  try {
    const { contactId } = req.params;
    // Validate if the favorite field exists in the body
    if (req.body.favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }
   // Call updateStatusContact and pass req, res, and next
   await updateStatusContact(req, res, next);
    
  } catch (error) {
    next(error);
  }
}

export {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateFavorite,
  updateStatusContact,
};