const express = require("express");

const apiRouter = express.Router();

const Workout = require("../models/Workout.js");

apiRouter.get("/workouts", function(request, response) {
    response.send("in api/workouts");
});

apiRouter.post("/workouts", function(request, response) {

});

apiRouter.put("/workouts/:id", function(request, response) {
    console.log(request.body.type);
    console.log(`Id: ${request.params.id}`);
});

//Get route?
apiRouter.get("/workouts/range", function(request, response) {
    Workout.find()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            console.log("Something went wrong retrieving data.");
            throw error;
        });
});

module.exports = apiRouter;