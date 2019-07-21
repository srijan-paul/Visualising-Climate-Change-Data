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
 
       
    return {
        init,
        fetchData,
    };


}
