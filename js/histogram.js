const drawHistogram = data => {
  const container = document.querySelector("#histogram");
  const width = container.clientWidth;

  if (width <= 0) return;

  hideTooltip();

  const root = d3.select(container);
  root.selectAll("*").remove();

  const height = width < 500 ? 340 : 420;

  innerWidth = width - margin.left - margin.right;
  innerHeight = height - margin.top - margin.bottom;

  // Calculate bin boundaries from the complete dataset.
  const maximumEnergy = d3.max(
    data,
    d => d.energyConsumption
  );

  const upperBound = Math.max(
    binWidth,
    Math.ceil(maximumEnergy / binWidth) * binWidth
  );

  // Reuse these boundaries for all technology filters.
  binGenerator
    .domain([0, upperBound])
    .thresholds(
      d3.range(binWidth, upperBound, binWidth)
    );

  const allBins = binGenerator(data);

  // Keep both axis domains fixed when filtering.
  xScale
    .domain([0, upperBound])
    .range([0, innerWidth]);

  yScale
    .domain([0, d3.max(allBins, d => d.length) || 1])
    .nice()
    .range([innerHeight, 0]);

  const svg = root.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr(
      "aria-label",
      "Histogram of annual TV energy consumption"
    );

  innerChart = svg.append("g")
    .attr(
      "transform",
      `translate(${margin.left},${margin.top})`
    );

  // Draw horizontal grid lines behind the bars.
  innerChart.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat("")
    );

  innerChart.append("g")
    .attr("class", "bars");

  innerChart.append("g")
    .attr("class", "axis x-axis")
    .attr(
      "transform",
      `translate(0,${innerHeight})`
    )
    .call(
      d3.axisBottom(xScale)
        .ticks(Math.max(2, Math.floor(innerWidth / 80)))
        .tickFormat(formatNumber)
    );

  innerChart.append("g")
    .attr("class", "axis y-axis")
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(formatNumber)
    );

  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 14)
    .text("Annual Energy Consumption (kWh/year)");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 14)
    .text("Frequency (TV Records)");

  // Preserve the selected filter when the chart resizes.
  updateHistogram(activeFilter, data, false);
};