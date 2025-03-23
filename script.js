const API_KEY = "41288bcd03f743bfab4225439231704"; // Your WeatherAPI key
const searchInput = document.querySelector(".sidebar input");
const tempDisplay = document.querySelector(".sidebar h1");
const weatherCondition = document.querySelector(".sidebar p:nth-of-type(2)");
const rainChance = document.querySelector(".sidebar p:nth-of-type(3)");
const locationDisplay = document.querySelector(".location p");
const weekForecast = document.querySelector(".week-forecast");
const highlights = document.querySelector(".highlights");
const tempToggle = document.querySelector(".toggle");
let isCelsius = true;

// Fetch weather data from WeatherAPI
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes&alerts=no`
        );
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        alert("Error fetching weather data!");
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    if (!data || data.error) {
        alert("City not found!");
        return;
    }

    // Update Sidebar Info
    tempDisplay.innerHTML = `${Math.round(data.current.temp_c)}°C`;
    weatherCondition.innerHTML = `<i class="fa-solid fa-cloud"></i> ${data.current.condition.text}`;
    rainChance.innerHTML = `<i class="fa-solid fa-umbrella"></i> Rain - ${data.forecast.forecastday[0].day.daily_chance_of_rain}%`;
    locationDisplay.innerText = `${data.location.name}, ${data.location.country}`;

    // Update Highlights
    highlights.innerHTML = `
        <div class="highlight"><p>UV Index</p><h3>${data.current.uv}</h3></div>
        <div class="highlight"><p>Wind Status</p><h3>${data.current.wind_kph} km/h</h3></div>
        <div class="highlight"><p>Humidity</p><h3>${data.current.humidity}%</h3></div>
        <div class="highlight"><p>Visibility</p><h3>${data.current.vis_km} km</h3></div>
        <div class="highlight"><p>Air Quality</p><h3>${data.current.air_quality.pm10.toFixed(1)}</h3></div>
        <div class="highlight"><p>Sunrise & Sunset</p>
            <h3>${data.forecast.forecastday[0].astro.sunrise} - ${data.forecast.forecastday[0].astro.sunset}</h3>
        </div>
    `;

    // Update Weekly Forecast
    updateWeeklyForecast(data.forecast.forecastday);
}

// Update Weekly Forecast UI
function updateWeeklyForecast(forecast) {
    weekForecast.innerHTML = "";

    forecast.forEach((day) => {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");

        let date = new Date(day.date);
        let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        dayElement.innerHTML = `
            <p>${dayName}</p>
            <img src="https:${day.day.condition.icon}">
            <p>${Math.round(day.day.maxtemp_c)}° - ${Math.round(day.day.mintemp_c)}°</p>
        `;
        weekForecast.appendChild(dayElement);
    });
}

// Search Functionality
searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchWeather(searchInput.value);
    }
});

// Temperature Unit Toggle
tempToggle.addEventListener("click", () => {
    let currentTemp = parseFloat(tempDisplay.innerText);
    if (isCelsius) {
        tempDisplay.innerHTML = `${Math.round(currentTemp * 9/5 + 32)}°F`;
        tempToggle.innerHTML = `<span>°C</span> | <span class="active">°F</span>`;
    } else {
        tempDisplay.innerHTML = `${Math.round((currentTemp - 32) * 5/9)}°C`;
        tempToggle.innerHTML = `<span class="active">°C</span> | <span>°F</span>`;
    }
    isCelsius = !isCelsius;
});

// Load default city weather
fetchWeather("Akola");
