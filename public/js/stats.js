//Get all workout data from server.
fetch("/api/workouts/range")
    .then(response => {
        return response.json();
    })
    .then(data => {
        //Then, populate the charts with the data.
        console.log(data);
        populateChart(data);
    });

/*
const workoutData = API.getWorkoutsInRange();
console.log(workoutData);
*/

function generatePalette() {
    //Generate the color palette for the output.
    const arr = [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "ffa600",
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#a05195",
        "#d45087",
        "#f95d6a",
        "#ff7c43",
        "ffa600"
    ];

    return arr;
}

function populateChart(data) {
    //Get all dates to populate chart.
    let chartDates = getDates(data); 
    console.log(chartDates);

    console.log("another log");

    //For each major category (exercise property), get the totals.
    let durations = duration(data);
    let pounds = calculateTotalWeight(data);
    console.log(pounds);
    let workouts = workoutNames(data);
    const colors = generatePalette();

    //Identify the parts of the HTML where the charts will be rendered.
    let line = document.querySelector("#canvas").getContext("2d");
    let bar = document.querySelector("#canvas2").getContext("2d");
    let pie = document.querySelector("#canvas3").getContext("2d");
    let pie2 = document.querySelector("#canvas4").getContext("2d");

    //Produce the line chart for the exercise duration.
    let lineChart = new Chart(line, {
        type: "line",
        data: {
            labels: [
                ...chartDates
            ],
            datasets: [
                {
                    label: "Workout Duration In Minutes",
                    backgroundColor: "red",
                    borderColor: "red",
                    data: durations,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true
                        }
                    }
                ]
            }
        }
    });

    //Generate the bar chart for exercise weight.
    let barChart = new Chart(bar, {
        type: "bar",
        data: {
            labels: [
                ...chartDates
            ],
            datasets: [
                {
                    label: "Pounds",
                    data: pounds,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: "Pounds Lifted"
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    });

    //Generate pie chart for the exercises.
    let pieChart = new Chart(pie, {
        type: "pie",
        data: {
            labels: workouts,
            datasets: [
                {
                    label: "Excercises Performed",
                    backgroundColor: colors,
                    data: durations
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: "Excercises Performed"
            }
        }
    });

    //Generate donut chart for the exercises.
    let donutChart = new Chart(pie2, {
        type: "doughnut",
        data: {
            labels: workouts,
            datasets: [
                {
                    label: "Excercises Performed",
                    backgroundColor: colors,
                    data: pounds
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: "Excercises Performed"
            }
        }
    });
}

//Get the dates to populate chart with.
function getDates(data) {
    let dates = [];

    console.log("In getdates");
    console.log(data.length);

    data.forEach(workout => {
        dates.push(formatDate(workout.day));
    });

    return dates;
}

//Get the total duration for each day of exercise.
function duration(data) {
    let durations = [];

    data.forEach(workout => {
        let thisWorkoutTotal = 0;
        workout.exercises.forEach(exercise => {
            thisWorkoutTotal += exercise.duration;
        });
        durations.push(thisWorkoutTotal);
    });

    return durations;
}

//Get the total weight for each day of exercise.
function calculateTotalWeight(data) {
    let total = [];

    data.forEach(workout => {
        let thisWorkoutTotal = 0;
        workout.exercises.forEach(exercise => {
            thisWorkoutTotal += exercise.weight;
        });
        total.push(thisWorkoutTotal);
    });

    console.log(total);
    return total;
}

//Get the names of each exercise.
function workoutNames(data) {
    let workouts = [];

    data.forEach(workout => {
        workout.exercises.forEach(exercise => {
            workouts.push(exercise.name);
        });
    });
    
    return workouts;
}
