import Joi from "joi";

//validates the data before sending it as the request body to a server route or endpoint
//this happened before the network request
const contactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})
// Define validation for updating favorite field
const favoriteValidation = Joi.object({
  favorite: Joi.bool().required(),
});
// validation for signup
const signupValidation = Joi.object ({
  email: Joi.string()
  .email({minDomainSegments:2,tlds:{allow:["com","net"]}})//tlds top-level-domain
  .required()
  .messages({
    "any.required": "Missing required email field",
    "string.email": "Invalid email format",
}),
password: Joi.string()
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
const subscriptionValidation = Joi.object({
  subscription:Joi.string().valid("starter","pro","business"),
})
// validation for email
const emailValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
  });

export { contactValidation,favoriteValidation,signupValidation,subscriptionValidation,emailValidation};