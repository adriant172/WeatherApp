import iconData from "./iconMapping.json"

const images = {};

function importAll(r) {
  r.keys().forEach((key) => (images[key] = r(key)));
}

importAll(require.context('./weatherIcons/', false, /\.svg$/));
console.log(JSON.stringify(images));


// For this assignment I am leaving the API KEY in the code. The API key is publicly available and there is no consequence for exposing it.
const KEY = "b64784ee65e54392b7670004231608"

const ENDPOINT = "https://api.weatherapi.com/v1/"


export async function getCurrentWeather(city) {
    let dataContainer = document.querySelector("#displayData");
    try {
        let result = await fetch(`${ENDPOINT}current.json?key=${KEY}&q=${city}`);
        if (result.status !== 200) {
            alert(result);
        }
        let weatherReport = await result.json();
        console.log(weatherReport);
        return weatherDataParser(weatherReport);
        
    } catch (error) {
        alert(error)
    }  
}

export async function getForecast(location) {
    let days = 3;
    try {
        let result = await fetch(`${ENDPOINT}forecast.json?key=${KEY}&q=${location}&days=${days}`)
        if (result.status !== 200) {
            alert(result);
        }
        let forecastReport = await result.json();
        console.log(forecastReport);
        return forecastDataParser(forecastReport)

    } catch (error) {
        alert(error);
    }
}


function forecastDataParser(data) {
    let forecastDays = data.forecast.forecastday;
    let newForecastDays = {}
    let counter = 0;
    for (const day of forecastDays) {
        newForecastDays[day.date] = {};
        newForecastDays[day.date]["date"] = day.date;
        newForecastDays[day.date]["avg_temp_c"] = forecastDays[counter].day.avgtemp_c;
        newForecastDays[day.date]["avg_temp_f"] = forecastDays[counter].day.avgtemp_f;
        newForecastDays[day.date]["avg_humidity"] = forecastDays[counter].day.avghumidity;
        newForecastDays[day.date]["condition"] = forecastDays[counter].day.condition;
        newForecastDays[day.date]["min_temp_c"] = forecastDays[counter].day.mintemp_c;
        newForecastDays[day.date]["max_temp_c"] = forecastDays[counter].day.maxtemp_c;
        newForecastDays[day.date]["min_temp_f"] = forecastDays[counter].day.mintemp_f;
        newForecastDays[day.date]["max_temp_f"] = forecastDays[counter].day.maxtemp_f;
        counter++;
    }
    return newForecastDays
}
 function weatherDataParser(data) {
    let newData = {}
    newData["locationName"] = data.location.name;
    newData["region"] = data.location.region;
    newData["country"] = data.location.country;
    newData["temp_c"] = data.current.temp_c;
    newData["temp_f"] = data.current.temp_f;
    newData["condition"] = data.current.condition;
    newData["humidity"] = data.current.humidity;

    return newData

}

export function getCity() {
    let location = document.querySelector("#locationSearch");
    return location.value
}

export function getWeatherButton(buttonID, currentContainer, forecastContainer, ) {
    let button = document.querySelector(`#${buttonID}`)
    // clearData(currentContainer);
    // clearData(forecastContainer);
    button.addEventListener('click', async () => {
        let cityName = getCity();
        let currentWeatherData = await getCurrentWeather(cityName);
        let forecastWeatherData = await getForecast(cityName)
        await displayCurrentWeather(currentContainer, currentWeatherData );
        await displayForecast(forecastContainer, forecastWeatherData)
        
    })
}


export function displayForecastWeatherOld(dataContainer, weatherData) {
    const dataList = document.createElement("ul");
    const tempScale = window.localStorage.getItem("tempScale");
    for (const key in weatherData) {
        let item = document.createElement("li");
        if (key === "condition") {
            const conditionText = document.createElement("p");
            const conditionIcon = document.createElement("img");
            conditionText.innerHTML = weatherData.condition.text
            conditionIcon.src = weatherData.condition.icon
            item.classList.add("condition");
            item.appendChild(conditionText);
            item.appendChild(conditionIcon);

        } else if ( key.includes("temp")) {
            item.innerHTML = `${weatherData[key]} ${tempScale}`
        } else {
            item.innerHTML = weatherData[key];
        }
        
        dataList.appendChild(item);
    }
    dataContainer.appendChild(dataList);
}

