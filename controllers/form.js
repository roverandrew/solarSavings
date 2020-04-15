const Roof = require("./roof");
var express                = require("express");
const fetch                = require('node-fetch');
const router               = express.Router();

/**
 * All prices in Canadian dollars and units in metric.
 * provincialElectricityCostPerkWh: Average residential cost of a kWh of electrical power in each canadian province/territory. Source: https://energyhub.org/wp-content/uploads/Electricity-Prices-in-Canada-2020.pdf
 * teslaRoofCostPerUnit: Cost in canadian dollars per m^2 of tesla solar shingles. //Source: https://www.tesla.com/en_CA/blog/solar-roof;
 */

const provincialElectricityCostPerkWh = {"AB":0.167,"BC":0.124,"MB":0.096,"NB":0.127,"NL":0.138,"NS":0.150,"NT":0.387,"NU":0.375,"ON":0.125,"PE":0.168,"QC":0.073,"SK":0.182};
const teslaRoofCostPerUnit = 335;
var standardRoofCostPerUnit;
var roofArea;
var teslaRoofInitialCost = roofArea*teslaRoofCostPerUnit;
var standardRoofCost = roofArea*standardRoofCostPerUnit;
var currentProvince;


router.post("/data", function(req,res){

    standardRoofCostPerUnit = Number(req.body.standardRoofCostPerUnit);
    var houseLength = Number(req.body.houseLength);
    var houseWidth = Number(req.body.houseWidth);
   
    roofArea = Roof.getRoofArea(houseLength,houseWidth);
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
        const system_capacity = 0.005*roofArea;
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
        console.log(annualPowerOutput);
        var costData = getTotalRoofCostData(standardRoofCost,teslaRoofInitialCost,annualPowerOutput, provincialElectricityCostPerkWh, currentProvince);
        res.send(costData);
        console.log(costData);
        res.render("data",{data:costData});
    })

});

module.exports = router;