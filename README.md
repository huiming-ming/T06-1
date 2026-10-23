# T06: TV Energy Consumption Explorer

An interactive D3 webpage exploring TV energy consumption,
energy star ratings, screen technologies and screen sizes.

Built for COS30045 Data Visualisation, T06-1 and T06-2.

## Features

### Interactive Histogram

- Displays the frequency of annual TV energy consumption.
- Uses fixed 200 kWh/year intervals.
- Filters records using All TVs, LED, LCD and OLED buttons.
- Animates bar heights when the selected technology changes.
- Keeps axis domains and bin boundaries fixed for comparison.
- Shows interval details on hover or keyboard focus.

### Colour-Coded Scatterplot

- X-axis: energy star rating.
- Y-axis: annual energy consumption in kWh/year.
- Blue points: LED.
- Orange points: LCD.
- Green points: OLED.
- Hover tooltips display screen size in inches.
- Semi-transparent points help reveal overlapping records.

The technology buttons filter the histogram only.

## Technologies

- HTML
- CSS
- JavaScript
- D3.js v7
- ResizeObserver

## Project Structure

```text
T06/
├── index.html
├── README.md
├── css/
│   ├── base.css
│   └── visualisations.css
├── data/
│   └── Ex6_TVdata.csv
└── js/
    ├── shared-constants.js
    ├── histogram.js
    ├── scatterplot.js
    ├── interactions.js
    └── load-data.js
```

## Dataset

The project uses `Ex6_TVdata.csv`, supplied with the COS30045
T06 exercise materials. The supplied materials identify the
dataset as downloaded in January 2025.

| Screen Technology | Records |
|---|---:|
| LED | 3,128 |
| LCD | 319 |
| OLED | 256 |
| Total | 3,703 |

### Columns

| Column | Description |
|---|---|
| brand | TV brand |
| model | TV model |
| screenSize | Screen size in inches |
| screenTech | Screen technology |
| energyConsumption | Annual energy consumption in kWh/year |
| star | Energy star rating |

Frequency represents CSV record counts, not sales or households.

## Run Locally

1. Download or clone the repository.
2. Open the project folder in Visual Studio Code.
3. Open `index.html` using the Live Server extension.
4. Use the filter buttons and hover over chart elements.

A local web server is required so the browser can load the CSV.

## Implementation

The CSV is loaded once and numeric fields are converted to numbers.

D3 groups energy values into fixed intervals for the histogram.
Selecting a technology filters the records, recalculates bin
frequencies and animates the bars.

The scatterplot uses independent scales, a categorical colour
scale and an SVG tooltip that displays screen size.

Both charts redraw when their container widths change.
The histogram preserves its selected filter during resizing.

## References

- COS30045 T06 exercise instructions and supplied code.
- COS30045 T06 TV dataset.
