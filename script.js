(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  const getData = async () => {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return await data;
  }


  const dataset = await getData();
  const w = 800;
  const h = 500;
  const padding = 50;

  // SET DESCRIPTION
  d3.select("#description")
    .text(`${d3.min(dataset.monthlyVariance, (d)=>d.year)} - ${d3.max(dataset.monthlyVariance, (d)=>d.year)}: base temperature ${dataset.baseTemperature}°C`);

  
})()