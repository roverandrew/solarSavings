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
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Build Process](#build-process)
- [Backers](#backers-)
- [Sponsors](#sponsors-)
- [Acknowledgments](#acknowledgments)

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

