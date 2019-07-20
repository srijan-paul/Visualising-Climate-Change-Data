const TYPE = {
    MOST_POPULATED: 0,
    COUNTRY_POPULATION: 1,
    GLOBAL_POPULATION: 2,
    TEMPERATURE: 3,
    CARBON_EMISSION: 4
}

const DataController = (mainController) => {

    const DataFiles = {
        averageTemperature: '/Data/Global Average temperature.csv',
        carbonEmission: '/Data/Global Carbon Dioxide emissions.csv',
        globalPopulation: '/Data/Global Population.csv',
        countryPopulation: '/Data/Population Data by Country.csv',
        mostPopulatedCountries: '/Data/top-10-populated.csv'
    }

    let Data = {};



    const loadData = () => {
        Data = Object.freeze({
            Population: {
                mostPopulated: loadTable(DataFiles.mostPopulatedCountries, 'csv', 'header'),
                country: loadTable(DataFiles.countryPopulation, 'csv'),
                global: loadTable(DataFiles.globalPopulation, 'csv', 'header')
            },
            Climate: {
                carbonEmission: loadTable(DataFiles.carbonEmission, 'csv', 'header'),
                temperature: loadTable(DataFiles.averageTemperature, 'csv', 'header'),
            },
        });
    }

    const init = () => {
        loadData();
    }

    const getData = function (data) {
        switch (data) {
            case TYPE.COUNTRY_POPULATION:
                return Data.Population.country;
            case TYPE.CARBON_EMISSION:
                return Data.Climate.carbonEmission;
            case TYPE.TEMPERATURE:
                return Data.Climate.temperature;
            case TYPE.GLOBAL_POPULATION:
                return Data.Population.global;
            case TYPE.MOST_POPULATED:
                return Data.Population.mostPopulated;
        }
    }

    return {
        init,
        getData
    }

}