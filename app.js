// Express + async errors
const express = require("express");
// Bcrypt is asynchronous
require("express-async-errors");

// Connect to MongoDB
require("./database/connection");

// Initialization of Express
const app = express();
const cors = require("cors");

// We will need to parse the incoming json into req.body
app.use(cors());
app.use(express.json());

// Import routes
const routes = require("./routes");

app.use("/api/v1/group", routes.groups);
app.use("/api/v1/request", routes.requests);
app.use("/api/v1/article", routes.articles);
app.use("/api/v1/user", routes.users);

module.exports = app;
