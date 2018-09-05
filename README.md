# AMRviz
## Antimicrobial resistance visualization

An interactive visualization of the antimicrobial resistance evolution from 2001 to 2016 in different European countries.
The visualization is still in progress (missing data is not clearly stated).

Selecting a country will bring up a spider plot (radar chart) with different bacteria-antibiotic combinations in time.
The user can move the slider on the bottom of the page, or simply plot all years at once. There are checkboxes in the legend, where specific years may be selected (or deselected) for comparison. The values in tooltips show the percentage of resistant AND intermediate strains found in that particular year, for that particular bactera-antibiotic pair.

Open up the interactive [AMR visualization](https://stup4r.github.io/AMRviz/index.html)


## How was it made?

The data comes from the European Centre for Disease Prevention and Control. Using the ECDC Surveillance Atlas on Antimicrobial resistance, the data was downloaded for periods and regions in a CSV file. The data can be found [here](https://ecdc.europa.eu/en/antimicrobial-resistance/surveillance-and-disease-data/data-ecdc).

The downloaded data was imported, cleaned, preprocessed and visualized first using python (pandas library) in the jupyter notebook enclosed in this repository - ![notebook](AMRviz.ipynb). The processed data was then exported as a JSON file for further use. Using HTML, CSS and JavaScript (in particular, the d3.js library), the file was imported, and its content was used for making an interactive visual.
