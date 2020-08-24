<a href="google.com">
  <h1 align="center">
    Solar Savings
  </h1>
</a>
<br>

<p align="center">
  Calculate the cost-feasibility of solar panels roofs in Canada.
</p>

## Introduction
<p>For mass-adoption of renewable energy sources to occur, they must be economically competitive with non-renewable alternatives. SolarSavings therefore looks to answer the question "Are solar roofs worth it?". Using the inputted data above and geolocation specific data on solar irradiance, cost of electricity and more, SolarSavings calculates and visualizes the economic viability of Tesla's yet-to-be-released solar shingle roof.</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## How it Works

- [Inputs](#inputs)
  - [Roof Type](#roof-type)
  - [Monthly Electricity Bill](#monthly-electricity-bill)
  - [House Dimensions](#house-dimensions)
- [Calculating Capacity](#Calculating Capacity)
  - [NREL Solar API](#NREL-solar-api)
  - [Converting kilowatt-hours of usage into kilowatts of solar panels](#kWh-to-kW)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Inputs

### Roof Type

These are the different types of "normal" roofs, that the solar panel roof will be compared to.
- The "slate" roof choice represents a roof that costs $242CAD/m^2.<br>
- The "tile" roof choice represents a roof that costs $169CAD/m^2.<br>
- The "asphalt" roof choice represents a roof that costs $93CAD/m^2.<br>
    
    Average roofing costs were derived from data available on Home Advisor and Homewyse. In each case, there is a wide range of roofing costs, for each roof type     it's respective midpoint cost is used. Ranges for roof tile types from Home Advisor were derived using information from roofing contractors that included all     equivalent components of a Solar Roof (such as installation labor, materials, existing roof tear-off, and underlayment).
    
### Monthly Electricity Bill

<p>Used in combination with the kWh cost of electricity in the user's respective province to calculate the annual kWh energy output of a household.</p>
<p>Formula: kWh Electricity Consumed = ( Monthly Electricity Bill / kWh Electricity Cost ) x 12</p>

### House Dimensions

The roof area is calculated with the following assumptions.
- The roof has an eaves length (overhang) of 0.5m<br>
- The roof has 27 degrees of tilt. The correction factor is a result of this tilt.<br>
<p>Formula: roofArea = (length) x (width+eavesLength) x (correctionFactor=1.118)</p>

## Calculating Capacity

### NREL Solar API

The National Renewable Energy Laboratory's (NREL) PVWatts API is used to calculate the solar array's performance.
It takes the following inputs:
- A system size of 1, setting up the calculation based on production per 1000 watts of solar panels.
- Module type: Premium (Assumption based on the assumed quality of Tesla's solar shingles.
- Array type: Fixed (roof mounted). 
- Tilt: 27 degrees (Assumption. It is estimated to be the most common roof tilt angle, on average)
- Azimuth: The azimuth is the angle between the north vector and the sun's vector on the horizontal plane. As a result, different side's of the house have different azimuth's. Since a Tesla Solar Roof is assumed to be evenly distributed across a roof, an azimuth of 0 degrees is used. 0 degrees of azimuth is indicative of a roof that is completely flat. This is supposed to represent the differing azimuth's of each roof side cancelling eachother out. This is by far the biggest assumption.
- Array type: Fixed (roof mounted). 
- Latitude and longitude.

The return value from the API represents the estimated production of 1000 watts of solar panels at the inputted latitude and longitude.

### Converting kilowatt-hours of usage into kilowatts of solar panels
The estimated kWh output for a given user is divided by the PVWatts production estimate for 1kW of solar panels in a user's area. The result is the kW capacity required for the user's home.
