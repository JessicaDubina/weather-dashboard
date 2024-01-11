$(document).ready(function () {

    //declare variables
    const searchEl = $("input");
    const searchBtn = $("#search-submit-btn");
    const fiveDayForecast = $("#5-day-forecast").children();
    const historicalCityList = $("#historical-city-list");

    const cityName = $("#selected-city");
    const todayTemp = $("#today-temp");
    const todayWind = $("#today-wind");
    const todayHumidity = $("#today-humidity");
    const todayIcon = $("#today-icon");
    const todayUv = $("#today-uv");

    //function to take (city, let, lon) and store in localstorage
    const setHistoricalCity = (city, lat, lon) => {
        let dataValFirst = city.charAt(0).toUpperCase();
        let dataValRemaining = city.slice(1)
        let newCity = dataValFirst + dataValRemaining
        localStorage.setItem(newCity, JSON.stringify({"lat": lat, "lon": lon}));
        addNewCity(city);
    }

    //function to retreive coordinates for a new entered city and use them to retrieve the forecast data
    const newCitySearch = (event) => {
        event.preventDefault();

        let newUserInput = searchEl.val().trim();
        let geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + newUserInput + '&limit=1&appid=' + "6eb2a60c8ef2629298c5c56ce13078f3";
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

    //function to retrieve the forecast data based on the provided coords
    const retrieveForecast = (lat, lon) => {
        let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + "6eb2a60c8ef2629298c5c56ce13078f3" +'&units=imperial&lang=en';
        $.ajax({
            url: forecastUrl, 
            success: function(result) {
                //retrieve data and print it to the dashboard
                console.log(result);
                cityName.text(result.city.name + " " + result.list[0].dt_txt.slice(0,10));
                $(todayIcon).attr("src", "https://openweathermap.org/img/wn/" + result.list[0].weather[0].icon + "@2x.png");
                todayTemp.text("Temp: " + result.list[0].main.temp + " \u00B0F");
                todayWind.text("Wind: " + result.list[0].wind.speed + " MPH");
                todayHumidity.text("Humidity: " + result.list[0].main.humidity + " %");
            
                //Apply result data to 5 day forecast to 5 day forecast
                for(i = 0; i < fiveDayForecast.length; i++) {
                    let nextDay = Number((i + 1) * 8 - 1);
                    let nextDayDate = $(fiveDayForecast[i]).children().children("h5");
                    let nextDayIcon = $(fiveDayForecast[i]).children().children("img")
                    let nextDayTemp = $(fiveDayForecast[i]).children().children(".temp");
                    let nextDayWind = $(fiveDayForecast[i]).children().children(".wind");
                    let nextDayHumidity = $(fiveDayForecast[i]).children().children(".humidity");
                    nextDayDate.text(result.list[nextDay].dt_txt.slice(0,10));
                    $(nextDayIcon).attr("src", "https://openweathermap.org/img/wn/" + result.list[nextDay].weather[0].icon + ".png");
                    nextDayTemp.text("Temp: " + result.list[nextDay].main.temp  + " \u00B0F");
                    nextDayWind.text("Wind: " + result.list[nextDay].wind.speed + " MPH");
                    nextDayHumidity.text("Humidity: " + result.list[nextDay].main.humidity + " %");
                }
            }
        })
    }   

    //add new city input from search bar to historical list
    const addNewCity = (newCity) => {
        const newCityBtn = $('<button type="button" class="history-button list-group-item list-group-item-action border rounded px-3 bg-secondary opacity-75 text-white">');
        newCityBtn.text(newCity);
        newCityBtn.attr("id", newCity);
        newCityBtn.clone().appendTo(historicalCityList);
        newCityBtn.on("click", grabCityCoords);
    }

    //retrieve localstorage and update history buttons accordingly
    const retrieveStorage = () => {
        if (localStorage.length === 0){
            return
        } else {
            for (i = 0; i < localStorage.length; i++) {
                let newCityBtn = $('<button type="button" class="history-button list-group-item list-group-item-action border rounded bg-secondary opacity-75 text-white">');
                newCityBtn.text(localStorage.key(i));
                newCityBtn.attr("id", localStorage.key(i));
                newCityBtn.clone().appendTo(historicalCityList);
                $(`#${localStorage.key(i)}`).on("click", grabCityCoords);
            }
        }
    }

    //function to retrieve the coords for a city stored in localstorage
    const grabCityCoords = (event) => {
        //console.log(event.target);
        let city = $(event.target).attr("id");
        let result = JSON.parse(localStorage.getItem(city));
        let lat = result.lat;
        let lon = result.lon;
        console.log(lat, lon);
        retrieveForecast(lat, lon);
    }

    $(searchBtn).on("click", newCitySearch);
    //$(histCityBtn).on("click", grabCityCoords);

    retrieveStorage();
})