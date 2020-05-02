const provincialElectricityCostPerkWh = {"AB":0.167,"BC":0.124,"MB":0.096,"NB":0.127,"NL":0.138,"NS":0.150,"NT":0.387,"NU":0.375,"ON":0.125,"PE":0.168,"QC":0.073,"SK":0.182};

const getTotalRoofCostData = function getTotalRoofCostData(standardRoofCost, solarPortionRoofCost, standardPortionRoofCost, annualPowerOutput,currentProvince){ 

    var teslaRoofAnnualSavings = annualPowerOutput*(provincialElectricityCostPerkWh[currentProvince]);
    var totalCombinedRoofCost = solarPortionRoofCost + standardPortionRoofCost;
    
    var teslaRoofTotalCost = new Array(51);
    teslaRoofTotalCost[0] = totalCombinedRoofCost;
    for(var i=1;i<teslaRoofTotalCost.length;i++){
        totalCombinedRoofCost = totalCombinedRoofCost - teslaRoofAnnualSavings;
        teslaRoofTotalCost[i] = totalCombinedRoofCost;
    }
 
    //Generate cost data for the standard roof (constant).
    var standardRoofTotalCost = new Array(51);
    
    for(var i=0;i<standardRoofTotalCost.length;i++){
        standardRoofTotalCost[i] = standardRoofCost;
    }

    //Generate labels for the graph (x-axis units) at 2 year increments.
    var labels = new Array((51));
    for(var i = 0;i<labels.length;i++){
        labels[i] = i;
    }

    var solarSavingsEnd = standardRoofTotalCost[standardRoofTotalCost.length-1] - teslaRoofTotalCost[teslaRoofTotalCost.length-1];
    var solarSavingsHalfway = standardRoofTotalCost[(standardRoofTotalCost.length-1)/2] - teslaRoofTotalCost[(teslaRoofTotalCost.length-1)/2];
    var data = {standard:standardRoofTotalCost,tesla:teslaRoofTotalCost,labels:labels,solarSavingsEnd:solarSavingsEnd,solarSavingsHalfway:solarSavingsHalfway};
    return data; //All data points are for the start of the year
}

const getRoofArea = function getRoofArea(length, width){
    
    var eavesLength = 0.5; //Assumed roof overhang in meters.
    var correctionFactor = 1.118; //From an assumed 27 degree tilt. //Typical roof tilt varies between 18.43 degrees of tilt and 36.87 degrees of tilt.
    //Determine the longer side for when adding the additional area due to roof overhand(eaves).
    if(width>length){
        var lengthCopy = length;
        length = width;
        width = lengthCopy;
    }
    var roofArea = (length)*(width+eavesLength)*(correctionFactor);
    return roofArea;
}

const getHouseholdAnnualPowerOutput = function getHouseholdAnnualPowerOutput(monthlyElectricityBill,currentProvince){
    console.log(provincialElectricityCostPerkWh[currentProvince]);
    var annualOutput = ( monthlyElectricityBill/(provincialElectricityCostPerkWh[currentProvince]) )*12;
    return annualOutput;
}

exports.getRoofArea = getRoofArea;
exports.getTotalRoofCostData = getTotalRoofCostData;
exports.getHouseholdAnnualPowerOutput = getHouseholdAnnualPowerOutput;


