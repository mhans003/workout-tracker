init();

//At the beginning of the program, see if there isn't currently a workout (id in the URL).
async function init() {
    if (location.search.split("=")[1] === undefined) {
        //If not, get the last workout from the server to be appended to the URL.
        const workout = await API.getLastWorkout();
        if (workout) {
            location.search = "?id=" + workout._id;
        } else {
            //If no workout exists, don't allow the user to continue a previous workout.
            document.querySelector("#continue-btn").classList.add("d-none")
        }
    }
}
