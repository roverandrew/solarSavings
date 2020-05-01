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


//Constants
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


var standardRoofCostPerUnit;
var roofArea;
var solarPortionRoofCost;
var standardPortionRoofCost;
var standardRoofCost;
var currentProvince;
var percentageSolar = 1;
var monthlyElectricityBill;
var annualHouseholdOutput;


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

    fetchGeoLocation(geoApiKey)
    .then(json => {
        currentProvince = json.area.code;
        const latitude = json.location.latitude
        const longitude = json.location.longitude
        const coordinates = {longitude:longitude,latitude:latitude};
        return coordinates;
    })
    .then(async coordinates =>{
        const lon = coordinates.longitude;
        const lat  = coordinates.latitude;   
        const retryLimit = 11;
        const retryCount = 0;
        annualHouseholdOutput = Roof.getHouseholdAnnualPowerOutput(monthlyElectricityBill,currentProvince);
        console.log("Annual household output is" + annualHouseholdOutput);
        return await fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,teslaRoofCapacityPerUnitArea,roofArea,percentageSolar,retryLimit,retryCount);
    })
    .then(powerAndSolarPercentageData => {
        console.log(powerAndSolarPercentageData);
        const annualPowerOutput = powerAndSolarPercentageData.powerData.outputs.ac_annual;
        const percentageSolar = powerAndSolarPercentageData.solarPercentageData;
        console.log("SOLAR PERCENTAGE OUTSIDE" + percentageSolar);
        const costData = Roof.getTotalRoofCostData(standardRoofCost,solarPortionRoofCost,standardPortionRoofCost,annualPowerOutput,currentProvince);
        res.render("displayData",{data:costData});
    })
});

    async function fetchGeoLocation(geoApiKey){
        let response = await fetch(`https://api.getgeoapi.com/api/v2/ip/check?api_key=${geoApiKey}`);
        return await response.json();
    }

    //Change this to using async await so a promise can be returned.
    async function fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,
                            teslaRoofCapacityPerUnitArea,roofArea,percentageSolar,retryLimit,retryCount) {

        const system_capacity = teslaRoofCapacityPerUnitArea*roofArea*percentageSolar; 
        retryLimit = retryLimit || Number.MAX_VALUE; //Max amount of times the fetch request can be re-made.

        let response = await fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NREL_api_key}&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&azimuth=${azimuth}&tilt=${tilt}&array_type=${array_type}&module_type=${module_type}&losses=${losses}`);
        let powerData = await response.json();
            
        //If the outputted power by the solar shingles is greater than what the house outputs, make the solar area smaller and fetch again.
        //Else return the response.
        if (powerData.outputs.ac_annual>annualHouseholdOutput) {                 
            
            if(retryCount == retryLimit){
                console.log("Max number of re-tries hit, good bye");
                process.exit(1);
            }

            console.log("Solar power output is greater than household power output, making solar area smaller and fetching again.");
            console.log("Here is the new solar percentage" + percentageSolar);
            fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,
                                      teslaRoofCapacityPerUnitArea,roofArea,percentageSolar-0.10,
                                      retryLimit, retryCount+1);
        }
        else{
            var powerAndSolarPercentageData = {powerData:powerData,solarPercentageData:percentageSolar}
            return powerAndSolarPercentageData;   
        }
        
          
        
    }

module.exports = router;