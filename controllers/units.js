const getMetricData = function getMetricData(length,width){
    length = length/3.281;
    width = width/3.281;
    var metricDimensions = {length:length,width:width};
    return metricDimensions;
}

exports.getMetricData = getMetricData;