const express = require("express");
const path = require("path"); 

const router = express.Router();

//Create the routes for each HTML page.

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