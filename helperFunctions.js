const KEY = "b64784ee65e54392b7670004231608"

export async function getCurrentWeather(city) {
    let dataContainer = document.querySelector("#displayData");
    try {
        let result = await fetch(`https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}`);
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

// export async function getForecast()

export function getCity() {
    let location = document.querySelector("#locationSearch");
    return location.value
}

export function getWeatherButton(buttonID, displayContainer) {
    let button = document.querySelector(`#${buttonID}`)
    button.addEventListener('click', async () => {
        let cityName = getCity();
        let currentWeatherData = await getCurrentWeather(cityName);
        displayData(displayContainer, currentWeatherData);
        
    })
}

export function weatherDataParser(data) {
    let newData = {}
    newData["locationName"] = data.location.name;
    newData["country"] = data.location.country;
    newData["temp_c"] = data.current.temp_c + " °C";
    newData["condition"] = data.current.condition;
    newData["humidity"] = `Humidity: ${data.current.humidity}%`;

    return newData

}

export function displayData(dataContainer, currentWeatherData) {
    const dataList = document.createElement("ul");
    while(dataContainer.firstChild) {
        dataContainer.removeChild(dataContainer.firstChild)
    }
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