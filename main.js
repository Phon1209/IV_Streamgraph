// Controlling Constant
const svgWidth = 780,
  svgHeight = 600;
const margin = { top: 20, right: 30, bottom: 30, left: 60 },
  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#stream")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/Phon1209/IV_Streamgraph/main/Modified_CSV/Phon_spending.csv",
  function (data) {
    // List of groups = header of the csv files
    const keys = data.columns.slice(1);
    const parseMonth = d3.timeParse("%Y-%m");

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
    var y = d3.scaleLinear().domain([-10000, 10000]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // color palette
    var color = d3
      .scaleOrdinal()
      .domain(keys)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
      ]);

    //stack the data?
    var stackedData = d3.stack().offset(d3.stackOffsetSilhouette).keys(keys)(
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
      );
  }
);
