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
// const userValidation = joi.object({
//   email: joi.string().required(),
//   password: joi.string().required(),
//   subscription: joi.string().valid("starter", "pro", "business").required(),
// })
const signupValidation = joi.object ({
  email: joi.string()
  .email({minDomainSegments:2,tlds:{allow:["com","net"]}})
  .required().messages({
  'string.email': `"email" must be a valid email address`,
  'any.required': `"email" is a required field`
}),
password: joi.string()
  .min(6)
  .max(16)
  .required()
  .messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'string.max': `"password" should have a maximum length of {#limit}`,
    'any.required': `"password" is a required field`
  }),
})
const subscriptionValidation = joi.object({
  subscription:joi.string().valid("starter","pro","business"),
})


export { contactValidation,favoriteValidation,signupValidation,subscriptionValidation };