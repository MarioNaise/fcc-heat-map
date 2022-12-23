(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  const getData = async () => {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return await data;
  }

  const renderData = async () => {
    const data = await getData();
    const dataset = data.monthlyVariance;
    const { baseTemperature } = data;

    const w = 1100;
    const h = 600;
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
      .domain([new Date(minYear.toString()), new Date(maxYear.toString())])
      .range([padding, w - padding]);

    const yScale = d3.scaleTime()
      .domain([new Date("2002-01-01"), new Date("2002-12-31")])
      .range([padding, h - padding]);

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

    
  }

  renderData();
  
})()