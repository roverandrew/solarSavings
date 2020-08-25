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
- [Capacity](#Capacity)
  - [NREL Solar API](#NREL-solar-api)
  - [Converting kilowatt-hours of usage into kilowatts of solar panels](#kWh-to-kW)
- [Solar Cost](#Solar Cost)
- [Solar Roof Area](#Solar Roof Area)

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
<p>Formula: Annual kWh Electricity Consumed = ( Monthly Electricity Bill / kWh Electricity Cost ) x 12</p>

### House Dimensions

The roof area is calculated with the following assumptions.
- The roof has an eaves length (overhang) of 0.5m<br>
- The roof has 27 degrees of tilt. The correction factor is a result of this tilt.<br>
<p>Formula: roofArea = (length) x (width+eavesLength) x (correctionFactor=1.118)</p>

## Calculating Capacity

### NREL Solar API

The National Renewable Energy Laboratory's (NREL) PVWatts API is used to calculate the solar array's performance.
It takes the following inputs:
- A system capacity (kW) of that is initially set to be 1000th of a house's estimated power output (kWh). This is initially set to an unrealistically high value.
- Module type: Premium (Assumption based on the assumed quality of Tesla's solar shingles.
- Array type: Fixed (roof mounted). 
- Tilt: 27 degrees (Assumption. It is estimated to be the most common roof tilt angle, on average)
- Azimuth: The azimuth is the angle between the north vector and the sun's vector on the horizontal plane. As a result, different side's of the house have different azimuth's. Since a Tesla Solar Roof is assumed to be evenly distributed across a roof, an azimuth of 0 degrees is used. 0 degrees of azimuth is indicative of a roof that is completely flat. This is supposed to represent the differing azimuth's of each roof side cancelling eachother out. This is by far the biggest assumption.
- Array type: Fixed (roof mounted). 
- Latitude and longitude.

The return value from the API represents the estimated production kWh production of certain kW sized solar system. The value is is recursively called, continually decreasing the inputted kW capacity of the system, until the kWh output of the solar system, is less than that the actual kWh output of a user's house. This way, it can be insured that all solar energy produced is being used by the user's house.



## Solar Cost
The cost of a Tesla Solar Shingle roof is calculated according to the following formula:
Total Capacity (in kW) x $2640CAD/kW = Total Cost
https://www.ecohome.net/guides/3502/tesla-solar-roof-cost-competitors-review/#:~:text=Install%20price%3A%20SunTegra%20doesn't,Product%20warranty%3A%2010%20years.

## Solar Roof Area
The solar roof area is calculated according to the following formula:
Size of the system (in kW) ÷ Size of the solar panel (in kW) = number of panels required.
solar roof area = number of panels required x area of each panel.
Assumptions:
- The individual Tesla Solar Shingle capacity is 24Watts = 0.024kW
- The size of each shingle is 1140mm x 430mm = 1.14m x 0.43m
- Source: https://pv-magazine-usa.com/2020/02/10/whats-the-efficiency-of-a-tesla-glass-tile-solar-roof/



