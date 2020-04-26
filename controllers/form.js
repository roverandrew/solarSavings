const Roof = require("./roof");
var express                = require("express");
const fetch                = require('node-fetch');
const router               = express.Router();

/**
 * All prices in Canadian dollars and units in metric.
 * provincialElectricityCostPerkWh: Average residential cost of a kWh of electrical power in each canadian province/territory. Source: https://energyhub.org/wp-content/uploads/Electricity-Prices-in-Canada-2020.pdf
 * teslaRoofCostPerUnit: Cost in canadian dollars per m^2 of tesla solar shingles. //Source: https://www.tesla.com/en_CA/blog/solar-roof;
 * Tesla SolarRoof capacity in kW/m^2 source: https://www.theverge.com/2019/10/25/20932831/tesla-new-solar-glass-roof-elon-musk-version-three/
 */

const teslaRoofCostPerUnit = 335;
const teslaRoofCapacityPerUnitArea = 0.0538105;
var standardRoofCostPerUnit;
var roofArea;
var solarPortionRoofCost;
var standardPortionRoofCost;
var standardRoofCost;
var currentProvince;
var percentageSolar;


router.post("/data", function(req,res){

    //Storing user input.
    standardRoofCostPerUnit = Number(req.body.standardRoofCostPerUnit);
    var houseLength = Number(req.body.houseLength);
    var houseWidth = Number(req.body.houseWidth);
    percentageSolar = (Number(req.body.percentageSolar))/100;
    
    //Calculate the estimated roof area based on the dimensions of the home.
    roofArea = Roof.getRoofArea(houseLength,houseWidth);
    standardRoofCost = roofArea*standardRoofCostPerUnit;

    //Calculate the cost of the roof.
    solarPortionRoofCost = percentageSolar*roofArea*teslaRoofCostPerUnit;
    standardPortionRoofCost = (1-percentageSolar)*roofArea*standardRoofCostPerUnit;

    fetch('https://api.getgeoapi.com/api/v2/ip/check?api_key=6a4dd82597fcfab0321c961633972c01020023e2')
    .then(res => res.json())
    .then(json => {
        currentProvince = json.area.code;
        const latitude = json.location.latitude
        const longitude = json.location.longitude
        const coordinates = [longitude,latitude];
        return coordinates;
    })
    .then(coordinates =>{
        const lon = coordinates[0];
        const lat  = coordinates[1];
        const system_capacity = teslaRoofCapacityPerUnitArea*roofArea*percentageSolar; 
        const module_type = 1;
        const losses = 21.6; //Can make this depend on weather
        const array_type = 1;
        const tilt = 27; //Assumed value
        const azimuth = 0;
        const NREL_api_key = 'nANSd1IKE1BAzkWI5BwrefIJDaTXhuEJd4O89gQv';
        return fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NREL_api_key}&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&azimuth=${azimuth}&tilt=${tilt}&array_type=${array_type}&module_type=${module_type}&losses=${losses}`);
    })
    .then(res => res.json())
    .then(powerData => {
        const annualPowerOutput = powerData.outputs.ac_annual;
        const costData = Roof.getTotalRoofCostData(standardRoofCost,solarPortionRoofCost,standardPortionRoofCost,annualPowerOutput,currentProvince);
        console.log("Cost Data:")
        console.log(costData);
        res.render("displayData",{data:costData});
    })

});

module.exports = router;