import joi from "joi";
//JOI VALIDATION
//validates the data before sending it as the request body to a server rout or endpoint
//this happend before the network request
const contactValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
})
// Define validation for updating favorite field
const favoriteValidation = joi.object({
  favorite: joi.bool().required(),
});

  
export { contactValidation,favoriteValidation };