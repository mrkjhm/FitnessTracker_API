const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require('dotenv').config();

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");
const { errorHandler } = require("./auth");




// Environment setup
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true})); 

const corsOptions = {
    origin: ['http://localhost:3000', 'https://fitness-client-beige.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes)

app.use(errorHandler)

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now Connected to MongoDB Atlas'))



if (require.main === module) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`API is now online on port ${port}`);
    });
}


module.exports = { app, mongoose };




