// Connect to MongoDB
require("./database/connection");

const app = require("./app");

app.listen(5000, () => {
  console.log("Serveur écoute sur le port 5000.");
});
