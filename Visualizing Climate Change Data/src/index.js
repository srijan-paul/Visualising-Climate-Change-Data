let Data = {};
let Controllers;

function preload() {
	const mainController = MainController();
	const uiController = UIController(mainController);
	const dataController = DataController(mainController);
	
	dataController.init();


	
	Controllers = Object.freeze({
    main: mainController,
		view: uiController,
		data : dataController
    });
}

function setup() {
	Controllers.main.init(Controllers.view, Controllers.data);
	Controllers.view.init();	
}

