const MainController = () => {
    let ViewController = null;
    let DataController = null;

    const init = (_ViewController, _DataController) => {
        ViewController = _ViewController;
        DataController = _DataController;
    }

    const populationGrowthData = () => {
        DataController.getPopulationData();
    }

    const fetchData = (type) => {
        return DataController.getData(type);
    }

    // const createChart = (data) => {
    //     switch (data) {
    //         case TYPE.COUNTRY_POPULATION:
    //             return Data.Population.Country;
    //         case TYPE.CARBON_EMISSION:
    //             return Data.Climate.carbonEmission;
    //         case TYPE.TEMPERATURE:
    //             return Data.Climate.temperature;
    //         case TYPE.GLOBAL_POPULATION:
    //             return Data.Population.global;
    //         case TYPE.MOST_POPULATED:
    //             return Data.Population.mostPopulated;
    //     }
    // }
   
   
    
    return {
        init,
        fetchData,
    };


}