const UIController = (mainController) => {

    let clickedCountries = [];

    let mode = 'line';
    
    let currentDataSet;
    let mostPopulatedChartMode = 'doughnut';
    let populationGrowthYearLabels = [];
    let populationGrowthDataSets = [];

    let chart;
    let mostPopulatedChart;
    let populationCompareChart;
    let populationGrowthLabelGap = 4;


    const DOM = Object.freeze({

        // buttons etc for the first graph 

        mainChart: select('#chart'),
        graphSelector: select('#graph-selector'),
        graphSelectionButtons: select('#btn-fixed'),
        graphBtns: document.getElementsByClassName('graph'),

        carbonBtn: select('#Global Co-2'),
        temperatureBtn: select('#Global Temperature'),
        populationBtn: select('#Global Population'),

        fillCheckBox: select('#fillBox'),
        lineBtn: select('#line'),
        barBtn: select('#bar'),

        // buttons etc for the first top 10 most populated graph 

        mostPopulatedChart: select('#population-chart-1'),
        topPopulationGraphBtns: [
            select('#pie'),
            select('#bar-2'),
            select('#hBar'),
            select('#doughnut')
        ],
        //buttons etc for the population growth comparison graph

        populationCompareChart: select('#population-chart-2'),
        addCountryBtn: select('#add-country-1'),
        removeCountryBtn : select('#remove-country-1'),
        countrySelector: select('#country-select'),
        lineBtnComparison: select('#line-2'),
        barBtnCompare: select('#bar-3')

    });

    const init = () => {
        setUpMenuButtons();
        currentDataSet = TYPE.TEMPERATURE;

        let countryPopulationData = mainController.fetchData(TYPE.COUNTRY_POPULATION);

        for (let i = 1; i < countryPopulationData.getRowCount(); i++) {
            let countryName = countryPopulationData.getString(i, 0);
            let opt = document.createElement('option');
            opt.value = countryName;
            opt.innerHTML = countryName;
            DOM.countrySelector.elt.appendChild(opt);
        }




        for (let i = 1; i < countryPopulationData.getColumnCount() - 1; i+= populationGrowthLabelGap) {
            populationGrowthYearLabels.push(countryPopulationData.getString(0, i));
        }

        createChart(currentDataSet);
        createChart(TYPE.MOST_POPULATED);
        generatePopulationComparisonChart('line');
    }

    const setUpMenuButtons = () => {

     

        for (let button of DOM.topPopulationGraphBtns) {
            button.mousePressed(() => {

                let id = button.elt.id;
                switch (id) {
                    case DOM.topPopulationGraphBtns[0].elt.id:
                        mostPopulatedChartMode = 'pie';
                        break;

                    case DOM.topPopulationGraphBtns[1].elt.id:
                        mostPopulatedChartMode = 'bar';
                        break;

                    case DOM.topPopulationGraphBtns[2].elt.id:
                        mostPopulatedChartMode = 'horizontalBar';
                        break;
                    case DOM.topPopulationGraphBtns[3].elt.id:
                        mostPopulatedChartMode = 'doughnut';
                        break;
                }

                createChart(TYPE.MOST_POPULATED);

                button.style('text-decoration-line: underline');;
                for (let btn of DOM.topPopulationGraphBtns) {
                    if (btn != button) {
                        btn.style('text-decoration-line: none');
                    }
                }
            });
        }

        DOM.barBtn.mousePressed(() => {
            mode = 'bar';
            DOM.barBtn.style('text-decoration-line: underline;');
            DOM.lineBtn.style('text-decoration-line: none');
            createChart(currentDataSet);
        });

        DOM.lineBtn.mousePressed(() => {
            mode = 'line';
            DOM.lineBtn.style('text-decoration-line: underline;');
            DOM.barBtn.style('text-decoration-line: none');
            createChart(currentDataSet);
        });

        DOM.lineBtnComparison.mousePressed(() => {
            if (populationCompareChart) {
                populationCompareChart.destroy();
            }
            DOM.lineBtnComparison.style('text-decoration-line:underline;');
            DOM.barBtnCompare.style('text-decoration-line:none;');
            generatePopulationComparisonChart('line');
        });

        DOM.barBtnCompare.mousePressed(() => {
            if (populationCompareChart) {
                populationCompareChart.destroy();
            }
            DOM.barBtnCompare.style('text-decoration-line:underline;');
            DOM.lineBtnComparison.style('text-decoration-line:none;');
            generatePopulationComparisonChart('bar');
        });

        DOM.temperatureBtn.mousePressed(() => {
            currentDataSet = TYPE.TEMPERATURE;
            createChart(currentDataSet);
        });

        DOM.carbonBtn.mousePressed(() => {
            currentDataSet = TYPE.CARBON_EMISSION;
            createChart(currentDataSet);
        });

        DOM.populationBtn.mousePressed(() => {
            currentDataSet = TYPE.GLOBAL_POPULATION;
            createChart(currentDataSet);
        });

        DOM.fillCheckBox.changed(() => {
            createChart(currentDataSet);
        });

        DOM.addCountryBtn.mousePressed(() => {

            if (clickedCountries.includes(DOM.countrySelector.elt.value)) return;

            clickedCountries.push(DOM.countrySelector.elt.value);
            let r = random(255);
            let b = random(255);
            let g = random(255);
            let newDataset = {
                label: DOM.countrySelector.elt.value,
                pointRadius: 1,
                pointHoverRadius: 1,
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                hoverBackgroundColor : `rgba(${r}, ${g}, ${b}, 0.8)` ,
                borderColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                hoverBorderColor : `rgba(${r}, ${g}, ${b}, 0.5)`,
                borderWidth: 2.5,
                data: getCountryPopulationData(DOM.countrySelector.elt.value),
                fill: false
            }

            populationGrowthDataSets.push(newDataset);
            populationCompareChart.update();
        });

        DOM.removeCountryBtn.mousePressed(() =>{
            let len = populationGrowthDataSets.length - 1;
            let index = clickedCountries.indexOf(populationGrowthDataSets[len].label);
            clickedCountries.splice(index,1);
            populationGrowthDataSets.pop();
            populationCompareChart.update();
        });
    }

    function createChart(type) {
        if (chart && type != TYPE.MOST_POPULATED) {
            chart.destroy();
        }

        let xLabels = [];
        let yLabels = [];
        let table = mainController.fetchData(type);

        switch (type) {
            case TYPE.CARBON_EMISSION:

                for (let i = 0; i < table.getRowCount(); i++) {
                    xLabels.push(table.getString(i, 0));
                    yLabels.push(parseFloat(table.getString(i, 1)));
                }
                chart = generateChart(
                    'chart',
                    mode,
                    'CO2 Emission (in Gigatonnes)',
                    yLabels,
                    xLabels,
                    DOM.fillCheckBox.checked(),
                    'rgba(0, 200, 255, 0.6)',
                    'rgba(27, 200, 100,1.0)',
                    'rgba(0, 0, 0, 0)',
                    ''
                );
                break;

            case TYPE.TEMPERATURE:
                for (let i = 0; i < table.getRowCount(); i += 3) {
                    xLabels.push(table.getString(i, 0));
                    yLabels.push(parseFloat(table.getString(i, 1)));
                }
                chart = generateChart(
                    'chart',
                    mode,
                    'Global Average Temperature (in °C)',
                    yLabels,
                    xLabels,
                    DOM.fillCheckBox.checked(),
                    'rgba(0, 100, 255, 0.4)',
                    'rgba(0, 0, 255, 0.8)',
                    'rgba(0, 0, 255, 0)',
                    '°C'
                );

                break;

            case TYPE.MOST_POPULATED:
                for (let i = 0; i < table.getRowCount(); i += 1) {
                    xLabels.push(table.getString(i, 0));
                    yLabels.push(parseFloat(table.getString(i, 1)));
                }

                generateMostPopulatedChart(mostPopulatedChartMode, xLabels, yLabels);
                break;
            case TYPE.GLOBAL_POPULATION:
                for (let i = 0; i < table.getRowCount(); i += 1) {
                    xLabels.push(table.getString(i, 0));
                    yLabels.push(parseFloat(table.getString(i, 1)));
                }
                yLabels = yLabels.reverse();
                xLabels = xLabels.reverse();
                chart = generateChart(
                    'chart',
                    mode,
                    'Global Population',
                    yLabels,
                    xLabels,
                    DOM.fillCheckBox.checked(),
                    'rgba(0, 100, 255, 0.6)',
                    'rgba(27, 20, 100,1.0)',
                    'rgba(0, 0, 0, 0)',
                    ''
                );
                break;
        }
    } //close createChart function

    function generatePopulationComparisonChart(type) {
        let ctx = DOM.populationCompareChart.elt.getContext('2d');
        populationCompareChart = new Chart(ctx, {
            type: type,
            data: {
                labels: populationGrowthYearLabels,
                datasets: populationGrowthDataSets,
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItems) {
                            return 'Population Growth rate : ' + tooltipItems.yLabel + ' %';
                        }
                    }
                },
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            callback: function (value) {
                                return value + ' % ';
                            }
                        }
                    }]
                }
            }
        });
    }

    function getCountryPopulationData(countryName) {
        let data = [];
        let countryPopulationData = mainController.fetchData(TYPE.COUNTRY_POPULATION);
        for (let i = 1; i < countryPopulationData.getRowCount(); i++) {
            if (countryName == countryPopulationData.getString(i, 0)) {
                for (let j = 1; j < countryPopulationData.getColumnCount(); j+=populationGrowthLabelGap) {
                    data.push(countryPopulationData.getString(i, j));
                }
            }
        }

        return data;
    }

    function generateChart(crt, type, label, xLabels, yLabels, fill, fillColor, lineColor, pointColor, unit) {
        let ctx = document.getElementById(crt).getContext('2d');
    
        let myChart = new Chart(ctx, {
            type: type,
            data: {
                labels: yLabels,
                datasets: [{
                    label: label,
                    lineTension: 0.1,
                    fill: fill,
                    borderWidth: 5,
                    data: xLabels,
                    backgroundColor: fillColor,
                    pointBorderColor: pointColor,
                    pointStyle: 'point',
                    borderColor: lineColor,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            callback: function (value, index, values) {
                                return value + unit;
                            }
                        }
                    }]
                }
            }
        });
    
        return myChart;
    }
    
    
    
    function generateMostPopulatedChart(type, xLabels, yData) {
        let ctx = document.getElementById('population-chart-1').getContext('2d');
        let displayXGridLines = false;
        let displayYGridLines = false;
        let displayLabels = false;
        if (type == 'bar') {
            displayYGridLines = true;
            displayLabels = true;
        } else if (type == 'horizontalBar') {
            displayXGridLines = true;
            displayLabels = true;
        }
        if (mostPopulatedChart) {
            mostPopulatedChart.destroy();
        }
    
        mostPopulatedChart = new Chart(ctx, {
            // The type of chart we want to create
            type: type,
    
            // The data for our dataset
            data: {
                labels: xLabels,
                datasets: [{
                    label: '% Contribution to worlds total population',
                    backgroundColor: ['rgb(255, 0, 100)',
                        'rgb(255, 100, 100)',
                        'rgb(255, 200, 0)',
                        'rgb(255, 200, 100)',
                        'rgb(149, 244, 75)',
                        'rgb(111, 236, 107)',
                        'rgb(107, 236, 137)',
                        'rgb(107, 236, 184)',
                        'rgb(107, 236, 227)',
                        'rgb(107, 210, 236)'
                    ],
                    borderColor: 'rgb(0, 0, 0, 0.3)',
                    data: yData
                }]
            },
    
            options: {
                responsive: false,
                scales: {
                    xAxes: [{
                        barThickness: 50,
                        display: displayLabels,
                        drawBorder: false,
                        gridLines: {
                            display: displayXGridLines
                        },
                        ticks: {
                            display: displayLabels,
                            callback: function (value, index, values) {
                                if (type == 'horizontalBar') {
                                    return value + '%';
                                }
    
                                return value;
                            }
                        }
                    }],
                    yAxes: [{
                        barThickness: 30,
                        display: displayLabels,
                        drawBorder: false,
                        gridLines: {
                            display: displayYGridLines,
                        },
                        ticks: {
                            beginAtZero: false,
                            display: displayLabels,
                            callback: function (value, index, values) {
                                if (type == 'horizontalBar') {
                                    return value;
                                }
                                return value + ' %';
                            }
                        }
                    }],
                },
            }
        });
    }

        

    return {
        init
    };
}