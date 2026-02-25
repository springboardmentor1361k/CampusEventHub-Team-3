const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

require("dotenv").config();

console.log("PORT:", process.env.PORT);
console.log("JWT:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("MONGO:", process.env.MONGO_URI ? "Loaded" : "Not Loaded");