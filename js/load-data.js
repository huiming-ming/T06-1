// Convert numeric text without treating blanks as zero.
function parseNumber(value) {
  const text = String(value ?? "").trim();

  return text === "" ? NaN : Number(text);
}

// Load the CSV using its exact column names.
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
      throw new Error(
        "No valid TV energy records were found."
      );
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

    // Create the histogram's shared HTML tooltip.
    chartTooltip = d3.select("body")
      .append("div")
      .attr("class", "chart-tooltip")
      .attr("role", "tooltip");

    populateFilters(allData);

    // Watch the histogram container width.
    let previousHistogramWidth = -1;

    resizeObserver = new ResizeObserver(entries => {
      const currentWidth = entries[0].contentRect.width;

      if (
        currentWidth > 0 &&
        currentWidth !== previousHistogramWidth
      ) {
        previousHistogramWidth = currentWidth;
        drawHistogram(allData);
      }
    });

    resizeObserver.observe(
      document.querySelector("#histogram")
    );

    // Watch the scatterplot container independently.
    let previousScatterWidth = -1;

    const scatterObserver = new ResizeObserver(entries => {
      const currentWidth = entries[0].contentRect.width;

      if (
        currentWidth > 0 &&
        currentWidth !== previousScatterWidth
      ) {
        previousScatterWidth = currentWidth;
        drawScatterplot(allData);
      }
    });

    scatterObserver.observe(
      document.querySelector("#scatterplot")
    );

    // Hide the fixed histogram tooltip when scrolling.
    window.addEventListener("scroll", hideTooltip, {
      passive: true
    });
  })
  .catch(error => {
    console.error(
      "Unable to initialise the TV charts:",
      error
    );

    d3.select("#chart-summary")
      .text(
        "Unable to display the charts. " +
        "Check the CSV file path and browser console."
      );
  });