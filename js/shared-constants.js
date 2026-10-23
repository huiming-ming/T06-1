// Define the chart margins and fixed energy interval width.
const margin = {
  top: 20,
  right: 18,
  bottom: 60,
  left: 58
};

const binWidth = 200;

// Create shared scales and the bin generator.
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const binGenerator = d3.bin()
  .value(d => d.energyConsumption);

// Define the screen-technology filter options.
const filters_screen = [
  { id: "all", label: "All TVs", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

// Store the current chart state.
let allData = [];
let activeFilter = "all";

let innerChart;
let innerWidth = 0;
let innerHeight = 0;
let chartTooltip;
let resizeObserver;

const formatNumber = d3.format(",.0f");