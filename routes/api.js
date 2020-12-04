//Require Express and set up Express router; Require the Workout model.
const express = require("express");

const apiRouter = express.Router();

const Workout = require("../models/Workout.js");

apiRouter.get("/workouts", function(request, response) {
    
    /*
    Workout.find()
        .then(data => {
            response.json(data);
        })
        .catch(error => {
            console.log("Something went wrong retrieving data.");
            throw error;
        });
    */

    //Rewrite with aggregation pipeline to return totalDuration sum

    /*

        {
            $group: {
                _id: "$_id", 
                //day: "$day",
                numExercises: "$exercises.length",
                //exercises: "$exercises",
                totalDuration: {
                    $sum: "$exercises.duration"
                }
            }
        },



        {$unwind: "$exercises"},
        

    */
    
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
    console.log(request.body);
    console.log(`Id: ${request.params.id}`);

    const requestBody = request.body;

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