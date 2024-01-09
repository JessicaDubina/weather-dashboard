//declare variables
const searchEl = $("input");
const searchBtn = $("#search-submit-btn");
const sideBarEl = $("#side-bar");
let cityName = $("#selected-city");
let todayTemp = $("#today-temp");
let todayWind = $("#today-wind");
let todayHumidity = $("#today-humidity");



//set event handler for submit button
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
            console.log(result);
            debugger
            //retireve data and print it to the dashboard
            cityName.text(result.city.name + " " + result.list[0].dt_txt.slice(0,10));
            todayTemp.text(result.list[0].main.temp + " \u00B0F");
            todayWind.text(result.list[0].wind.speed + " MPH");
            todayHumidity.text(result.list[0].main.humidity + " %");
        }
    })
}    

//TODO: set event handler for any button inside the side bar





//TODO: concat url string to inlcue lat, lon, and api key
//TODO: fetch weather data from the weather api
    //fetch(api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key})