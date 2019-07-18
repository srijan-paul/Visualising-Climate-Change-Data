let chart;
let mostPopulatedChart;
let populationCompareChart;

const ChartController = UIController =>  {

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

function createChartFromTable(table) {
	if (chart && table != Data.mostPopulatedData) {
		chart.destroy();
	}

	let xLabels = [];
	let yLabels = [];

	switch (table) {
		case Data.carbonData:
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
				fillCheckBox.checked(),
				'rgba(0, 200, 255, 0.6)',
				'rgba(27, 200, 100,1.0)',
				'rgba(0, 0, 0, 0)',
				''
			);
			break;

		case Data.temperatureData:
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
				fillCheckBox.checked(),
				'rgba(0, 100, 255, 0.4)',
				'rgba(0, 0, 255, 0.8)',
				'rgba(0, 0, 255, 0)',
				'°C'
			);

			break;

		case Data.mostPopulatedData:
			for (let i = 0; i < table.getRowCount(); i += 1) {
				xLabels.push(table.getString(i, 0));
				yLabels.push(parseFloat(table.getString(i, 1)));
			}

			generateMostPopulatedChart(mostPopulatedChartMode, xLabels, yLabels);
			break;
		case Data.globalPopulationData:
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
				fillCheckBox.checked(),
				'rgba(0, 100, 255, 0.6)',
				'rgba(27, 20, 100,1.0)',
				'rgba(0, 0, 0, 0)',
				''
			);
			break;
	}
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
				borderColor: 'rgb(0, 0, 0, 0)',
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

function generatePopulationComparisonChart(type) {
	let ctx = document.getElementById('population-chart-2').getContext('2d');
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

function addData(chart, label, data) {
	chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) => {
		dataset.data.push(data);
	});
	chart.update();
}

function getCountryPopulationData(countryName) {
	let data = [];

	for (let i = 1; i < Data.countryPopulationData.getRowCount(); i++) {
		if (countryName ==  Data.countryPopulationData.getString(i, 0)) {
			for (let j = 1; j <  Data.countryPopulationData.getColumnCount(); j++) {
				data.push( Data.countryPopulationData.getString(i, j));
			}
		}
	}

	return data;
}