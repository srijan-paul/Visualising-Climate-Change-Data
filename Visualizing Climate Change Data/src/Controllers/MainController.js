const MainController = () => {
    let ViewController = null;
    let DataController = null;

    const init = (_ViewController, _DataController) => {
        ViewController = _ViewController;
        DataController = _DataController;
    }

    return {
        init
    };
}