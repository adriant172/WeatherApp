import * as weatherApp from './helperFunctions.js'

const currentWeatherContainer = document.querySelector("#displayData");
const forecastContainer = document.querySelector("#forecast");
let tempScale

if (!localStorage.getItem("tempScale")) {
    localStorage.setItem("tempScale", "°C");
} 


weatherApp.getWeatherButton("currentWeatherBtn", currentWeatherContainer, forecastContainer);
