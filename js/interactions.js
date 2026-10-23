const populateFilters = data => {
  const buttons = d3.select("#filters_screen")
    .selectAll("button.filter")
    .data(filters_screen, d => d.id)
    .join("button")
    .attr("type", "button")
    .attr("class", "filter")
    .attr("aria-controls", "histogram")
    .classed("active", d => d.isActive)
    .attr("aria-pressed", d => String(d.isActive))
    .text(d => d.label);

  buttons.on("click", (event, selected) => {
    if (selected.id === activeFilter) return;

    activeFilter = selected.id;

    filters_screen.forEach(filter => {
      filter.isActive = filter.id === activeFilter;
    });

    buttons
      .classed("active", d => d.isActive)
      .attr("aria-pressed", d => String(d.isActive));

    updateHistogram(activeFilter, data);
  });
};

const updateHistogram = (filterId, data, animate = true) => {
  hideTooltip();

  const filteredData = filterId === "all"
    ? data
    : data.filter(d => d.screenTech === filterId);

  const bins = binGenerator(filteredData);
  const label = filterId === "all" ? "All TVs" : filterId;

  d3.select("#chart-summary")
    .text(
      `${label}: ${formatNumber(filteredData.length)} of ` +
      `${formatNumber(data.length)} TV records. ` +
      `Bin width: ${binWidth} kWh/year.`
    );

  const bars = innerChart.select(".bars")
    .selectAll("rect.bar")
    .data(bins, d => d.x0)
    .join(
      enter => enter.append("rect")
        .attr("class", "bar")
        .attr("y", innerHeight)
        .attr("height", 0),

      update => update,

      exit => exit.remove()
    )
    .attr("x", d => xScale(d.x0))
    .attr("width", d =>
      Math.max(0, xScale(d.x1) - xScale(d.x0))
    )
    .attr("tabindex", 0)
    .attr("aria-label", d => describeBin(d, label));

  // Show an immediate tooltip when a bar is hovered.
  bars
    .on("pointerenter", (event, d) => {
      showTooltip(describeBin(d, label));
      positionTooltip(event.clientX, event.clientY);
    })
    .on("pointermove", event => {
      positionTooltip(event.clientX, event.clientY);
    })
    .on("pointerleave", hideTooltip)
    .on("pointercancel", hideTooltip)
    .on("focus", function (event, d) {
      const box = this.getBoundingClientRect();

      showTooltip(describeBin(d, label));
      positionTooltip(
        box.left + box.width / 2,
        box.top
      );
    })
    .on("blur", hideTooltip)
    .on("keydown", event => {
      if (event.key === "Escape") {
        hideTooltip();
      }
    });

  // Stop an unfinished transition before starting a new one.
  bars.interrupt();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (animate && !reduceMotion) {
    bars.transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("y", d => yScale(d.length))
      .attr(
        "height",
        d => innerHeight - yScale(d.length)
      );
  } else {
    bars
      .attr("y", d => yScale(d.length))
      .attr(
        "height",
        d => innerHeight - yScale(d.length)
      );
  }
};

function describeBin(bin, label) {
  const closingBracket =
    bin.x1 === xScale.domain()[1] ? "]" : ")";

  return (
    `${label}\n` +
    `Energy: [${formatNumber(bin.x0)}, ` +
    `${formatNumber(bin.x1)}${closingBracket} kWh/year\n` +
    `TV Records: ${formatNumber(bin.length)}`
  );
}

function showTooltip(text) {
  if (!chartTooltip) return;

  chartTooltip
    .text(text)
    .style("visibility", "visible");
}

function hideTooltip() {
  if (chartTooltip) {
    chartTooltip.style("visibility", "hidden");
  }
}

function positionTooltip(clientX, clientY) {
  if (!chartTooltip) return;

  const box = chartTooltip.node().getBoundingClientRect();

  const left = Math.max(
    8,
    Math.min(
      clientX + 12,
      window.innerWidth - box.width - 8
    )
  );

  const top = Math.max(
    8,
    Math.min(
      clientY + 12,
      window.innerHeight - box.height - 8
    )
  );

  chartTooltip
    .style("left", `${left}px`)
    .style("top", `${top}px`);
}