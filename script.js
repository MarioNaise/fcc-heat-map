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

    const w = 800;
    const h = 500;
    const padding = 50;

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
      .domain([new Date(minYear.toString()), new Date(maxYear.toString())])
      .range([padding, w - padding]);

    // APPEND AXES
    const xAxis = d3.axisBottom(xScale);
    
    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis)
       .attr("id", "x-axis");


    
  }

  renderData();
  
})()