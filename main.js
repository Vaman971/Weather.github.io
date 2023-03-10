
// get all necessary elements from the DOM
const app  = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

//Default city when the page loads
let cityInput = "Delhi";

//Add click event to every city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e)=>{
        cityInput = e.target.innerHTML;
        /*Function that fetches and displays all the data from thr weather API */
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

// Add a submit event to the form
form.addEventListener('submit',(e)=>{
    //  If the search bar is empty through an error
    if (search.value.length==0) {
        alert('Please type a city name')
    }
    else{
        //chnage the default city to the city writen in the input field
        cityInput = search.value;

        fetchWeatherData();
        //Remove all text from the input field
        search.value = "";
        //Fade out the app (simple animation)
        app.style.opacity = "0";
    }

    //Prevent default behavior of the form
    e.preventDefault();
});
/*Function that returns a day of the week
(Monday,Tuesday,...) from a date (12 03 2022)*/
function dayOfTheWeek() {
    var weekday =[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "thrusday",
        "Friday",
        "Saturday"
    ];
    var d = new Date();
    return weekday[d.getDay()];
};

/*Function that fetches and displays the data from the weather API */

function fetchWeatherData() {
    /*Fetch the data and dynamically add the city name with templatevliterals */
    //Use your own key
    fetch(`https://api.weatherapi.com/v1/current.json?key=efb7783ac072431cbb2122131221912&q=${cityInput}&aqi=no`)
    /*Take the data (which is in JSON format) and convert it to a regular JS object */
    .then(Response=>Response.json())
    .then(data=>{
        console.log(data);
        
        //Lets start with adding the temperature and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        /*Get the data and time from the city and extract the day ,month,year and time into individual variable */

        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(8,2));

        const time = date.substr(11);
        /* Reformat the date into something more appealing and add to the page */
        // Orignal format: 2021-10-09 17:53
        // New format: 17:53 - Friday 9, 10 2021
        dateOutput.innerHTML = `${dayOfTheWeek(d,m,y)} ${d}, ${m} ${y}`;

        timeOutput.innerHTML= time;
        //Add the name of the city into the page
        nameOutput.innerHTML = data.location.name;

        /*Get the corresponding icon url for the weather and extract a part of it */
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/".length);

        /*Reform the icon url to your own local folder path and add it to the page */
        icon.src = "./icons/"+ iconId;

        //Add the weather details to the page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        //Set default time of day
        let timeOfDay = "Day";
        // get the unique id for each weather condition
        const code = data.current.condition.code;

        //Change to night if its night time in the city
        if (!data.current.is_day) {
            timeOfDay = "Night";
        }
        if(code == 1000){
            // set background image to clear if the weather is clear
            app.style.backgroundImage = `url(./Images/${timeOfDay}/clear.jpg)`;
            //change the button bg color depending on if its day or night
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }
        //Same thing for cloudy weather
        else if (code == 1003 || 
                 code == 1006 ||
                 code == 1009 ||
                 code == 1030 ||
                 code == 1069 ||
                 code == 1087 ||
                 code == 1135 ||
                 code == 1273 ||
                 code == 1276 ||
                 code == 1279 ||
                 code == 1282
            ) {
            app.style.backgroundImage = `url(./Images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = '#fa6d1b';
            if(timeOfDay == "night"){
                btn.style.background = "#181e27";
            }
        }
        // for rainy
        else if ( code == 1063 ||
                  code == 1069 ||
                  code == 1072||
                  code == 1150 ||
                  code == 1153 ||
                  code == 1180 ||
                  code == 1183 ||
                  code == 1186 ||
                  code == 1189 ||
                  code == 1192 ||
                  code == 1195 ||
                  code == 1204 ||
                  code == 1207 ||
                  code == 1240 ||
                  code == 1243 ||
                  code == 1246 ||
                  code == 1249 ||
                  code == 1252 
            ) {
                app.style.backgroundImage = `url(./image/${timeOfDay}/rainly.jpg)`;
                btn.style.background = "#647d75";
                if (timeOfDay=="night") {
                    btn.style.background = "#325c80";
                }
            
        }
        // for snowy
        else{
            app.style.background= `url(./Images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }
        //Fade in the page once all is done
        app.style.opacity = "1";
    })
    // IF the user types a city that doesn't exist. throw an alert
    .catch(()=>{
        alert('City not found, please try again');
        app.style.opacity = "1";
    });

}
// call the function on page load
fetchWeatherData();

//Fade in the page
app.style.opacity = "1";