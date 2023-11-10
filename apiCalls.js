const GIPHY_KEY = "E1kTslhEUkw22Mw9aF97kzUyyR2aZUPS"

export async function getGif(weatherCondition) {
    const words = weatherCondition.split()
    for (let i = 0; i < words.length; i++) {
        if (words[i].toLowerCase() === "possible") {
            words.splice(i, 1);
            weatherCondition = words.toString();
        }
    }
    try {
    let response = await fetch(`https://api.giphy.com/v1/stickers/search?api_key=${GIPHY_KEY}&q=${weatherCondition}&limit=1`, {'mode': "cors"})
        if (response.status !== 200) {
            alert(response);
        }
        const result = await response.json();
        console.log(result);
        let resultData = result.data;
        return resultData[0].images.fixed_height_small.url
    } catch (error) {
        alert(error);
    }
}