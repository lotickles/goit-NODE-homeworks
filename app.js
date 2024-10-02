import express from "express";
import logger from "morgan";
import cors from "cors";
import { router as contactsRouter } from "./routes/api/contactsRouter.js";

//initialize an express application
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// initialize the base path for the contacts router
//http://localhost:3000/contacts
app.use("/api/contacts", contactsRouter);

// error handling using res.status()
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

//server error
app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

export { app };

// IMPORT MODULES
// IMPORT ENVIRONMENT VARIABLES
// IMPORT AND USE MIDDLEWARES
// INITIALIZE BASE PATH FOR ROUTER
// ADD ERROR HANDLING
// EXPORT MODULE