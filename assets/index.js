//declare variables
const searchEl = $("input");
const searchBtn = $("#search-submit-btn");
const sideBarEl = $("#side-bar");



//set event handler for submit button
const newCitySearch = (event) => {
    let newUserInput = searchEl.val();
    //TODO: plug into geocode API
}

searchBtn.on("click", newCitySearch);


//TODO: set event handler for any button inside the side bar


//TODO: geocode API call for lat/lon of city
    //fetch(http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key})


    //let lat
    //let lon



//TODO: concat url string to inlcue lat, lon, and api key
//TODO: fetch weather data from the weather api
    //fetch(api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key})