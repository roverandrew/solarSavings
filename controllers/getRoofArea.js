
const getRoofArea = function getRoofArea(length, width){
    
    var eavesLength = 0.5; //Assumed roof overhang in meters.
    var correctionFactor = 1.118; //From an assumed 27 degree tilt. //Typical roof tilt varies between 18.43 degrees of tilt and 36.87 degrees of tilt.
    //Determine the longer side for when adding the additional area due to roof overhand(eaves).
    if(width>length){
        var lengthCopy = length;
        length = width;
        width = lengthCopy;
    }
    var roofArea = (length)(width+eavesLength)(correctionFactor);
    return roofArea;
}

exports.getRoofArea = getRoofArea;