const dotenv = require("dotenv");
dotenv.config();
const generateToken = require("./utils/generateToken.js");
const User = require("./models/User.js");
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Find the user King
  const admin = await User.findOne({ role: "college_admin" });
  if (!admin) {
    console.log("No admin found");
    return process.exit(1);
  }
  console.log("Admin:", admin.name, admin.college);
  
  const token = generateToken(admin._id, admin.role);
  
  // We need to fetch the events first to get an event id
  const Event = require("./models/Event.js");
  const event = await Event.findOne();
  if (!event) {
    console.log("No event found");
    return process.exit(1);
  }
  console.log("Event:", event.title, event.college);

  const fetchArgs = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  console.log("Fetching registrations...");
  const res = await fetch(`http://localhost:8080/api/admin/events/${event._id}/registrations`, fetchArgs);
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
  
  process.exit(0);
}

run();
