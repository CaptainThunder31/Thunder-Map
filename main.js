window.onload = () => {
  const imageSrc = "https://i.ibb.co/2yztRX8/wereldkaart-eurocentrisch-1.jpg";
  const dotGrid = document.getElementById('dotGrid');
  const btn = document.getElementById('start')
  const input = document.getElementById('city');
  const cityDiv = document.getElementById('cityName');
  const cityLat = document.getElementById('cityLat')
  const cityLong = document.getElementById('cityLong');
  let targetLat = 60;
  let targetLong = 60;
  let gridArray = [];
  
  btn.onclick=()=>{
let city_name = input.value;

if(city_name){
function processImage(src, lat, long) {
  dotGrid.innerHTML = "";
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;

  img.onload = () => {
    const dotSize = 0.9; // Size of each dot
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const { width, height } = canvas;

    // Calculate rows and columns to match dotGrid's aspect ratio
    const gridGap = 10/3; // Dynamically calculate grid spacing
    const columns = Math.floor(width / gridGap);
    const rows = Math.floor(height / gridGap);

    dotGrid.style.gridTemplateColumns = `repeat(${columns}, ${dotSize}px)`; // Dynamically set grid columns

    gridArray = Array.from({ length: rows }, () => Array(columns).fill(null));

    for (let y = 0; y < height; y += gridGap) {
      const rowIndex = Math.floor(y / gridGap);
      for (let x = 0; x < width; x += gridGap) {
        const colIndex = Math.floor(x / gridGap);

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;

        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.backgroundColor = brightness < 127 ? "green" : "skyblue";

        gridArray[rowIndex][colIndex] = dot;
        dotGrid.appendChild(dot);
      }
    }

    // Highlight the latitude and longitude
    const latIndex = Math.round(((90 - lat) / 180) * rows);
    const longIndex = Math.round(((180 + long) / 360) * columns) - 10;

    for (let col = 0; col < columns; col++) {
      if (gridArray[latIndex] && gridArray[latIndex][col]) {
        gridArray[latIndex][col].style.backgroundColor = "#000";
        gridArray[latIndex][col].style.boxShadow = "0 0 20px #000";
      }
    }
    for (let row = 0; row < rows; row++) {
      if (gridArray[row] && gridArray[row][longIndex]) {
        gridArray[row][longIndex].style.backgroundColor = "#000";
        gridArray[row][longIndex].style.boxShadow = "0 0 30px #000";
      }
    }
  };
}
  
  const getCoordinates = async (cityName) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { latitude, longitude, country } = data.results[0];

      // Use or store the coordinates after they are fetched
      cityDiv.innerHTML = `City: ${cityName}`;
      cityLat.innerHTML = latitude>0 ? `Latitude: ${latitude} °N` : `Latitude: ${-latitude} °S`;
      cityLong.innerHTML = longitude>0 ? `Longitude: ${longitude} °E` : `Longitude: ${-longitude} °W`;

     
      processImage(imageSrc, Math.round(latitude), Math.round(longitude));
    } else {
      alert("City not found!");
    }
  } catch (error) {
    alert("Error fetching data:", error.message);
  }
};
// Usage
getCoordinates(city_name);
}

else{
  alert("Please enter a valid city name!")
}
 
  }
};