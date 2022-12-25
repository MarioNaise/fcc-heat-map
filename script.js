(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
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

    const w = 1200;
    const h = 500;
    const legendW = 600;
    const legendH = 100;
    const legendPadding = 20;
    const padding = 80;

    const minYear = d3.min(dataset, (d)=>d.year);
    const maxYear = d3.max(dataset, (d)=>d.year);
    const minTemp = d3.min(dataset, (d)=>d.variance);
    const maxTemp = d3.max(dataset, (d)=>d.variance);

    // SET DESCRIPTION
    d3.select("#description")
    .text(`${minYear} - ${maxYear}: base temperature ${baseTemperature}°C`);


    // APPEND SVG
    const svg = d3.select("main")
      .append("svg")
      .attr("width", w)
      .attr("height", h)

    // TOOLTIP
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")

    
    // SET SCALES
    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding])

    const yScale = d3.scaleBand()
      .domain(months)
      .range([padding, h - padding])

    const colorScale = d3.scaleSequential()
      .domain([d3.max(dataset,(d)=>d.variance), d3.min(dataset,(d)=>d.variance)])
      .interpolator(d3.interpolateSpectral);

    
    // APPEND AXES
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(x => parseInt(x))
    const yAxis = d3.axisLeft(yScale);
    
    
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
    .attr("x", d =>xScale(d.year)-padding)
    .attr("y", d => yScale(months[d.month])-padding)
    .attr("width", (w - padding*2) / (maxYear-minYear) + "px")
    .attr("height", Math.floor((h - padding*2) / 12) + "px")
    .attr("fill", d => colorScale(d.variance))
    .on("mouseover", (e, d)=>{
        const {year, month, variance} = d;
        tooltip
        .attr("data-year", year)
        .attr("data-gdp", d[1])
        .style("display", "block")
        .style("left", `${e.pageX + 10}px`)
        .style("top", `${e.pageY + 10}px`)
        .html(
          `
            <p>Month: ${months[month]} </p>
            <p>Year: ${year} </p>
            <p>Variance: ${variance}</p>
          `
        )
        
      })
      .on("mouseout", (e, d)=>{
          tooltip.style("display", "none")
          })

    // LEGEND
    const legendScale = d3.scaleLinear()
      .domain([baseTemperature + minTemp, baseTemperature + maxTemp])
      .range([legendPadding, legendW - legendPadding]);

    const legendAxis = d3.axisBottom(legendScale)
    
    const legend = d3
      .select("main")
      .append("svg")
      .attr("id", "legend")
      .attr("width", legendW)
      .attr("height", legendH)

    legend.append("g")
       .attr("transform", "translate(0," + (legendH - legendPadding) + ")")
       .call(legendAxis)
       .attr("id", "legend-axis");


    // LEGEND CELLS
    const tempArr = [...Array(Math.floor(baseTemperature + maxTemp)).keys()]
    .filter((num)=> num >= (baseTemperature+minTemp))

    legend.selectAll("rect")
    .data(tempArr)
    .enter()
    .append("rect")
    .attr("class", "legendCell")
    .attr("fill", d => colorScale(d-baseTemperature))
    .attr("x", d => legendScale(d))
    .attr("y", padding-(legendW - padding)/tempArr.length)
    .attr("height", (legendW - padding)/tempArr.length)
    .attr("width", (legendW - padding)/tempArr.length)

    
  }

  renderData();
  
})()