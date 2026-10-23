# T06: Interactive TV Energy Consumption Histogram

An interactive D3 histogram exploring annual TV energy consumption
across LCD, LED and OLED screen technologies.

## Features

- Screen technology filters: All TVs, LED, LCD and OLED
- Fixed 200 kWh/year bin intervals
- Fixed axis domains for comparison across filters
- Animated bar updates
- Pointer and keyboard-focus tooltips
- Responsive chart dimensions
- Reduced-motion preference support

## Technologies

HTML, CSS, JavaScript and D3.js v7.

## Dataset

The project uses `data/Ex6_TVdata.csv`, supplied with the
COS30045 T06 starter pack.

| Screen Technology | Records |
|---|---:|
| LED | 3,128 |
| LCD | 319 |
| OLED | 256 |
| Total | 3,703 |

Annual energy consumption is measured in kWh/year.
Frequency represents CSV record counts, not sales or households.

## How It Works

D3 groups energy consumption values into equal-width bins.
Selecting a screen technology filters the records and recalculates
the bin frequencies.

Bin boundaries and axis domains remain fixed across filters.
ResizeObserver redraws the chart when its container width changes
while preserving the selected filter.

## Run Locally

1. Open the project folder in Visual Studio Code.
2. Open `index.html` using Live Server.
3. Use the filter buttons to explore the dataset.

A local web server is required to load the CSV reliably.
