# Housing Affordability Smart Dashboard

## Project URL 
https://naamaal12.github.io/Housing-Affordability-in-Seattle-Dashboard-Final-Project/

---

## Team Members  
- Kathleen Tran
- Naama Al-Musawi
- Khatanbaatar Bayaraa
- Malika Ali
- Girum Wanoro

---

## Project Description  

The Seattle Housing Affordability Dashboard is an interactive smart dashboard that explores rent burden, household income, and Mandatory Housing Affordability (MHA) zoning in Seattle from **2006-2022**.
This project combines a Mapbox choropleth map with C3.js charts to give users an understanding of the data across several different dimensions. The different dimensions of the data can be explored with 
various interactive tools for the user to filter the data, such as by year, demographic group, and by hovering over the map items.


---

## Project Goal  

The goal of this project is to:

- Identify spatial concentrations of renter cost burden in Seattle.
- Compare rent burden with median household income.
- Explore renter income distribution across neighborhoods.
- Provide spatial context through mapping of MHA zoning tiers.
- Allow interactive exploration through linked maps and charts.

---

## Target Audience  

- Seattle residents and renters  
- Housing advocates  
- Urban planners and policymakers  
- Students and researchers interested in housing affordability and urban inequality  

---

## Features
 
| Feature | Description |
|---|---|
| **MHA Zone Map** | Choropleth map displaying MHA zoning tiers (M, M1, M2) across Seattle census tracts |
| **Rent Burden Rate** | Live stat showing the % of households spending >50% of income on rent for the selected year and group |
| **Year Slider** | Scrub through 2006-2022 to see how housing affordability changed over time |
| **Demographic Filter** | Filter by race/ethnicity: All, White, Black, Hispanic, Asian, Native |
| **Rent Burden Trend Chart** | Line chart tracking rent burden % over time with a 2019 MHA policy marker |
| **Burden by Group Chart** | Bar chart comparing rent burden across demographic groups for the selected year |
| **Renter Income Chart** | Bar chart showing renter household count by income bracket ($0-30K, $30-50K, $50-80K, $80-120K, $120K+) |
| **Hover Popups** | Hover over any zone to see the zoning code, category, and MHA tier |
| **Layer Toggle** | Switch between MHA zone layer and base map only |

---

## Visual Components 
 
### 1. Choropleth Map
An interactive Mapbox dark-mode map centered on Seattle, displaying MHA zoning tiers color-coded by contribution level:
- **Teal (M)** - Standard contribution
- **Orange (M1)** - Higher contribution
- **Red (M2)** - Highest contribution
- **Gray** - No MHA designation / No Data
 
The zones are reprojected from EPSG:2285 to WGS84 for use within Mapbox. Hover interactions will highlight the zones and display a popup with information regarding the zoning details.

### 2. Rent Burden Trend Chart
A C3.js line chart showing the percentage of renters spending more than 50% of their income on rent from 2006 to 2022. A vertical reference line marks 2019, when MHA policy was implemented citywide. 
A scatter point highlights the currently selected year.
 
### 3. Burden by Group Bar Chart
A C3.js bar chart comparing rent burden rates across six demographic groups (All, White, Black, Hispanic, Asian, Native) for the selected year. Updates dynamically when the year slider is moved.
 
### 4. Renter Households by Income Bracket Chart
A C3.js bar chart that displays the number of renter households in each of the five income brackets for the selected year. 

---

## Ethical Considerations
Data presentation is important when working with this type of information. The visualizations were created with the intent to provide 
an understanding of the housing affordability issues in the U.S. in a manner that is thoughtful and responsible. 

Data limitations: these datasets do not include every aspect of housing for people. Factors like displacement, the quality of homes, and the financial situation of the 
individuals in those homes are not represented in these visualizations. Thus, these visualizations can only explain the general issues regarding housing affordability 
rather than the individual experiences with housing costs.

---

## Tools Used

| Tool | Purpose |
|---|---|
| HTML / CSS / JavaScript | Front-end structure, styling, and logic |
| Mapbox GL JS | Interactive map rendering |
| C3.js + D3.js | Chart generation |
| Proj4js | GeoJSON coordinate reprojection |
| GeoJSON | Spatial data format for MHA zones, rent burden, and renter income |

---

## Data Sources
 
| Dataset | Source |
|---|---|
| Mandatory Housing Affordability (MHA) Zones | [data.gov](https://catalog.data.gov/dataset/mandatory-housing-affordability-mha-zones-53917) |
| Renter Households by Income Category | [Seattle Open Data (ACS)](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::renter-households-by-income-category/about) |
| Rent Burden Greater Than 50% | [Seattle Open Data (ACS)](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::rent-burden-greater-than-50/about) |
 
---
