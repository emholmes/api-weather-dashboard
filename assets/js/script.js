let searchHistory = [];
let cities = [];

let captureSearchValue = function(event) {
    event.preventDefault();
    
    let city = document.getElementById("search").value.trim();
    document.getElementById("search").value = "";
   
    lookUpCity(city);
}

let doesCityAlreadyExist = function(cityName) {
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
    buttonLi.appendChild(cityButton);
    document.querySelector("ul").prepend(buttonLi);
}

// city button click event 
document.getElementById("search-history").onclick = function(event) {
    lookUpCity(event.target.innerHTML);
}


let lookUpCity = function(city) {
    
    const weatherApi = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=8a3c0b5830459bf0bc6ee52ea4c39851";

    fetch(weatherApi).then(function(weatherResponse) {
        if (weatherResponse.ok) {
            weatherResponse.json().then(function(data) {
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
                        currentWeather(data);
                        buildForecastCards(data);
                        if (doesCityAlreadyExist(city) === false) {
                            cities.push(city);
                            createCityButton(city);
                        }
                        saveCities();
                    })
                }
            })
        } else {
            // turn in to a modal
            alert("We couldn't find that city, please try again.");
        }
        
    })
}

// have hero/current day weather info display from data[0] 

let currentWeather = function(data) {
    document.querySelector(".current-weather").style.display = "block";
    document.querySelector("#weather-icon").src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + ".png";
    document.getElementById("city-temp").innerHTML = "Temp: " + data.current.temp + " &#176;F";
    document.getElementById("city-wind").innerHTML = "Wind: " + data.current.wind_speed + " MPH";
    document.getElementById("city-humidity").innerHTML = "Humidity: " + data.current.humidity + "%";
    let uvi = data.current.uvi;
    document.getElementById("city-uvi").innerHTML = "UV Index: <span id='uvi'>" + uvi + "</span>";
    addUviBackground(uvi);
}

let addUviBackground = function(uvi) {
    let uviSpan = document.getElementById("uvi");
    if (uvi < 3) {
        uviSpan.classList.add("favorable");
    } 
    else if (uvi < 8) {
        uviSpan.classList.add("moderate");
    }
    else if (uvi < 11) {
        uviSpan.classList.add("severe");
    }
    else {
        uviSpan.classList.add("severe");
    }
}

let emptyUlElement = function() {
    document.querySelector("ul.forecast-cards").innerHTML = "";
}

let buildForecastCards = function(data) {
    let liElements = document.querySelector(".forecast-cards").children;
    let liArray = [];
    for (let li of liElements) {
        liArray.push(li);
    }   
    console.log(liArray);
    emptyUlElement();
    let innerH3 = document.querySelector("h3");
    innerH3.innerHTML = "5-Day Forecast:";
    for (let i = 1; i < 6; i++) {
        let date = new Date(data.daily[i].dt * 1000);
        date = date.toLocaleDateString();
        let listEl = document.createElement("li");
        document.querySelector(".forecast-cards").appendChild(listEl);
        let forecastIcon = "<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' alt='icon for " + data.daily[i].weather[0].description + "'>";
        let forecastTemp = "<p><span>Temp:</span> " + data.daily[i].temp.day + " &#176;F</p>";
        let forecastWind = "<p><span>Wind:</span> " + data.daily[i].wind_speed + " MPH</p>";
        let forecastHumidity = "<p><span>Humidity:</span> " + data.daily[i].humidity + "%</p>";
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

