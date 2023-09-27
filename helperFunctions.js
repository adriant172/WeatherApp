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
    newData["country"] = data.location.country;
    newData["temp_c"] = data.current.temp_c + " °C";
    newData["temp_f"] = data.current.temp_f + " °F";
    newData["condition"] = data.current.condition;
    newData["humidity"] = `Humidity: ${data.current.humidity}%`;

    return newData

}

export function getCity() {
    let location = document.querySelector("#locationSearch");
    return location.value
}

export function getWeatherButton(buttonID, currentContainer, forecastContainer) {
    let button = document.querySelector(`#${buttonID}`)
    clearData(currentContainer);
    clearData(forecastContainer);
    button.addEventListener('click', async () => {
        let cityName = getCity();
        let currentWeatherData = await getCurrentWeather(cityName);
        let forecastWeatherData = await getForecast(cityName)
        displayWeather(currentContainer, currentWeatherData);
        displayForecast(forecastContainer, forecastWeatherData)
        
    })
}



export function displayWeather(dataContainer, currentWeatherData) {
    const dataList = document.createElement("ul");
   
    for (const key in currentWeatherData) {
        let item = document.createElement("li");
        if (key === "condition") {
            let conditionText = document.createElement("p");
            let conditionIcon = document.createElement("img");
            conditionText.innerHTML = currentWeatherData.condition.text
            conditionIcon.src = currentWeatherData.condition.icon
            item.classList.add("condition");
            item.appendChild(conditionText);
            item.appendChild(conditionIcon);

        } else {
            item.innerHTML = currentWeatherData[key];
        }
        dataList.appendChild(item);
    }
    dataContainer.appendChild(dataList);
}

export function displayForecast(container, forecastWeatherData) {
    for (const day in forecastWeatherData) {
        displayWeather(container, forecastWeatherData[day])
    }
}
function clearData(dataContainer) {
    while(dataContainer.firstChild) {
        dataContainer.removeChild(dataContainer.firstChild)
    }
}