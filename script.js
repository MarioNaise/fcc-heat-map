(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
 colors = ["#4575B4", "#74ADD1", "#ABD9E", "#E0F3F8", "#FFFFBF", "#FEE090", "#FDAE61", "#F46D43", "#D73027"],
  months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const getData = async () => {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return await data;
  }

  const renderData = async () => {
    
    const data = await getData();
    const dataset = data.monthlyVariance;
    const { baseTemperature } = data;
    dataset.forEach((d)=>{
      d.month = d.month-1;
    })

    const w = 1500;
    const h = 700;
    const padding = 80;

    const minYear = d3.min(dataset, (d)=>d.year);
    const maxYear = d3.max(dataset, (d)=>d.year);
    const minMonth = d3.min(dataset, (d)=>d.month);
    const maxMonth = d3.max(dataset, (d)=>d.month);

    // SET DESCRIPTION
    d3.select("#description")
    .text(`${minYear} - ${maxYear}: base temperature ${baseTemperature}°C`);


    // APPEND SVG
    const svg = d3.select("main")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    // SET SCALES
    const xScale = d3.scaleTime()
      .domain([minYear, maxYear])
      .range([padding, w - padding])

    const yScale = d3.scaleLinear()
      .domain([minMonth, maxMonth])
      .range([padding, h - padding])

    const colorScale = d3.scaleLinear()
      .domain(d3.extent(dataset,(d)=>d.variance))
      .range(["white", "red"])

    
    // APPEND AXES
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .ticks(12)
      .tickFormat(d3.timeFormat("%B"))
    
    
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");
    
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis)
       .attr("id", "y-axis");


    // APPEND CELLS
    svg
    .append("g")
    .classed("map", true)
    .attr("transform", "translate(" + padding + "," + padding + ")")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", baseTemperature)
    .attr("x", d =>{
      return xScale(d.year)-padding;
    })
    .attr("y", d => yScale(d.month)-padding-50)
    .attr("width", "10px")
    .attr("height", "45px")
    .attr("fill", d => colorScale(d.variance))

    
  }

  renderData();
  
})()