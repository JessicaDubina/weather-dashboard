//declare variables
const searchEl = $("input");
const searchBtn = $("#search-submit-btn");
const sideBarEl = $("#side-bar");
const fiveDayForecast = $("#5-day-forecast").children();
const historicalCityList = $("#historical-city-list");
const histCityBtn = $('<button type="button" class="list-group-item list-group-item-action border rounded">');

const cityName = $("#selected-city");
const todayTemp = $("#today-temp");
const todayWind = $("#today-wind");
const todayHumidity = $("#today-humidity");

//function to take (city, let, lon) and store in localstorage
const setHistoricalCity = (city, lat, lon) => {
    let dataValFirst = city.charAt(0).toUpperCase();
    let dataValRemaining = city.slice(1)
    let newCity = dataValFirst + dataValRemaining
    localStorage.setItem(newCity, JSON.stringify({"lat": lat, "lon": lon}));
    retrieveStorage();
}

//function to retreive coordinates for a new entered city and use them to retrieve the forecast data
const newCitySearch = (event) => {
    event.preventDefault();

    let newUserInput = searchEl.val().trim();
    let geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + newUserInput + '&limit=1&appid=' + apiKey;
    $.ajax({
        url: geoApiUrl, 
        success: function(result) {
            let lat = result[0].lat;
            let lon = result[0].lon;
            retrieveForecast(lat, lon);
            setHistoricalCity(newUserInput, lat, lon);
            $(searchBtn).off();
        }
    })
}

$(searchBtn).on("click", newCitySearch);

const retrieveForecast = (lat, lon) => {
    let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey +'&units=imperial&lang=en';
    $.ajax({
        url: forecastUrl, 
        success: function(result) {
            //retireve data and print it to the dashboard
            cityName.text(result.city.name + " " + result.list[0].dt_txt.slice(0,10));
            todayTemp.text(result.list[0].main.temp + " \u00B0F");
            todayWind.text(result.list[0].wind.speed + " MPH");
            todayHumidity.text(result.list[0].main.humidity + " %");
        
            //Apply result data to 5 day forecast to 5 day forecast
            for(i = 0; i < fiveDayForecast.length; i++) {
                let nextDay = Number((i + 1) * 8 - 1);
                let nextDayDate = $(fiveDayForecast[i]).children().children("h5");
                let nextDayTemp = $(fiveDayForecast[i]).children().children(".temp");
                let nextDayWind = $(fiveDayForecast[i]).children().children(".wind");
                let nextDayHumidity = $(fiveDayForecast[i]).children().children(".humidity");
                nextDayDate.text(result.list[nextDay].dt_txt.slice(0,10));
                nextDayTemp.text(result.list[nextDay].main.temp  + " \u00B0F");
                nextDayWind.text(result.list[nextDay].wind.speed + " MPH");
                nextDayHumidity.text(result.list[nextDay].main.humidity + " %");
            }
        }
    })
}   

//retrieve localstorage and update history buttons accordingly
const retrieveStorage = () => {
    if (localStorage.length === 0){
        return
    } else {
        for (i = 0; i < localStorage.length; i++) {
            let newCityBtn = histCityBtn;
            newCityBtn.text(localStorage.key(i));
            newCityBtn.clone().appendTo(historicalCityList);
            console.log (newCityBtn.text());
        }
    }
}

//TODO: set event handler for any button inside the side bar

    