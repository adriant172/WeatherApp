import * as weatherApp from './helperFunctions.js'

const currentWeatherContainer = document.querySelector("#displayData");
const forecastContainer = document.querySelector("#forecast")
weatherApp.getWeatherButton("currentWeatherBtn", currentWeatherContainer, forecastContainer);