async function displayForecastWeather(dataContainer, weatherData) {
    const forecastDataContainer = document.createElement("div");
    forecastDataContainer.classList.add("forecastDataContainer");
    const tempScale = window.localStorage.getItem("tempScale");
    const day = createNewElement("div", "date", ["day"], weatherData.date )
    let maxTemp;
    let minTemp;
    if (tempScale === "°C") {
        maxTemp = createNewElement("div", "maxTemp" ,["temp"], `${weatherData.max_temp_c} ${tempScale}`);
        minTemp = createNewElement("div", "minTemp" ,["temp"], `${weatherData.min_temp_c} ${tempScale}`);
    } else {
        maxTemp = createNewElement("div", "maxTemp" ,["temp"], `${weatherData.max_temp_f} ${tempScale}`);
        minTemp = createNewElement("div", "minTemp" ,["temp"], `${weatherData.min_temp_f} ${tempScale}`);
    }
    const conditionText = createNewElement("p", `${weatherData.date}-conditionText`, ["condition"], weatherData.condition.text);

    const conditionIconContainer = document.createElement("div");
    const conditionIconName = await iconSelector(weatherData.condition.text);
    // const conditionIcon = createNewElement("img", `${weatherData.date}-conditionIcon` , ["condition"], `./weatherIcons/${conditionIconName}`);
    const conditionIcon = createNewElement("img", `${weatherData.date}-conditionIcon` , ["condition"], new URL(images[`./${conditionIconName}`], import.meta.url));
    conditionIconContainer.appendChild(conditionIcon);
    conditionIconContainer.classList.add("forecastConditionIconContainer");

    forecastDataContainer.appendChild(day);
    forecastDataContainer.appendChild(maxTemp);
    forecastDataContainer.appendChild(minTemp);
    forecastDataContainer.appendChild(conditionText);
    forecastDataContainer.appendChild(conditionIconContainer);
    dataContainer.appendChild(forecastDataContainer);
}

async function  displayCurrentWeather(container, weatherData) {
    clearData(container);
    const dataContainer = createNewElement("div", "currentWeatherContainer", ["weatherContainer"]);
    const tempScale = window.localStorage.getItem("tempScale");
    const location = createNewElement("div", "currentLocation" ,["location"], `${weatherData.locationName}, ${weatherData.region}`);
    const country = createNewElement("div", "currentCountry", ["country"], weatherData.country);
    let temp;
    if (tempScale === "°C") {
        temp = createNewElement("div", "currentTemp" ,["temp"], `${weatherData.temp_c} ${tempScale}`);
    } else {
        temp = createNewElement("div", "currentTemp", ["temp"], `${weatherData.temp_f} ${tempScale}`);
    }
    const humidity = createNewElement("div", "currentHumidity", ["humidity"],`Humidity: ${weatherData.humidity}%` );
    const conditionText = createNewElement("p", "currentConditionText", ["condition"], weatherData.condition.text);

    const conditionIconContainer = document.createElement("div");
    const conditionIconName = await iconSelector(weatherData.condition.text);
    // const conditionIcon = createNewElement("img", "currentConditionIcon" , ["current-condition"], `./weatherIcons/${conditionIconName}`);
    const conditionIcon = createNewElement("img", "currentConditionIcon" , ["current-condition"], new URL(images[`./${conditionIconName}`], import.meta.url));
    conditionIconContainer.appendChild(conditionIcon);
    conditionIconContainer.classList.add("conditionIconContainer");

    dataContainer.appendChild(location);
    dataContainer.appendChild(country);
    dataContainer.appendChild(temp);
    dataContainer.appendChild(humidity);
    dataContainer.appendChild(conditionText);
    dataContainer.appendChild(conditionIconContainer);

    container.appendChild(dataContainer)
}

function createNewElement(type, id,  classes, content) {
    const element = document.createElement(type);

    if (id) {
        element.setAttribute("id", id)
    }
    if (classes.length) {
        element.classList.add(...classes)
    }
    if (content) {
        if (type === "img") {
            element.src = content;
        } else {
            element.innerHTML = content
        }
    }
    return element
}

export function displayForecast(container, forecastWeatherData, ) {
    clearData(container)
    for (const day in forecastWeatherData) {
        displayForecastWeather(container, forecastWeatherData[day])
    }
}
export function clearData(dataContainer) {
    while(dataContainer.firstChild) {
        dataContainer.removeChild(dataContainer.firstChild);
    }
}

async function iconSelector(conditionText) {
    const words = conditionText.toLowerCase().split(' ')
    // const result = await fetch("./iconMapping.json"); 
    // const iconMapping = await result.json();
    const iconMapping = iconData;
    let icon;

    words.forEach( word => {
        for (let i = 0; i < iconMapping.length; i++) {
            const currentElement = iconMapping[i]["condition"]
            if (currentElement.includes(word)) {
                console.log(" This is the icon name " + iconMapping[i]["icon"])
                icon = iconMapping[i]["icon"]
                return
            }
        }
    })
    return icon
}