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
        newForecastDays[day.date]["avg_temp_c"] = forecastDays[counter].day.avgtemp_c;
        newForecastDays[day.date]["avg_temp_f"] = forecastDays[counter].day.avgtemp_c;
        newForecastDays[day.date]["avg_humidity"] = forecastDays[counter].day.avghumidity;
        newForecastDays[day.date]["condition"] = forecastDays[counter].day.condition;
        newForecastDays[day.date]["min_temp_c"] = forecastDays[counter].day.mintemp_c;
        newForecastDays[day.date]["max_temp_c"] = forecastDays[counter].day.maxtemp_c;
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
    clearData(currentContainer);
    clearData(forecastContainer);
    button.addEventListener('click', async () => {
        let cityName = getCity();
        let currentWeatherData = await getCurrentWeather(cityName);
        let forecastWeatherData = await getForecast(cityName)
        displayCurrentWeather(currentContainer, currentWeatherData );
        displayForecast(forecastContainer, forecastWeatherData)
        
    })
}


export function displayForecastWeather(dataContainer, weatherData ) {
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

function displayCurrentWeather(dataContainer, weatherData) {
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
    const conditionIcon = createNewElement("img", "currentConditionIcon" , ["condition"], weatherData.condition.icon);

    dataContainer.appendChild(location);
    dataContainer.appendChild(country);
    dataContainer.appendChild(temp);
    dataContainer.appendChild(humidity);
    dataContainer.appendChild(conditionText);
    dataContainer.appendChild(conditionIcon);
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
    for (const day in forecastWeatherData) {
        displayForecastWeather(container, forecastWeatherData[day])
    }
}
function clearData(dataContainer) {
    while(dataContainer.firstChild) {
        dataContainer.removeChild(dataContainer.firstChild)
    }
}