let chart;
let mostPopulatedChart;
let populationCompareChart;

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



function addData(chart, label, data) {
	chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) => {
		dataset.data.push(data);
	});
	chart.update();
}


