let searchHistory = [];
let cities = [];

let captureSearchValue = function(event) {
    event.preventDefault();
    
    let city = document.getElementById("search").value.trim();
    document.getElementById("search").value = "";
   
    getCityCoordinates(city);
}

// check if city is already in search history
let inSearchHistory = function(cityName) {
    let found = false;
    for (let i = 0; i < cities.length; i++) {
        if (cities[i] === cityName) {
            found = true;
        }
    }
    return found;
}

let createCityButton = function(cityName) {
    let buttonLi = document.createElement("li");
    let cityButton = document.createElement("button");
    cityButton.classList.add("city-button");
    cityButton.setAttribute("type", "button");
    cityButton.innerHTML = cityName;
    cityButton.addEventListener("click", cityButtonClicked);
    buttonLi.appendChild(cityButton);
    document.querySelector("ul").prepend(buttonLi);
}

let cityButtonClicked = function(event) {
    getCityCoordinates(event.target.innerHTML);
}

// use Geocoding API to get lat/lon coordinates from city name
let getCityCoordinates = function(city) {
    const geocodingApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=8a3c0b5830459bf0bc6ee52ea4c39851";
    
    fetch(geocodingApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                let cityCoordinates = "lat=" + data[0].lat + "&lon=" + data[0].lon;
                let cityName = data[0].local_names.en
                if (cityName === undefined) {
                    cityName = data[0].name;
                } else {
                    cityName = data[0].local_names.en;
                }
                if (inSearchHistory(city) === false) {
                    cities.push(city);
                    createCityButton(city);
                }
                getWeatherInfo(cityCoordinates, cityName);
            });
        } else {
            alert("We couldn't find that city, please try again.");
        }
    });
}

// use coordinates to get weather information
let getWeatherInfo = function(coordinates, cityName) {
    const weatherApi = "https://api.openweathermap.org/data/2.5/onecall?" + coordinates
     + "&units=imperial&appid=8a3c0b5830459bf0bc6ee52ea4c39851"

    fetch(weatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                buildCurrentWeather(data, cityName);
                buildForecastCards(data);
                saveCities();
            });
        } else {
            alert("We couldn't find that city, please try again.");
        }
    });
}

let buildCurrentWeather = function(data, cityName) {
    document.querySelector(".current-weather").style.display = "block";
    let date = new Date();
    document.querySelector("#city-name").innerHTML = cityName + " (" + date.toLocaleDateString("en-US")+ ")";
    document.querySelector("#weather-icon").src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
    document.getElementById("city-temp").innerHTML = "Temp: " + data.current.temp + " &#176;F";
    document.getElementById("city-wind").innerHTML = "Wind: " + data.current.wind_speed + " MPH";
    document.getElementById("city-humidity").innerHTML = "Humidity: " + data.current.humidity + "%";
    document.getElementById("city-uvi").innerHTML = "UV Index: <span id='uvi'>" + data.current.uvi + "</span>";
    addUviBackground(data.current.uvi);
}

let addUviBackground = function(uvi) {
    let uviSpan = document.getElementById("uvi");
    if (uvi < 3) {
        uviSpan.classList.add("favorable");
    } 
    else if (uvi < 8) {
        uviSpan.classList.add("moderate");
    }
    else {
        uviSpan.classList.add("severe");
    }
}

let emptyUlElement = function() {
    document.querySelector("ul.forecast-cards").innerHTML = "";
}

let buildForecastCards = function(data) {
    emptyUlElement();
    document.querySelector(".forecast").style.display = "block";
    for (let i = 1; i < 6; i++) {
        let date = new Date(data.daily[i].dt * 1000);
        date = date.toLocaleDateString();
        let listEl = document.createElement("li");
        document.querySelector(".forecast-cards").appendChild(listEl);
        let forecastIcon = "<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' alt='icon for " + data.daily[i].weather[0].description + "'>";
        let forecastTemp = "<p>Temp: " + data.daily[i].temp.day + " &#176;F</p>";
        let forecastWind = "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>";
        let forecastHumidity = "<p>Humidity: " + data.daily[i].humidity + "%</p>";
        listEl.innerHTML = "<p>" + date + "</p>" +  forecastIcon + forecastTemp + forecastWind + forecastHumidity;
    }
}

let saveCities = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

let loadCities = function() {
    let savedCities = JSON.parse(localStorage.getItem("cities"));
    if (!savedCities) {
        return;
    }
    for (let city of savedCities) {
        cities.push(city);
        createCityButton(city);
    }
}
loadCities();

document.getElementById("submit-search").addEventListener("click", captureSearchValue);

