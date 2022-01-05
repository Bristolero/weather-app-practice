async function getWeatherData(str) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${str}&appid=5c3a15a30a363e634cb2a255678865a4`, {mode: 'cors'});
        if( response.status == 200 ) {
            const data = await response.json();
            return data;
        }
        else throw new Error;
    }
    catch (err) {
        console.error("An error happened");
        alert("A city named " + str + " wasn't found");
    }
}

const ButtonController = (() => {

    const getCityInput = document.getElementById("city-input");
    const getCityButton = document.getElementById("city-btn");

    getCityButton.addEventListener("click", function () {
        handleCitySearch();
    })
    async function handleCitySearch () {
        let cityValue = getCityInput.value;
        console.log(cityValue)
        let weatherData = await getWeatherData(cityValue);
        return weatherData;
    }
    return handleCitySearch;
})();



//const defaultData = getWeatherData("Dortmund");
//console.log(defaultData);