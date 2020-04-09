const express     = require("express");
const fetch = require('node-fetch');
const app         = express();
const router      = express.Router();

router.get("/data", function(req,res){

    fetch('https://api.getgeoapi.com/api/v2/ip/check?api_key=6a4dd82597fcfab0321c961633972c01020023e2')
    .then(res => res.json())
    .then(json => {
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
        // return fetch("https://developer.nrel.gov/api/pvwatts/v6.json?api_key=nANSd1IKE1BAzkWI5BwrefIJDaTXhuEJd4O89gQv&lat=40.5555&lon=-105&system_capacity=4&azimuth=180&tilt=40&array_type=1&module_type=1&losses=10");
        return fetch(`https://developer.nrel.gov/api/pvwatts/v6.json?api_key=${NREL_api_key}&lat=${lat}&lon=${lon}&system_capacity=${system_capacity}&azimuth=${azimuth}&tilt=${tilt}&array_type=${array_type}&module_type=${module_type}&losses=${losses}`);
    })
    .then(res => res.json())
    .then(powerData => {
        const power = powerData.outputs.ac_annual.toString();
        const fetchkWh = await fetch
    })

});

module.exports = router;