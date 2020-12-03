const express = require("express");

const apiRouter = express.Router();

const Workout = require("../models/Workout.js");

apiRouter.get("/workouts", function(request, response) {
    response.send("in api/workouts");
});

apiRouter.post("/api/workouts", function(request, response) {

});

apiRouter.put("/api/workouts", function(request, response) {

});

//Get route?
apiRouter.get("/api/workouts/range", function(request, response) {

});

module.exports = apiRouter;