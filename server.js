const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path"); 

const PORT = process.env.PORT || 8080;

const app = express();

//Serve public directory
app.use(express.static("public"));

app.use(logger("dev"));

//Configure Express (Data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to Database
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost/workouttracker-mh", 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
);

//Import routes and give access to them.
const htmlRoutes = require("./routes/htmlroutes");
const apiRoutes = require("./routes/api");

app.use("/", htmlRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});