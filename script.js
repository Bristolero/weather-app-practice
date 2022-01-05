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
        DisplayController.showTodayData();
    })
    async function handleCitySearch () {
        let cityValue = getCityInput.value;
        console.log(cityValue)
        let weatherData = await getWeatherData(cityValue);
        return weatherData;
    }
    return { handleCitySearch, getCityButton };
})();

const DisplayController = (() => {

    //Container Elements
    const weatherTodayDisplay = document.getElementById("weather-today");
    const weatherOneDay = document.getElementById("1-day");
    const weatherTwoDay = document.getElementById("2-day");
    const weatherThreeDay = document.getElementById("3-day");
    

    //Content Elements
    const cityNameHeader = document.getElementById("city-name-header");
    const currentTemp = document.getElementById("current-temp");
    const minMaxTemp = document.getElementById("min-max-temp");
    const humidity = document.getElementById("humidity");
    const weather = document.getElementById("weather");

    async function showTodayData() {
        const weatherData = await ButtonController.handleCitySearch();
        console.log(weatherData);
        createTodayElements(weatherData);
    }

    function createTodayElements(data) {
        
        cityNameHeader.innerText = data.name;
        currentTemp.innerText = LogicController.convertToCelsius(data.main.temp) + "°C";
        minMaxTemp.innerText = LogicController.convertToCelsius(data.main.temp_min) + "°C / " + LogicController.convertToCelsius(data.main.temp_max) + "°C";
        humidity.textContent = "Humidity: " + data.main.humidity + "%" 
        weather.textContent = data.weather[0].main;

        changeWeatherBackground(data.weather[0].main);

        weatherTodayDisplay.appendChild(cityNameHeader);
        weatherTodayDisplay.appendChild(currentTemp);
        weatherTodayDisplay.appendChild(minMaxTemp);
        weatherTodayDisplay.appendChild(humidity)
        weatherTodayDisplay.appendChild(weather)
    }

    function changeWeatherBackground(weather) {
        console.log(weather)
        if(weather=="Clouds") {
            weatherTodayDisplay.style.backgroundImage = "url('./img/cloudy.jpeg')";
            weatherTodayDisplay.style.color = "var(--header-img)";
        }
        if(weather=="Rain") {
            weatherTodayDisplay.style.backgroundImage = "url('./img/rainy.jpg')";
            weatherTodayDisplay.style.color = "white";
        }
        if(weather=="Clear") {
            weatherTodayDisplay.style.backgroundImage = "url('./img/clear.jpeg')";
            weatherTodayDisplay.style.color = "black";
        }
    }


    return { showTodayData, createTodayElements }
})();

const LogicController = (() => {
    let lol = 0;
    function convertToCelsius (temp) {
        let celsius = temp - 273.15;
        celsius = Math.round(celsius);
        return celsius;
    }
    return {lol, convertToCelsius };
})();

async function createDefaultData () {
    const defaultData = await getWeatherData("Dortmund");
    DisplayController.createTodayElements(defaultData);
}
//console.log(defaultData);
createDefaultData();