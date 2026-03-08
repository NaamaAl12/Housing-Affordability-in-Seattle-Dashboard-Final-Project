const rent_path = "assets/rent_burden.geojson";
const income_path = "assets/renter_income.geojson";
const race = ["All", "White", "Black", "Hispanic", "Asian", "Native"];
const income = ["F0___30_", "F30___50_", "F50___80_", "F80___120_", "Above_120_"];
const income_val = ["$0-30K", "$30-50k", "$50-80k", "$80-120k", "$120k+"];

const state = {
    year: 2022,
    race: "All",
    rentBurden: [],
    renterIncome: [],
    trendChart: null,
    raceChart: null,
    incomeChart: null
};

function percent(value){
    if(value == null || Number.isNaN(value)){
        return "N/A";
    }
    return `${(value * 100).toFixed(1)}%`;
}

function nuum(value){
    if(value == null || Number.isNaN(value)){
        return "N/A";
    }
    return d3.format(",")(Math.round(value));
}

function rentFinder({year, race = "All", tenure = "Renters", age = "All"}){
    return state.rentBurden.find(d =>
        d.YEAR === year &&
        d.RACE === race &&
        d.TENURE === tenure &&
        d.AGE === age
    );
}

function incomeFinder(year){
    return state.renterIncome.find(d =>
        d.YEAR === year
    );
}

function statUpdater(){
    const record = rentFinder({
        year: state.year,
        race: state.race,
        tenure: "Renters",
        age: "All"
    });

    const statElement = document.getElementById("burden-stat");
    const sublblElement = document.getElementById("burden-year-label");

    statElement.textContent = record ? percent(record.All_) : "N/A";
    sublblElement.textContent = `${state.race} renters | ${state.year}`;
}

function trendChartBuilder(){
    const years = [...new Set(state.rentBurden.map(d =>
        d.YEAR
    ))].sort((a, b) => a - b);

    const values = years.map(year => {
        const record = rentFinder({
            year,
            race: state.race,
            tenure: "Renters",
            age: "All"
        });
        return record ? +(record.All_ * 100).toFixed(2) : null;
    });

    const selectedPoint = years.map(year =>
        year === state.year
        ? ((rentFinder({
            year,
            race: state.race,
            tenure: "Renters",
            age: "All"
        })?.All_ ?? null) * 100)
        : null
    );

    if(!state.trendChart){
        state.trendChart = c3.generate({
            bindto: "#trend-chart",
            size: {height: 160},
            data: {
                x: "x",
                columns: [
                    ["x", ...years],
                    ["Rent Burden", ...values],
                    ["Selected Year", ...selectedPoint]
                ],
                types: {
                    "Rent Burden": "line",
                    "Selected Year": "scatter"
                }
            },
            point: {
                show: true,
                r: 3
            },
            axis: {
                x: {
                    label: "Year",
                    tick: {
                        values: years.filter(y =>
                            [2006, 2010, 2014, 2018, 2022].includes(y)
                        )
                    }
                },
                y: {
                    label: "% paying >50% of income on rent",
                    min: 0,
                    max: 50,
                    padding: {top: 0, bottom: 0},
                    tick: {
                        format: d => `${d}%`
                    }
                }
            },
            grid: {
                x: {
                    lines: [
                        {value: 2019,
                         text: "MHA citywide"   
                        }
                    ]
                }
            },
            color: {
                pattern: ["#4fc3c3", "#f5a623"]
            },
            legend: {
                show: false
            },
            tooltip: {
                format: {
                    title: x => `Year ${x}`,
                    value: value => `${value.toFixed(1)}%`
                }
            }
        });
    } else{
        state.trendChart.load({
            columns: [
                ["x", ...years],
                ["Rent Burden", ...values],
                ["Selected Year", ...selectedPoint]
            ]
        });
    }
}

function raceChartBuilder(){
    const groups = race;
    const values = groups.map(race => {
        const record = rentFinder({
            year: state.year,
            race,
            tenure: "Renters",
            age: "All"
        });
        return record ? +(record.All_ * 100).toFixed(2) : 0;
    });
    document.getElementById("chart2-year-label").textContent = `(${state.year})`;
    if(!state.raceChart){
        state.raceChart = c3.generate({
            bindto: "#race-chart",
            size: { height: 160},
            data: {
                x: "x",
                columns: [
                    ["x", ...groups],
                    ["Rent Burden", ...values]
                ],
                type: "bar",
                colors: {
                    "Rent Burden": "#e74c3c"
                }
            },
            axis: {
                x: {
                    type: "category",
                    label: "Group"
                },
                y: {
                    label: "% paying >50% of income on rent",
                    min: 0,
                    max: 50,
                    padding: {top: 0, bottom: 0},
                    tick: {
                        format: d => `${d}%`
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            legend: {
                show: false
            },
            tooltip: {
                format: {
                    value: value => `${value.toFixed(1)}%`
                }
            }
        });
    } else{
        state.raceChart.load({
            columns: [
                ["x", ...groups],
                ["Rent Burden", ...values]
            ]
        });
    }
}

function incomeChartBuilder(){
    const record = incomeFinder(state.year);
    const values = income.map(field => record ? record[field] : 0);
    if(!state.incomeChart){
        state.incomeChart = c3.generate({
            bindto: "#income-chart",
            size: {height: 160},
            data: {
                x: "x",
                columns: [
                    ["x", ...income_val],
                    ["Households", ...values]
                ],
                type: "bar",
                colors: {
                    Households: "#4fc3c3"
                }
            },
            axis: {
                x: {
                    type: "category",
                    label: "Income Bracket"
                },
                y: {
                    label: "Renter Households",
                    tick: {
                        format: d3.format(",")
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            legend: {
                show: false
            },
            tooltip: {
                format: {
                    value: value => d3.format(",")(value)
                }
            }
        });
    } else{
        state.incomeChart.load({
            columns: [
                ["x", ...income_val],
                ["Households", ...values]
            ]
        });
    }
}

function renderEm(){
    statUpdater();
    trendChartBuilder();
    raceChartBuilder();
    incomeChartBuilder();
}

function bindController(){
    const yearSlider = document.getElementById("year-slider");
    const yearDisplay = document.getElementById("year-display");
    const raceButtons = document.querySelectorAll(".race-btn");

    yearSlider.value = state.year;
    yearDisplay.textContent = state.year;

    yearSlider.addEventListener("input", e => {
        state.year = +e.target.value;
        yearDisplay.textContent = state.year;
        renderEm();
    });

    raceButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            raceButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            state.race = btn.dataset.race;
            renderEm();
        });
    });
}

async function loadData(){
    const [rentResponse, incomeResponse] = await Promise.all([
        fetch(rent_path),
        fetch(income_path)
    ]);
    const rentJson = await rentResponse.json();
    const incomeJson =await incomeResponse.json();

    state.rentBurden = (rentJson.features || []).map(f => f.properties);
    state.renterIncome = (incomeJson.features || []).map(f => f.properties);
}

async function init(){
    try{
        await loadData();
        bindController();
        renderEm();
    } catch (err){
        console.error("charts.js failed:", err);
        document.getElementById("burden-stat").textContent = "Data error";
    }
}

init();