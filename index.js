// server.js or index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");
const { errorHandler } = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simplified and safer CORS config
const corsOptions = {
    origin: ["http://localhost:3000", "https://fitlog-fitness.vercel.app"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.get("/ping", (req, res) => {
    res.status(200).send("pong");
});

app.get("/", (req, res) => {
    res.status(200).send("Backend is live 🚀");
});

// Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
    console.log("Now Connected to MongoDB Atlas")
);

// Start server
if (require.main === module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}

module.exports = { app, mongoose };
