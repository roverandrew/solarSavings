const express     = require("express");
const fetch       = require('node-fetch');
const app         = express();
const router      = express.Router();

const provincialElectricityCostPerkWh = {"Alberta":0.167,"BritishColumbia":0.124,"Manitoba":0.096,"NewBrunswick":0.127,"Newfoundland":0.138,"NovaScotia":0.150,"NWTerritories":0.387,"Nunavut":0.375,"Ontario":0.125,"PEI":0.168,"Quebec":0.073,"Saskatchewan":0.182};
//Source: https://energyhub.org/wp-content/uploads/Electricity-Prices-in-Canada-2020.pdf

//All prices in canadian
const roofSizeSquareMeter = 157.9;
const teslaRoofCostPerSquareMeter = 335;
const teslaRoofInitialCost = roofSizeSquareMeter*teslaRoofCostPerSquareMeter;
const standardRoofCostPerSquareMeter = 10;
const standardRoofInitialCost = roofSizeSquareMeter*standardRoofCostPerSquareMeter;
var teslaRoofAnnualSavings;

var currentProvince;

router.get("/data", function(req,res){

    fetch('https://api.getgeoapi.com/api/v2/ip/check?api_key=6a4dd82597fcfab0321c961633972c01020023e2')
    .then(res => res.json())
    .then(json => {
        currentProvince = json.area.name;
        const latitude = json.location.latitude
        const longitude = json.location.longitude
        const coordinates = [longitude,latitude];
        return coordinates;
    })
    .then(coordinates =>{
        const lon = coordinates[0];
        const lat  = coordinates[1];
        const totalArea = 2000;
        const system_capacity = 0.005*totalArea;
        const module_type = 1;
        const losses = 80.6;
        const array_type = 1;
        const tilt = 35;
        const azimuth = 0;
        const NREL_api_key = 'nANSd1IKE1BAzkWI5BwrefIJDaTXhuEJd4O89gQv';
        return fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NREL_api_key}&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&azimuth=${azimuth}&tilt=${tilt}&array_type=${array_type}&module_type=${module_type}&losses=${losses}`);
    })
    .then(res => res.json())
    .then(powerData => {
        const power = powerData.outputs.ac_annual.toString();
        console.log(power);
        teslaRoofAnnualSavings = powerData.outputs.ac_annual * provincialElectricityCostPerkWh.currentProvince;
    })

});

module.exports = router;