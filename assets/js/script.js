let searchHistory = [];

let cityName = "Austin";

const weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=8a3c0b5830459bf0bc6ee52ea4c39851";

fetch(weatherApi).then(function(weatherResponse) {
    if (weatherResponse.ok) {
        weatherResponse.json().then(function(data) {
            console.log(data);
            let cityName = document.getElementById("city-name");
            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            let date = new Date();
            cityName.innerText = data.name + " (" + date.toLocaleDateString("en-US")+ ")";
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=8a3c0b5830459bf0bc6ee52ea4c39851")
        })
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    buildCityDetails(data);
                    buildForecastCards(data);
                })
            }
        })
    }
    
})
// have hero/current day weather info display from data[0] 

let buildCityDetails = function(data) {
    document.querySelector("#weather-icon").src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
    document.getElementById("city-temp").innerHTML = "Temp: " + data.current.temp + " &#176;F";
    document.getElementById("city-wind").innerHTML = "Wind: " + data.current.wind_speed + " MPH";
    document.getElementById("city-humidity").innerHTML = "Humidity: " + data.current.humidity + "%";
    let uvi = data.current.uvi;
    document.getElementById("city-uvi").innerHTML = "UV Index: " + uvi;
    addUviBackground(uvi);
}

let addUviBackground = function(uvi) {
    let cityUvi = document.getElementById("city-uvi");
    if (uvi < 3) {
        cityUvi.classList.add("low");
    } 
    else if (uvi < 6) {
        cityUvi.classList.add("moderate");
    }
    else if (uvi < 8) {
        cityUvi.classList.add("high");
    }
    else if (uvi < 11) {
        cityUvi.classList.add("very-high");
    }
    else {
        cityUvi.classList.add("extreme");
    }
}

let buildForecastCards = function(data) {
    for (let i = 1; i < 6; i++) {
        let date = new Date(data.daily[i].dt * 1000);
        date = date.toLocaleDateString();
        let listEl = document.createElement("li");
        document.querySelector(".forecast-cards").appendChild(listEl);
        let forecastIcon = "<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png'>";
        let forecastTemp = "<p>Temp: " + data.daily[i].temp.day + " &#176;F</p>";
        let forecastWind = "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>";
        let forecastHumidity = "<p>Humidity: " + data.daily[i].humidity + "%</p>";
        listEl.innerHTML = date + forecastIcon + forecastTemp + forecastWind + forecastHumidity;

    }
}