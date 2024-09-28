import express from "express";
import loggere from "morgan";
import cors from "cors";
import { router as contactsRouter } from "./routes/api/contactsRouter.js";

//initialize an express application
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(loggere(formatsLogger));
app.use(cors());
app.use(express.json());

// initialize the base path for the contacts router
//http://localhost:3000/contacts
app.use("/api/contacts", contactsRouter);

// error handling using res.status()
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

//server error
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

export { app };
