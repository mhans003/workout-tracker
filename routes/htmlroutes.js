const express = require("express");
const path = require("path"); 

const router = express.Router();

//const Workout = require("../models/Workout.js");

router.get("/", function(request, response) {
    response.sendFile(path.resolve("index.html"));
});

router.get("/exercise", function(request, response) {
    response.sendFile(path.resolve("exercise.html"));
});

router.get("/stats", function(request, response) {
    response.sendFile(path.resolve("stats.html"));
});

module.exports = router;