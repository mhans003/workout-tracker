//Require Express and set up Express router; Require the Workout model.
const express = require("express");

const apiRouter = express.Router();

const Workout = require("../models/Workout.js");

//Get all workouts from the database, and include a running total for the duration.
apiRouter.get("/workouts", function(request, response) {
    //Using the aggregation pipeline, get all exercise data as well as a duration total for each day.
    Workout.aggregate([
        {$match: {}},
        {
            $project: {
                day: 1,
                _id: 1,
                exercises: 1,
                totalDuration: {
                    $sum: "$exercises.duration"
                }
            }
        }
    ])
    .then(data => {
        console.log(data);
        response.json(data);
    })
    .catch(error => {
        console.log("Something went wrong retrieving data.");
        response.json(error);
    });
    
});

//Retrieve no more than 7 results from the database.
apiRouter.get("/workouts/range", function(request, response) {
    Workout.find()
        .sort({day: -1})
        .limit(7)
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            console.log("Something went wrong retrieving data.");
            throw error;
        });
});

//Post a new workout to the database as an empty object.
apiRouter.post("/workouts", function(request, response) {
    Workout.create(request.body)
        .then(result => {
            response.json(result);
        })
        .catch(error => {
            response.json(error);
        });
});

//Add a new exercise to an existing workout.
apiRouter.put("/workouts/:id", function(request, response) {
    console.log(request.body);
    console.log(`Id: ${request.params.id}`);

    const requestBody = request.body;

    //Update where the ID matches, and push the exercise data to the exercise array in the database.
    Workout.updateOne(
        {_id: request.params.id},
        {$push: {exercises: requestBody}}
    ).then(result => {
        console.log(result);
        response.json(result);
    })
    .catch(error => {
        console.log("Something went wrong adding exercise to this workout");
        response.json(error);
    });
});

module.exports = apiRouter;