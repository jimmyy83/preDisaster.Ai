require("dotenv").config();



const app = require("./src/app");
const connectDB = require("./src/db/connect");

connectDB();

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});