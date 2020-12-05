//These functions communicate with the server. 
const API = {
    //Retrieve the last workout done.
    async getLastWorkout() {
        let res;
        //Get the workout/exercise data.
        try {
            res = await fetch("/api/workouts");
        } catch (err) {
            console.log(err)
        }
        //Once the server retrieves the workouts/exercises, return back the most recent.
        const json = await res.json();
        return json[json.length - 1];
    },
    async addExercise(data) {
        //Add an exercise to an existing workout. 

        //Get the id for the current workout from the URL (search query).
        const id = location.search.split("=")[1];
    
        //Send the exercise data over to the server to be added to the matching workout id.
        const res = await fetch("/api/workouts/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
  
        //Send the response data back.
        const json = await res.json();
        return json;
    },
    async createWorkout(data = {}) {
        //Create the workout (which will be empty by default).
        //Send the (empty) object data over to the server to be stored.
        const res = await fetch("/api/workouts", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });
    
        //Send the response data back.
        const json = await res.json();
        return json;
    },
  
    async getWorkoutsInRange() {
        //Get the workouts within a specified range and return the result back.
        const res = await fetch(`/api/workouts/range`);
        const json = await res.json();
        return json;
    },
};
  