// Connect to MongoDB
require("./database/connection");

const app = require("./app");

app.listen(process.env.PORT || 5000, () => {
  console.log("Serveur écoute sur le port 5000.");
});
