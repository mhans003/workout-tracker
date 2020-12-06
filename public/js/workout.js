async function initWorkout() {
    //Start the workout by getting the last workout done.
    const lastWorkout = await API.getLastWorkout();

    //If there is a last workout:
    if (lastWorkout) {
        //Append that workout's ID to the URL.
        document
            .querySelector("a[href='/exercise?']")
            .setAttribute("href", `/exercise?id=${lastWorkout._id}`);
    
        //Get the data needed to generate the summary of that workout from the retrieved data.
        const workoutSummary = {
            date: formatDate(lastWorkout.day),
            totalDuration: lastWorkout.totalDuration,
            numExercises: lastWorkout.exercises.length,
            ...tallyExercises(lastWorkout.exercises)
        };
    
        //Generate the summary of the workout on the page.
        renderWorkoutSummary(workoutSummary);
    } else {
        //Otherwie, Don't show any text for that workout.
        renderNoWorkoutText();
    }
}

function tallyExercises(exercises) {
    //For each exercise, total the different exercise properties into various accumulator properties in a new object acc.
    const tallied = exercises.reduce((acc, curr) => {
        if (curr.type === "resistance") {
            acc.totalWeight = (acc.totalWeight || 0) + curr.weight;
            acc.totalSets = (acc.totalSets || 0) + curr.sets;
            acc.totalReps = (acc.totalReps || 0) + curr.reps;
        } else if (curr.type === "cardio") {
            acc.totalDistance = (acc.totalDistance || 0) + curr.distance;
        }

        //Return the final tallies.
        return acc;
    }, {});

    return tallied;
}
 
function renderWorkoutSummary(summary) {
    //Prepare to render the summary of the last workout.
    const container = document.querySelector(".workout-stats");

    //Create the text that will be output to the page to label the data.
    const workoutKeyMap = {
        date: "Date",
        totalDuration: "Total Workout Duration",
        numExercises: "Exercises Performed",
        totalWeight: "Total Weight Lifted",
        totalSets: "Total Sets Performed",
        totalReps: "Total Reps Performed",
        totalDistance: "Total Distance Covered"
    };

    Object.keys(summary).forEach(key => {
        //For each exercise property, create a p element to hold the key text and corresponding value.
        const p = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = workoutKeyMap[key];
        const textNode = document.createTextNode(`: ${summary[key]}`);

        //Append items and place on page.
        p.appendChild(strong);
        p.appendChild(textNode);

        container.appendChild(p);
    });
}
 
function renderNoWorkoutText() {
    //If there is not workout text to render, tell the user they have not created a first workout.
    const container = document.querySelector(".workout-stats");
    const p = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = "You have not created a workout yet!"

    p.appendChild(strong);
    container.appendChild(p);
}

initWorkout();
  