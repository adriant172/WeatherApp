import * as weatherApp from './helperFunctions.js'

const dataContainer = document.querySelector("#displayData");
weatherApp.getWeatherButton("currentWeatherBtn", dataContainer);
