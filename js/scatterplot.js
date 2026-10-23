const drawScatterplot = sourceData => {
  const container = document.querySelector("#scatterplot");

  if (!container) return;

  const width = container.clientWidth;

  if (width <= 0) return;

  // Require valid values for positions and screen-size tooltips.
  const data = sourceData.filter(d =>
    Number.isFinite(d.star) &&
    Number.isFinite(d.energyConsumption) &&
    Number.isFinite(d.screenSize) &&
    d.energyConsumption >= 0 &&
    d.screenSize > 0
  );

  const root = d3.select(container);
  root.selectAll("*").remove();

  if (!data.length) {
    root.append("p")
      .text(
        "No valid records are available for the scatterplot."
      );

    return;
  }

  // Keep scatterplot dimensions independent of the histogram.
  const height = width < 500 ? 380 : 460;

  const scatterMargin = {
    top: 55,
    right: 28,
    bottom: 60,
    left: 65
  };

  const plotWidth =
    width - scatterMargin.left - scatterMargin.right;

  const plotHeight =
    height - scatterMargin.top - scatterMargin.bottom;

  const technologies = ["LED", "LCD", "OLED"];

  const color = d3.scaleOrdinal()
    .domain(["LED", "LCD", "OLED"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  const starExtent = d3.extent(data, d => d.star);

  const x = d3.scaleLinear()
    .domain([
      Math.max(0, starExtent[0] - 0.5),
      starExtent[1] + 0.5
    ])
    .nice()
    .range([0, plotWidth]);

  // Use energy consumption for the vertical position.
  const y = d3.scaleLinear()
    .domain([
      0,
      d3.max(data, d => d.energyConsumption) * 1.05
    ])
    .nice()
    .range([plotHeight, 0]);

  const svg = root.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr(
      "aria-label",
      "Scatterplot of energy star rating and annual TV " +
      "energy consumption, coloured by screen technology"
    );

  const plot = svg.append("g")
    .attr(
      "transform",
      `translate(${scatterMargin.left},${scatterMargin.top})`
    );

  // Place the legend above the plotting area.
  const legend = svg.append("g")
    .attr(
      "transform",
      `translate(${scatterMargin.left},18)`
    );

  const legendItems = legend.selectAll("g")
    .data(technologies)
    .join("g")
    .attr(
      "transform",
      (d, i) => `translate(${i * 72},0)`
    );

  legendItems.append("rect")
    .attr("width", 11)
    .attr("height", 11)
    .attr("fill", d => color(d));

  legendItems.append("text")
    .attr("class", "axis-label")
    .attr("x", 17)
    .attr("y", 10)
    .text(d => d);

  // Draw horizontal grid lines.
  plot.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(y)
        .ticks(5)
        .tickSize(-plotWidth)
        .tickFormat("")
    );

  plot.append("g")
    .attr("class", "axis x-axis")
    .attr(
      "transform",
      `translate(0,${plotHeight})`
    )
    .call(
      d3.axisBottom(x)
        .ticks(Math.max(2, Math.floor(plotWidth / 70)))
    );

  plot.append("g")
    .attr("class", "axis y-axis")
    .call(
      d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d3.format(",.0f"))
    );

  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr(
      "x",
      scatterMargin.left + plotWidth / 2
    )
    .attr("y", height - 14)
    .text("Energy Star Rating");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr(
      "x",
      -(scatterMargin.top + plotHeight / 2)
    )
    .attr("y", 15)
    .text("Annual Energy Consumption (kWh/year)");

  // Draw semi-transparent points without outlines.
  const points = plot.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("class", "scatter-point")
    .attr("cx", d => x(d.star))
    .attr("cy", d => y(d.energyConsumption))
    .attr("r", 4)
    .attr("fill", d => color(d.screenTech))
    .attr("opacity", 0.5);

  // Create an SVG tooltip above the point layer.
  const tooltipWidth = 110;
  const tooltipHeight = 34;

  const tooltip = plot.append("g")
    .attr("class", "scatter-tooltip")
    .style("opacity", 0)
    .style("pointer-events", "none");

  tooltip.append("rect")
    .attr("width", tooltipWidth)
    .attr("height", tooltipHeight)
    .attr("rx", 5)
    .attr("fill", "#443125")
    .attr("fill-opacity", 0.95);

  tooltip.append("text")
    .attr("x", tooltipWidth / 2)
    .attr("y", tooltipHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  // Display screen size when hovering over a point.
  points
    .on("mouseenter", function (event, d) {
      d3.select(this)
        .attr("r", 6)
        .attr("opacity", 1);

      const cx = x(d.star);
      const cy = y(d.energyConsumption);

      const tooltipX = Math.max(
        0,
        Math.min(
          cx - tooltipWidth / 2,
          plotWidth - tooltipWidth
        )
      );

      let tooltipY = cy - tooltipHeight - 10;

      // Place the tooltip below points near the top edge.
      if (tooltipY < 0) {
        tooltipY = cy + 10;
      }

      tooltipY = Math.max(
        0,
        Math.min(
          tooltipY,
          plotHeight - tooltipHeight
        )
      );

      tooltip.select("text")
        .text(`${d.screenSize} inches`);

      tooltip
        .interrupt()
        .attr(
          "transform",
          `translate(${tooltipX},${tooltipY})`
        )
        .style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this)
        .attr("r", 4)
        .attr("opacity", 0.5);

      tooltip
        .interrupt()
        .style("opacity", 0);
    });
};