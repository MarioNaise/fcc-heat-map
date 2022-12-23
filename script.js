(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  colors = ["#ef5350","#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#26C6DA","#26A69A","#D4E157","#FFEE58","#FFA726"],
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

    const w = 800;
    const h = 400;
    const padding = 80;

    const minYear = d3.min(dataset, (d)=>d.year);
    const maxYear = d3.max(dataset, (d)=>d.year);

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
      .domain([new Date(minYear-5, 1), new Date(maxYear+5, 1)])
      .range([padding, w - padding])

    let monthsDateObj = [];
    for(let i = 0; i < 12; i++){
      monthsDateObj.push(new Date(1970, i))
    }

    const yScale = d3.scaleBand()
      .domain(monthsDateObj)
      .range([padding, h - padding])

    const colorScale = d3.scaleQuantize()
      .domain(d3.extent(dataset,(d)=>d.variance))
      .range(colors)

    
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
    .attr("x", (d,i) => xScale(d.year+i))
    .attr("y", d => yScale(d.month))
    .attr("width", 5)
    .attr("height", d => yScale.bandwidth())
    .attr("fill", (d => colorScale(d.variance)))

    
  }

  renderData();
  
})()