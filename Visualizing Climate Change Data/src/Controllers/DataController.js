const DataFiles = {
    averageTemperature : '/Data/Global Average temperature.csv',
    carbonEmission : '/Data/Global Carbon Dioxide emissions.csv',
    globalPopulation : '/Data/Global Population.csv',
    countryPopulation : '/Data/Population Data by Country.csv',
    mostPopulatedCountries : '/Data/top-10-populated.csv'
}

let Data = {}

function preload() {
	Data.temperatureData = loadTable(DataFiles.averageTemperature,'csv','header'),
    Data.carbonData = loadTable(DataFiles.carbonEmission, 'csv', 'header'),
    Data.populationGrowthData = loadTable(DataFiles.globalPopulation, 'csv', 'header'),
    Data.mostPopulatedData = loadTable(DataFiles.mostPopulatedCountries, 'csv' , 'header'),
	Data.countryPopulationData = loadTable(DataFiles.countryPopulation, 'csv'),
	Data.globalPopulationData = loadTable(DataFiles.globalPopulation, 'csv', 'header');
}

