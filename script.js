(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  const getData = async () => {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return await data;
  }

  const setDescription = (dataset) => {
    
    const minYear = d3.min(dataset.monthlyVariance, (d)=>d.year)
    const maxYear = d3.max(dataset.monthlyVariance, (d)=>d.year)
    const baseTemp = dataset.baseTemperature
    d3.select("#description")
    .text(`${minYear} - ${maxYear}: base temperature ${baseTemp}°C`);
    
  }

  const renderData = async () => {
    const dataset = await getData();
    const w = 800;
    const h = 500;
    const padding = 50;
    
    setDescription(dataset);
  }

  renderData();
  
})()