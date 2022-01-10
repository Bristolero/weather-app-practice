

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

async function getForecastData(str) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${str}&appid=5c3a15a30a363e634cb2a255678865a4`, {mode: 'cors'});
        if( response.status == 200 ) {
            const data = await response.json();
            return data;
        }
    } catch (err) {
        console.error("An error happened");
    }
}

const ButtonController = (() => {

    const getCityInput = document.getElementById("city-input");
    const getCityButton = document.getElementById("city-btn");

    getCityButton.addEventListener("click", function () {
        DisplayController.showTodayData();
    })
    getCityInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            // Trigger the button element with a click
            getCityButton.click();
        }
    })

    function handleCitySearch () {
        let cityValue = getCityInput.value;
        return cityValue;
    }
    return { handleCitySearch, getCityButton };
})();

const DisplayController = (() => {

    //Container Elements of weather
    const weatherTodayDisplay = document.getElementById("weather-today");
    const weatherOneDay = document.getElementById("1-day");
    const weatherTwoDay = document.getElementById("2-day");
    
    const modalDisplay = document.getElementById("loading-modal");

    //Content Elements of weather
    const cityNameHeader = document.getElementById("city-name-header");
    const currentTemp = document.getElementById("current-temp");
    const minMaxTemp = document.getElementById("min-max-temp");
    const humidity = document.getElementById("humidity");
    const weather = document.getElementById("weather");

    //Elements of forecast 
    const tempOneDay = document.getElementById("1-day-temp")
    const tempTwoDay = document.getElementById("2-day-temp")
    const sunnyOneDay = document.getElementById("1-day-weather")
    const sunnyTwoDay = document.getElementById("2-day-weather")

    //Functions of Todays weather
    async function showTodayData() {
        const searchStr = ButtonController.handleCitySearch();
        modalDisplay.style.display = 'inline-flex';
        weatherData = await getWeatherData(searchStr);
        forecastData = await getForecastData(searchStr);


        createTodayElements(weatherData);
        createForecastElements(forecastData);
        modalDisplay.style.display = 'none';
    }

    function createTodayElements(data) {
        
        cityNameHeader.innerText = data.name;
        currentTemp.innerText = LogicController.convertToCelsius(data.main.temp) + "°C";
        minMaxTemp.innerText = LogicController.convertToCelsius(data.main.temp_min) + "°C / " + LogicController.convertToCelsius(data.main.temp_max) + "°C";
        humidity.textContent = "Humidity: " + data.main.humidity + "%" 
        weather.textContent = "Weather: " + data.weather[0].main;

        changeWeatherBackground(data.weather[0].main, weatherTodayDisplay);


        weatherTodayDisplay.appendChild(cityNameHeader);
        weatherTodayDisplay.appendChild(currentTemp);
        weatherTodayDisplay.appendChild(minMaxTemp);
        weatherTodayDisplay.appendChild(humidity)
        weatherTodayDisplay.appendChild(weather)
    }

    function createForecastElements(data) {
        let hours24Data = data.list[8];
        let hours48Data = data.list[16];

        tempOneDay.innerText = LogicController.convertToCelsius(hours24Data.main.temp) + "°C";
        tempTwoDay.innerText = LogicController.convertToCelsius(hours48Data.main.temp) + "°C";

        let hours24Weather = hours24Data.weather[0].main;
        let hours48Weather = hours48Data.weather[0].main;

        sunnyOneDay.innerText = "Weather: " + hours24Weather
        sunnyTwoDay.innerText = "Weather: " + hours48Weather
        changeWeatherBackground(hours24Weather, weatherOneDay);
        changeWeatherBackground(hours48Weather, weatherTwoDay);
    }


    function changeWeatherBackground(weather, display) {
        if(weather=="Clouds") {
            display.style.backgroundImage = "url('./img/cloudy.jpeg')";
            display.style.color = "var(--header-img)";
        }
        if(weather=="Rain") {
            display.style.backgroundImage = "url('./img/rainy.jpg')";
            display.style.color = "white";
        }
        if(weather=="Clear") {
            display.style.backgroundImage = "url('./img/clear.jpeg')";
            display.style.color = "black";
        }
    }


    return { showTodayData, createTodayElements, createForecastElements }
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
    const defaultForecast = await getForecastData("Dortmund");
    DisplayController.createTodayElements(defaultData);
    DisplayController.createForecastElements(defaultForecast);

}
createDefaultData();