// Express + async errors
const express = require("express");
const app = express();

const routes = require("./routes");

app.use("/api/v1/group", routes.groups);
app.use("/api/v1/request", routes.requests);
app.use("/api/v1/post", routes.posts);
app.use("/api/v1/user", routes.users);

module.exports = app;
