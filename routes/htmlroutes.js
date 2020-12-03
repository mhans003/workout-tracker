const express = require("express");

const router = express.Router();

//const Workout = require("../models/Workout.js");

router.get("/", function(request, response) {
    response.send("index.html");
});

router.get("/stats", function(request, response) {
    response.send("stats.html");
});

module.exports = router;