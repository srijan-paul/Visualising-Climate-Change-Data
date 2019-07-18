let currentDataSet;
let populationGrowthDataSets = [];

let selectors;
let graph;
let topPopulationGraphButtons = [];
let populationButtonIds = [];

let globalTempButton;
let globalCarbonButton;
let globalPopulationButton;
let countryPopulationButton;
let fillCheckBox;
let lineButton;
let barButton;

let mostPopulatedChartMode = 'doughnut';
let mode = 'line';
let populationGrowthYearLabels = [];

let countryDataSets = [];




function setup() {

	const mainController = MainController();
    const uiController = UIController();
	
	mainController.init(uiController);
	uiController.init();

	const Controllers = Object.freeze({
        main: mainController,
        view: uiController,
        // data: dataController
    });

	selectors = document.getElementsByClassName('country-select');
	graphButtons = document.getElementsByClassName('graph');
	globalCarbonButton = select('#Global Co-2');
	globalTempButton = select('#Global Temperature');
	fillCheckBox = select('#fillBox');
	lineButton = select('#line');
	barButton = select('#bar');
	addCountryButton = select('#add-country-1');

	populationButtonIds = ['#pie', '#bar-2', '#hBar', '#doughnut'];

	for (let id of populationButtonIds) {
		topPopulationGraphButtons.push(select(id));
	}
	
	let countrySelect = document.getElementById('country-select');
	
	//styling the pre-selected buttons.
	lineButton.style('text-decoration-line: underline;');
	select('#doughnut').style('text-decoration-line: underline;');
	select('#line-2').style('text-decoration-line: underline;');

	for (let i = 1; i < Data.countryPopulationData.getRowCount(); i++) {
		let countryName = Data.countryPopulationData.getString(i, 0);
		let opt = document.createElement('option');
		opt.value = countryName;
		opt.innerHTML = countryName;
		countrySelect.appendChild(opt);
	}



	for (let i = 1; i < Data.countryPopulationData.getColumnCount() - 1; i++) {
		populationGrowthYearLabels.push(Data.countryPopulationData.getString(0, i));
		
	}
	
	currentDataSet = Data.temperatureData;
	createChartFromTable(currentDataSet);
	
	for (let button of Controllers.view.DOM.topPopulationGraphBtns) {
		button.mousePressed(() => {
			let id = button.elt.id;
			switch ('#' + id) {
				case populationButtonIds[0]:
					mostPopulatedChartMode = 'pie';
					break;

				case populationButtonIds[1]:
					mostPopulatedChartMode = 'bar';
					break;

				case populationButtonIds[2]:
					mostPopulatedChartMode = 'horizontalBar';
					break;
				case populationButtonIds[3]:
					mostPopulatedChartMode = 'doughnut';
					break;
			}

			createChartFromTable(Data.mostPopulatedData);

			button.style('text-decoration-line: underline');;
			
			for (let btn of Controllers.view.DOM.topPopulationGraphBtns) {
				if (btn != button) {
					btn.style('text-decoration-line: none');
				}
			}
		});
	}


	globalTempButton.mousePressed(() => {
		currentDataSet = Data.temperatureData;
		createChartFromTable(currentDataSet);
	});

	globalCarbonButton.mousePressed(() => {
		currentDataSet =  Data.carbonData;
		createChartFromTable(currentDataSet);
	});

	select('#Global Population').mousePressed(() => {
		currentDataSet = Data.globalPopulationData;
		createChartFromTable(currentDataSet);
	});

	fillCheckBox.changed(() => {
		createChartFromTable(currentDataSet);
	});

	lineButton.mousePressed(() => {
		mode = 'line';
		lineButton.style('text-decoration-line: underline;');
		barButton.style('text-decoration-line: none');
		createChartFromTable(currentDataSet);
	});

	barButton.mousePressed(() => {
		mode = 'bar';
		barButton.style('text-decoration-line: underline;');
		lineButton.style('text-decoration-line: none');
		createChartFromTable(currentDataSet);
	});

	createChartFromTable(Data.mostPopulatedData);

	generatePopulationComparisonChart('line');



	select('#line-2').mousePressed(() => {
		if (populationCompareChart) {
			populationCompareChart.destroy();
		}
		select('#line-2').style('text-decoration-line:underline;');
		select('#bar-3').style('text-decoration-line:none;');
		generatePopulationComparisonChart('line');
	});

	select('#bar-3').mousePressed(() => {
		if (populationCompareChart) {
			populationCompareChart.destroy();
		}
		select('#bar-3').style('text-decoration-line:underline;');
		select('#line-2').style('text-decoration-line:none;');
		generatePopulationComparisonChart('bar');
	});
}

