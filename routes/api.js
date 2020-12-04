const express = require("express");

const apiRouter = express.Router();

const Workout = require("../models/Workout.js");

apiRouter.get("/workouts", function(request, response) {
    response.send("in api/workouts");
});

apiRouter.post("/workouts", function(request, response) {
    Workout.create(request.body)
        .then(result => {
            response.json(result);
        })
        .catch(error => {
            response.json(error);
        });
});

apiRouter.put("/workouts/:id", function(request, response) {
    console.log(request.body.type);
    console.log(`Id: ${request.params.id}`);

    const requestBody = request.body;

    Workout.updateOne(
        {_id: request.params.id},
        {$push: {exercises: {requestBody}}}
    ).then(result => {
        console.log(result);
        response.json(result);
    })
    .catch(error => {
        console.log("Something went wrong adding exercise to this workout");
        response.json(error);
    });
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