const fetchExternalAPI = require("./fetchExternal");
const unitConversion = require("./units");
var express          = require("express");
const Roof           = require("./roof");
const fetch          = require('node-fetch');
const router         = express.Router();

/**
 * All prices in Canadian dollars and units in metric.
 * provincialElectricityCostPerkWh: Average residential cost of a kWh of electrical power in each canadian province/territory. Source: https://energyhub.org/wp-content/uploads/Electricity-Prices-in-Canada-2020.pdf
 * teslaRoofCostPerUnit: Cost in canadian dollars per m^2 of tesla solar shingles. //Source: https://www.tesla.com/en_CA/blog/solar-roof;
 * Tesla SolarRoof capacity in kW/m^2 source: https://www.theverge.com/2019/10/25/20932831/tesla-new-solar-glass-roof-elon-musk-version-three/
 */


///Constants///
const standardRoofCostInfo = {tile:180,asphalt:100,slate:260};
const teslaRoofCostPerUnit = 335;
const teslaRoofCapacityPerUnitArea = 0.0538105;
const module_type = 1;
const losses = 21.6; 
const array_type = 1;
const tilt = 27; 
const azimuth = 0;
const NREL_api_key = 'nANSd1IKE1BAzkWI5BwrefIJDaTXhuEJd4O89gQv';
const geoApiKey = '6a4dd82597fcfab0321c961633972c01020023e2';


var lon;
var lat;
var standardRoofCostPerUnit;
var roofArea;
var solarPortionRoofCost;
var standardPortionRoofCost;
var standardRoofCost;
var currentProvince;
var currentRegion;
var percentageSolar = 1;
var monthlyElectricityBill;
var annualHouseholdOutput;
var retryLimit;
var retryCount;


router.post("/data", function(req,res){

    //Store user input.
    var units = req.body.toggle;
    var standardRoofType = req.body.roofType;
    var houseLength = Number(req.body.houseLength);
    var houseWidth = Number(req.body.houseWidth);
    monthlyElectricityBill = Number(req.body.monthlyElectricityBill);
    
    //If imperial units provided, convert them to metric.
    if(units == "imperial"){
        var dimensions = unitConversion.getMetricData(houseLength,houseWidth);
        houseLength = dimensions.length;
        houseWidth = dimensions.width;   
    }

    standardRoofCostPerUnit = standardRoofCostInfo[standardRoofType];
    
    //Calculate the estimated roof area based on the dimensions of the home.
    roofArea = Roof.getRoofArea(houseLength,houseWidth);
    
    //Calculate the cost of the standard roof.
    standardRoofCost = roofArea*standardRoofCostPerUnit;

    //Calculate the cost of the roof with solar shingles.
    solarPortionRoofCost = percentageSolar*roofArea*teslaRoofCostPerUnit;
    standardPortionRoofCost = (1-percentageSolar)*roofArea*standardRoofCostPerUnit;

    fetchExternalAPI.fetchGeoLocation(geoApiKey)
    .then(coordinates =>{
        lon = coordinates.longitude;
        lat  = coordinates.latitude; 
        currentProvince = coordinates.currentProvince;  
        currentRegion   = coordinates.currentRegion;
        retryLimit = 11;
        retryCount = 0;
        annualHouseholdOutput = Roof.getHouseholdAnnualPowerOutput(monthlyElectricityBill,currentProvince);  
        return fetchExternalAPI.fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,teslaRoofCapacityPerUnitArea,roofArea,percentageSolar,retryLimit,retryCount);
    })
    .then(powerAndSolarPercentageData => {
        const percentageSolarArea = Math.round( (powerAndSolarPercentageData.solarPercentageData) * 100 );
        const annualPowerOutput = powerAndSolarPercentageData.powerData.outputs.ac_annual;
        const costData = Roof.getTotalRoofCostData(standardRoofCost,solarPortionRoofCost,standardPortionRoofCost,annualPowerOutput,currentProvince);
        const solarSavingsEnd = Math.round(costData.solarSavingsEnd);
        const solarSavingsHalfway = Math.round(costData.solarSavingsHalfway);
        const data = {annualhouseHoldOutput:annualHouseholdOutput,percentageSolarArea:percentageSolarArea,costData:costData,lat:lat,lon:lon,currentProvince:currentProvince,currentRegion:currentRegion,solarSavingsHalfway:solarSavingsHalfway,solarSavingsEnd:solarSavingsEnd};
        res.render("displayData",{data:data});
    })
});

module.exports = router;