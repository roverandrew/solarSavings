var length = document.getElementsByName('houseLength')[0];
        var width = document.getElementsByName('houseWidth')[0];
        var unitsToggle = document.getElementById('toggle');
        unitsToggle.addEventListener("change", function(){
            if(length.placeholder == 'units: feet'){
                length.placeholder = 'units: meters';
                width.placeholder = 'units: meters';
            }
            else{
                length.placeholder = 'units: feet';
                width.placeholder = 'units: feet';
            }
        });