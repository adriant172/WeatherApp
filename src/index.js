import * as weatherApp from './helperFunctions.js'
import { dropDown } from './dropDown.js'
import './styles.css';
import './dropDownStyles.css';

const searchContainer = document.querySelector("#searchContainer")
const tempTypes = ["°C","°F"];
const myDropdown = new dropDown(searchContainer, "°C", tempTypes);
myDropdown.createDropdown();
myDropdown.initiateDropDown();



const currentWeatherContainer = document.querySelector("#displayData");
const forecastContainer = document.querySelector("#forecast");


if (!window.localStorage.getItem("tempScale")) {
    window.localStorage.setItem("tempScale", "°C");
} 


weatherApp.getWeatherButton("currentWeatherBtn", currentWeatherContainer, forecastContainer);

const tempDropDownItems = document.querySelector(".dropDownItems");
const tempDropDownButton = document.querySelector(".dropDownButton");
const currentWeatherButton = document.querySelector("#currentWeatherBtn");


for (const item of tempDropDownItems.children ) {
    console.log(item)
    item.addEventListener('click', () => {
        window.localStorage.setItem("tempScale", item.innerHTML);
        tempDropDownButton.firstChild.textContent = item.innerHTML;
        tempDropDownButton.click();
        currentWeatherButton.click();
    })
}