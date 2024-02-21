// Controlling Constant
const svgWidth = 1280,
  svgHeight = 600;
const margin = { top: 20, right: 30, bottom: 30, left: 60 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;
const range = 100;

// append the svg object to the body of the page
const svg = d3
  .select("#stream")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/Phon1209/IV_Streamgraph/main/Modified_CSV/test.csv",
  function (data) {
    // List of groups = header of the csv files
    // const keys = data.columns.slice(1);

    const keys = [
      "Transportation",
      "Grocery",
      "Everything else",
      "Online Shopping",
      "Dining",
      "Online Services",
      "Housing",
    ];

    // color palette
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range([
        "#7fc97f",
        "#beaed4",
        "#fdc086",
        "#ffff99",
        "#386cb0",
        "#f0027f",
        "#bf5b17",
      ]);

    const parseMonth = d3.timeParse("%Y-%m-%d");
    const labelContainer = d3.select("#label");
    const labels = labelContainer
      .selectAll("li")
      .data(keys)
      .enter()
      .append("li")
      .classed("label-item", true)
      .classed("end", (d) => d === "Everything else");

    labels.append("div").attr("style", (d) => `background-color: ${color(d)}`);
    labels.append("p").text((d) => d);

    // Add X axis
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          const month = parseMonth(d.Month);
          return month;
        })
      )
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([-range, range]).range([height, 0]);
    // svg.append("g").call(d3.axisLeft(y));

    //stack the data?
    const stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
      data
    );

    // Show the areas
    svg
      .selectAll("mylayers")
      .data(stackedData)
      .enter()
      .append("path")
      .style("fill", function (d) {
        return color(d.key);
      })
      .attr(
        "d",
        d3
          .area()
          .x(function (d, i) {
            return x(parseMonth(d.data.Month));
          })
          .y0(function (d) {
            return y(d[0]);
          })
          .y1(function (d) {
            return y(d[1]);
          })
          .curve(d3.curveBasis)
      );
  }
);
