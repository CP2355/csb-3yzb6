function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
}
let current = new Date();
let ul = document.querySelector("ul");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

let currentDay = days[current.getDay()];
let currentTime = current.toLocaleTimeString();

ul.innerHTML = `${currentDay} ${currentTime}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let dailyForecast = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        ` 
    <div class="col-2">
    <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
    <img
    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
    alt=""
    width="42"
    />
    <div class="weather-forecast-temperatures">
    <span class="weather-forecast-temperature-high"> ${Math.round(
      forecastDay.temp.max
    )}º </span>
    <span class="weather-forecast-temperature-low">${Math.round(
      forecastDay.temp.min
    )}º</span>
    </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  dailyForecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "e5589c9e52b1240bf60acb6fbca63553";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function citySearch(response) {
  let h2 = document.querySelector("h2");
  h2.innerHTML = response.data.name;
  let newTemp = Math.round(response.data.main.temp);
  let humidity = document.querySelector("#humidity");
  let temperature = document.querySelector("#temperature");
  let windSpeed = document.querySelector("#wind-speed");
  let icon = document.querySelector("#icon");
  temperature.innerHTML = `${newTemp}ºF`;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function cityName(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput.innerHTML = "cityInput.value";
  let city = `${cityInput.value}`;
  let units = "imperial";
  let apiKey = "e5589c9e52b1240bf60acb6fbca63553";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(citySearch);
}

let form = document.querySelector("form");
form.addEventListener("submit", cityName);

function currentTemperature(response) {
  console.log(response.data);

  let h2 = document.querySelector("h2");
  let temperature = document.querySelector("#temperature");
  let weatherDescription = document.querySelector("#weather-description");
  let humidity = document.querySelector("#humidity");
  let windSpeed = document.querySelector("#wind-speed");
  let icon = document.querySelector("#icon");

  h2.innerHTML = response.data.name;
  temperature.innerHTML = Math.round(response.data.main.temp);
  weatherDescription.innerHTML = response.data.weather[0].description;
  humidity.innerHTML = `${response.data.main.humidity}%`;
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function getLocation(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let units = "imperial";
  let apiKey = "e5589c9e52b1240bf60acb6fbca63553";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}
`;

  axios.get(apiUrl).then(currentTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

let locationButton = document.querySelector("#location");
locationButton.addEventListener("click", getCurrentLocation);
