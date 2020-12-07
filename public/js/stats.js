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
        "rgba(120,47,223,1.0)",
        "rgba(154,47,223,1.0)",
        "rgba(188,47,223,1.0)",
        "rgba(188,47,100,1.0)",
        "rgba(158,98,145,1.0)",
        "rgba(158,98,179,1.0)",
        "rgba(172,143,179,1.0)",
        "rgba(72,130,179,1.0)",
        "rgba(87,107,179,1.0)",
        "rgba(144,107,125,1.0)",
        "rgba(184,67,188,1.0)",
        "rgba(217,105,218,1.0)",
        "rgba(81,38,79,1.0)",
        "rgba(81,38,129,1.0)",
        "rgba(196,38,129,1.0)",
        "rgba(50,38,207,1.0)"
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
                    label: "Workout Duration (min)",
                    borderColor: "rgba(86, 128, 233, 1.0)",
                    backgroundColor: "rgba(132, 206, 235, 1.0)",
                    data: durations,
                    fill: false
                }
            ]
        },
        options: {
            legend: {
                labels: {
                    fontFamily: "Ubuntu",
                    fontSize: 20
                }
            },
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
    console.log(pounds);
    let poundColors = getPoundColors(pounds);
    console.log(poundColors);
    let barChart = new Chart(bar, {
        type: "bar",
        data: {
            labels: [
                ...chartDates
            ],
            datasets: [
                {
                    label: "Pounds Lifted",
                    data: pounds,
                    backgroundColor: [
                        ...poundColors
                    ],
                    borderColor: [
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)",
                        "rgba(86, 128, 233, 1.0)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            legend: {
                labels: {
                    fontFamily: "Ubuntu",
                    fontSize: 20
                }
            },
            title: {
                display: false
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
            legend: {
                labels: {
                    fontFamily: "Ubuntu"
                }
            },
            title: {
                display: true,
                text: "Excercises Performed",
                fontFamily: "Ubuntu",
                fontSize: 20
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
            legend: {
                labels: {
                    fontFamily: "Ubuntu"
                }
            },
            title: {
                display: true,
                text: "Excercises Performed",
                fontFamily: "Ubuntu",
                fontSize: 20
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

//Get the 'a' values (up to 1.0) for the rgba colors that will populate chart depending on how close it is to the max pounds. 
function getPoundColors(pounds) {
    console.log(pounds);

    let maxPound = 0;
    let poundColors = [];

    //Get the highest number of pounds (this will be the default 1.0 'a' value).
    pounds.forEach(pound => {
        if(pound > maxPound) {
            maxPound = pound;
        } 
    });
    
    //Get all other 'a' values for each day, relative to the greatest number of pounds lifted.
    pounds.forEach(pound => {
        poundColors.push(`rgba(132, 206, 235, ${Number((pound / maxPound).toFixed(2))})`);
    });

    return poundColors;
}