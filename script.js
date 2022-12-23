(function(){
  const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

  const getData = async () => {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return await data;
  }

  const renderData = async () => {
    const dataset = await getData();
    const w = 800;
    const h = 500;
    const padding = 50;
    console.log(dataset);

  }

  renderData();
  
})()