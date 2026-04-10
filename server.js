import http from "http";
import app from "./app.js";
import db from "./src/config/db.js";
import model from "./src/models/index.js";
import { initSocket } from "./socket.js";
import { ensureSearchIndexViewAndIndexes } from "./src/utils/searchIndexView.js";

const server = http.createServer(app);
initSocket(server);

const port = process.env.SERVER_PORT || 3001;

try {
  await db.authenticate();
  console.log("DB Connection : Success");

  await db.sync({ force: false, alter: true });
  console.log("Tables are Ready");

  await ensureSearchIndexViewAndIndexes();
  console.log("Search view and indexes ensured");

  server.listen(port, (err) => {
    if (err) {
      console.log("Server Start : Failure");
      console.log(err.message);
    } else {
      console.log(`Server Start : Success. Running on port ${port}`);
    }
  });
} catch (error) {
  console.log("DB Connection : Failure");
  console.log(error.message);
}
