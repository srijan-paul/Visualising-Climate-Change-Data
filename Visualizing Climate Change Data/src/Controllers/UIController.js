const UIController = () => {

    let clickedCountries = [];


    const DOM = Object.freeze({

        mainChart: select('#chart'),
        graphSelector: select('#graph-selector'),
        graphSelectionButtons: select('#btn-fixed'),
        countrySelector: select('#country-select'),
        mostPopulatedChart: select('#population-chart-1'),
        populationCompareChart: select('population-chart-2'),
        graphBtns: document.getElementsByClassName('graph'),
        carbonBtn: select('#Global Co-2'),
        temperatureBtn: select('#Global Temperature'),
        fillCheckBox: select('#fillBox'),
        lineBtn: select('#line'),
        barBtn: select('#bar'),
        addCountryBtn: select('#add-country-1'),

        topPopulationGraphBtns: [
            select('#pie'),
            select('#bar-2'),
            select('#hBar'),
            select('#doughnut')
        ]
    });

    const init = () => {
        setUpMenuButtons();
    }

    const setUpMenuButtons = () => {

        DOM.addCountryBtn.mousePressed(() => {

            if (!clickedCountries.includes(DOM.countrySelector.elt.value)) {
                clickedCountries.push(DOM.countrySelector.elt.value);
                let r = random(255);
                let b = random(255);
                let g = random(255);
                let newDataset = {
                    label: DOM.countrySelector.elt.value,
                    pointRadius: 1,
                    pointHoverRadius: 1,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                    borderColor: `rgba(${r}, ${g}, ${b}, 0.5)`,
                    borderWidth: 2.5,
                    data: getCountryPopulationData(DOM.countrySelector.elt.value),
                    fill: false
                }

                populationGrowthDataSets.push(newDataset);
                populationCompareChart.update();
            }

        });

    }



    return {
        DOM,
        init
    };
}