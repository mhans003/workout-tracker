const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

//Configure Express (Data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Serve public directory
app.use(express.static("public"));

//Connect to Database
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workouttracker-mh", { useNewUrlParser: true });

// Import routes and give access to them.
var routes = require("./routes/api.js");

app.use(routes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});