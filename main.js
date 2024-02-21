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

svg.insert("rect") //for color opacity changing insert it wont cover the graph (this is for hovering interactivity)
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + -margin.left + "," + -margin.top + ")")
  .attr("fill", "white") //white so doesnt cover


//tooltips
const tooltip = d3.select("body").append("div")
const pinnedtooltip = d3.select("body").append("div")

// Parse the Data
d3.csv(
  "https://raw.githubusercontent.com/Phon1209/IV_Streamgraph/main/Christian_CSV+synthetic.py/Christian_modified_spending_days.csv",
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
    svg.append("g").call(d3.axisLeft(y));

    //gets the max and min values for each category (for interactivity)
    const vals = keys.reduce((accumulate, key) => 
    {
    const values = data.map(row => Number(row[key]));
    accumulate[key] = 
    {
        maxvalue: d3.max(values),
        minvalue: d3.min(values)
    };
      return accumulate;
    }, {});

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
          )
      .on('mouseover', function(d, i) { //mouseover 
          d3.select(this) //the area we currently hover changes opacity and its stroke ie. the border
            .style('stroke', 'black')
            .style('opacity', 0.85);
          tooltip
            .html(`Category: ${d.key}<br>Max ($): ${vals[d.key].maxvalue.toFixed(2)}<br>Min ($): ${vals[d.key].minvalue.toFixed(2)}`) //uses our max min values for each category by key
            .style("opacity", 1)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("height", "57px")
            .style("width", "180px")
            .style("padding", "10px")
            .style("font", "12px sans-serif")
            .style("border-radius", "8px")
            .style("left", (450) + "px")
            .style("top", (75) + "px")
            .style("background",color(d.key));
          svg.select("rect")  //selects the rectangle we did for background so we can change fill color to area we are currently hovering however much less opacity
            .attr("fill", color(d.key))
            .style('opacity',.25);
        })
      .on('mouseout', function() { // when we stop hovering 
          d3.select(this)
            .style('stroke', 'none') //removes stroke not hovering area
            .style('opacity', 1); //gives it back full opacity
            svg.select("rect") //selects the rectangle we did for background and changes fill to default color white as we arent hovering any area
              .attr("fill", 'white')
          tooltip.style("opacity", 0);
        })
      .on('click', function(d,i) { //we use seperate tooltip here for pinned tooltip display information for clicked area and it keeps it up until we click the tooltip to remove it or click new area and then that is displayed as tooltip instead
         pinnedtooltip
            .html(`Category: ${d.key}<br>Max ($): ${vals[d.key].maxvalue.toFixed(2)}<br>Min ($): ${vals[d.key].minvalue.toFixed(2)}`)
            .style("opacity", 1)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("height", "57px")
            .style("width", "180px")
            .style("padding", "10px")
            .style("font", "12px sans-serif")
            .style("border-radius", "8px")
            .style("left", (630) + "px")
            .style("top", (75) + "px")
            .style("background",color(d.key))
            .style("border", "2px solid black")
      .on('click', function() {
          d3.select(this).style("opacity", 0); //instead of removing it just hide it by removing its opacity same functionality but we can click new area to still display this tooltip if just remove by clicking then clicking new area tooltip wont show up
        });
        });
       
  }
);

