const app = require("./src/app");
const connectDb = require("./src/config/db");

async function startServer() {
  try {
    await connectDb();

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

startServer();
