// Convert numeric text without treating blanks as zero.
function parseNumber(value) {
  const text = String(value ?? "").trim();
  return text === "" ? NaN : Number(text);
}

// Load the supplied CSV using its exact column names.
d3.csv("data/Ex6_TVdata.csv", d => ({
  brand: String(d.brand ?? "").trim(),
  model: String(d.model ?? "").trim(),
  screenSize: parseNumber(d.screenSize),
  screenTech: String(d.screenTech ?? "").trim(),
  energyConsumption: parseNumber(d.energyConsumption),
  star: parseNumber(d.star)
}))
  .then(rows => {
    allData = rows.filter(d =>
      Number.isFinite(d.energyConsumption) &&
      d.energyConsumption >= 0 &&
      ["LCD", "LED", "OLED"].includes(d.screenTech)
    );

    if (!allData.length) {
      throw new Error("No valid TV energy records were found.");
    }

    console.log("CSV rows:", rows.length);
    console.log("Valid histogram records:", allData.length);
    console.table(allData.slice(0, 5));

    console.table(
      ["LCD", "LED", "OLED"].map(technology => ({
        technology,
        records: allData.filter(
          d => d.screenTech === technology
        ).length
      }))
    );

    // Create one shared tooltip outside the SVG.
    chartTooltip = d3.select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .attr("role", "tooltip");

    populateFilters(allData);

    // Render again only when the chart container width changes.
    let previousWidth = -1;

    resizeObserver = new ResizeObserver(entries => {
      const currentWidth = entries[0].contentRect.width;

      if (currentWidth > 0 && currentWidth !== previousWidth) {
        previousWidth = currentWidth;
        drawHistogram(allData);
      }
    });

    resizeObserver.observe(
      document.querySelector("#histogram")
    );

    // Prevent a fixed tooltip from remaining visible after scrolling.
    window.addEventListener("scroll", hideTooltip, {
      passive: true
    });
  })
  .catch(error => {
    console.error("Unable to load the TV histogram:", error);

    d3.select("#chart-summary")
      .text(
        "Unable to display the chart. " +
        "Check the CSV file path and browser console."
      );
  });