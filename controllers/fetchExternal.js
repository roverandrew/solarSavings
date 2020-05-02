const fetch          = require('node-fetch');

async function fetchGeoLocation(geoApiKey){
    let response = await fetch(`https://api.getgeoapi.com/api/v2/ip/check?api_key=${geoApiKey}`);
    let json = await response.json(); 
    const currentProvince = json.area.code;
    const currentRegion   = json.city.name;
    const latitude = json.location.latitude
    const longitude = json.location.longitude
    const data = {longitude:longitude,latitude:latitude,currentProvince:currentProvince,currentRegion,currentRegion};
    return data;
}

//Change this to using async await so a promise can be returned.
function fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,
                        teslaRoofCapacityPerUnitArea,roofArea,percentageSolar,retryLimit,retryCount) {

    const system_capacity = teslaRoofCapacityPerUnitArea*roofArea*percentageSolar; 
    return fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NREL_api_key}&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&azimuth=${azimuth}&tilt=${tilt}&array_type=${array_type}&module_type=${module_type}&losses=${losses}`)
    .then(res => res.json())
    .then(powerData =>{   
        //If the outputted power by the solar shingles is greater than what the house outputs, make the solar area smaller and fetch again.
        //Else return the response.
        if ( (powerData.outputs.ac_annual) >annualHouseholdOutput) {                 
                
            if(percentageSolar<0.10 || retryCount == 10){
                var powerAndSolarPercentageData = {powerData:powerData,solarPercentageData:percentageSolar}
                return powerAndSolarPercentageData;
            }

            return fetchWithRetry(annualHouseholdOutput,lon,lat,module_type,losses,array_type,tilt,azimuth,NREL_api_key,
                                        teslaRoofCapacityPerUnitArea,roofArea,percentageSolar-0.10,
                                        retryLimit, retryCount+1);
        }
        
        var powerAndSolarPercentageData = {powerData:powerData,solarPercentageData:percentageSolar}
        return powerAndSolarPercentageData;       
    })   
}

exports.fetchWithRetry = fetchWithRetry;
exports.fetchGeoLocation = fetchGeoLocation;
