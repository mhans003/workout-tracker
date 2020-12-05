//Save references to HTML elements.
const workoutTypeSelect = document.querySelector("#type");
const cardioForm = document.querySelector(".cardio-form");
const resistanceForm = document.querySelector(".resistance-form");
const cardioNameInput = document.querySelector("#cardio-name");
const nameInput = document.querySelector("#name");
const weightInput = document.querySelector("#weight");
const setsInput = document.querySelector("#sets");
const repsInput = document.querySelector("#reps");
const durationInput = document.querySelector("#duration");
const resistanceDurationInput = document.querySelector("#resistance-duration");
const distanceInput = document.querySelector("#distance");
const completeButton = document.querySelector("button.complete");
const addButton = document.querySelector("button.add-another");
const toast = document.querySelector("#toast");
const newWorkout = document.querySelector(".new-workout")

//Set up variables that will be manipulated/used later.
let workoutType = null;
let shouldNavigateAway = false;

async function initExercise() {
    //Start a workout.
    let workout;

    //If there is no workout currently in the URL, create an empty workout.
    if (location.search.split("=")[1] === undefined) {
        workout = await API.createWorkout()
        console.log(workout)
    }
    //Otherwise, append its ID to the URL.
    if (workout) {
        location.search = "?id=" + workout._id;
    }
}

initExercise();

function handleWorkoutTypeChange(event) {
    //Handle the input form fields depending on whether the user selects resistance or cardio.
    workoutType = event.target.value;

    if (workoutType === "cardio") {
        cardioForm.classList.remove("d-none");
        resistanceForm.classList.add("d-none");
    } else if (workoutType === "resistance") {
        resistanceForm.classList.remove("d-none");
        cardioForm.classList.add("d-none");
    } else {
        //If neither, then don't show those input fields yet.
        cardioForm.classList.add("d-none");
        resistanceForm.classList.add("d-none");
    }

    validateInputs();
}

function validateInputs() {
    //Confirm that the user's input is valid.
    let isValid = true;

    if (workoutType === "resistance") {
        //Check over to see if any of the fields are blank.
        if (nameInput.value.trim() === "") {
            isValid = false;
        }

        if (weightInput.value.trim() === "") {
            isValid = false;
        }

        if (setsInput.value.trim() === "") {
            isValid = false;
        }

        if (repsInput.value.trim() === "") {
            isValid = false;
        }

        if (resistanceDurationInput.value.trim() === "") {
            isValid = false;
        }
    } else if (workoutType === "cardio") {
        if (cardioNameInput.value.trim() === "") {
            isValid = false;
        }

        if (durationInput.value.trim() === "") {
            isValid = false;
        }

        if (distanceInput.value.trim() === "") {
            isValid = false;
        }
    }

    //As long as all input fields pass all tests, enable the two buttons.
    if (isValid) {
        completeButton.removeAttribute("disabled");
        addButton.removeAttribute("disabled");
    } else {
        completeButton.setAttribute("disabled", true);
        addButton.setAttribute("disabled", true);
    }
}

async function handleFormSubmit(event) {
    //Prepare for the data to be sent over.
    event.preventDefault();

    let workoutData = {};

    //Depending on workout type, create the object and its data to be sent over using the user's input.
    if (workoutType === "cardio") {
        workoutData.type = "cardio";
        workoutData.name = cardioNameInput.value.trim();
        workoutData.distance = Number(distanceInput.value.trim());
        workoutData.duration = Number(durationInput.value.trim());
    } else if (workoutType === "resistance") {
        workoutData.type = "resistance";
        workoutData.name = nameInput.value.trim();
        workoutData.weight = Number(weightInput.value.trim());
        workoutData.sets = Number(setsInput.value.trim());
        workoutData.reps = Number(repsInput.value.trim());
        workoutData.duration = Number(resistanceDurationInput.value.trim());
    }

    //Send this data over to be added to the workout.
    await API.addExercise(workoutData);
    //Clear the inputs and display a success message.
    clearInputs();
    toast.classList.add("success");
}

function handleToastAnimationEnd() {
    toast.removeAttribute("class");
    if (shouldNavigateAway) {
        location.href = "/";
    }
}

function clearInputs() {
    //Clear all inputs (called after form submission).
    cardioNameInput.value = "";
    nameInput.value = "";
    setsInput.value = "";
    distanceInput.value = "";
    durationInput.value = "";
    repsInput.value = "";
    resistanceDurationInput.value = "";
    weightInput.value = "";
}

if (workoutTypeSelect) {
    //Each time a user changes the input type, call the function that handles it.
    workoutTypeSelect.addEventListener("change", handleWorkoutTypeChange);
}
if (completeButton) {
    completeButton.addEventListener("click", function (event) {
        //When the user presses the button to complete, prepare to navigate away and send data over to server.
        shouldNavigateAway = true;
        handleFormSubmit(event);
    });
}
if (addButton) {
    //If the user is adding an exercise, send the data over and prepare for the animation to end on the success message
    addButton.addEventListener("click", handleFormSubmit);
}
toast.addEventListener("animationend", handleToastAnimationEnd);

//Validate every input that is typed into.
document
    .querySelectorAll("input")
    .forEach(element => element.addEventListener("input", validateInputs));
