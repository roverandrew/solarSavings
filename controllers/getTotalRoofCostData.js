const getTotalRoofCostData = function getTotalRoofCostData(standardRoofCost, teslaRoofInitialCost, annualPowerOutput, provincialElectricityCostPerkWh, currentProvince){ 
    var teslaRoofAnnualSavings = annualPowerOutput * provincialElectricityCostPerkWh.currentProvince;

    var teslaRoofTotalCost = new Array(25);
    teslaRoofTotalCost.forEach(year =>{
        teslaRoofCost = teslaRoofCost - teslaRoofAnnualSavings;
        year = teslaRoofCost;
    });

    var standardRoofTotalCost = new Array(25);
    standardRoofTotalCost.forEach(year =>{
        year = standardRoofCost;
    });

    var data = {standard:standardRoofTotalCost,tesla:teslaRoofTotalCost};
    return data;
};

exports.getTotalRoofCostData = getTotalRoofCostData;


