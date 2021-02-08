const button = document.getElementById("btn");
const Attractions = document.getElementById("attractionsResponse");
const WeatherR = document.getElementById("weatherResponse");
let searchText = document.getElementById("search-text");
let attractions = false;
let Weather = false;
let Alphabetically = false;


document.getElementById("fAttrac").onclick = function(){
    attractions = Switch(attractions);
}

document.getElementById("fWeather").onclick = function(){
    Weather = Switch(Weather);
}

document.getElementById("fAlpha").onclick = function(){
    Alphabetically = Switch(Alphabetically);
}

function Switch(value){
    return value ? false : true;
}

button.onclick = async function(){
    try {
        let attractions = await getAttractions();
        console.log(attractions);
        renderResult(attractions);
        }
        catch(error) { 
            // Visa felmeddelande för användare 
          }  
}
/*<article class="t-center">
                            <p>Thursday</p>
                            <p>Temperature: -2&deg;C</p>
                            <p>Conditions: overcast clouds</p>
                            <i class="material-icons">clouds</i>
                        </article> */



function renderResult(attractions){
    let attractionHtml = "";
    for(let i = 0; i < attractions.length; i++){
        attractionHtml += 
        `
        <article class="t-center">
            <p>`+attractions[i].venue.name+`</p>
            <i class="material-icons">free_breakfast</i>
            <a href="http://www.google.com/maps/place/` + attractions[i].venue.location.address + ", " + attractions[i].venue.location.city + `">Address: `+attractions[i].venue.location.address+`</a>
        </article>
        `;
    }
    /*let weatherHtml = 
    `
    <article class="t-center">
        <p>` + "söndag" + `</p>
        <p>Temperature: ` + Math.round(weather.main.temp) + `&deg;C</p>
        <p>Conditions: ` + weather.weather[0].main + `</p>
        <i class="material-icons">` + getIcon(weather.weather[0].main) + `</i>
    </article>
    `;*/
    let city = searchText.value[0].toUpperCase() + searchText.value.slice(1).toLowerCase();
    document.getElementById("city").innerText = city;
    //document.getElementById("weatherResponse").innerHTML = weatherHtml;
    document.getElementById("attractionsResponse").innerHTML = attractionHtml;
    document.getElementById("response").style.visibility = "visible";
}


function getIcon(icon){
    switch(icon){
        case "Clear":
            return "sun";
    }
}


async function getData(urlToFetch){
    let url = "";
 if(urlToFetch == 2){
        url = "https://api.openweathermap.org/data/2.5/weather?&appid=9a3257c2a89bd42ca6b24b5df46f8def&units=metric&q=";
    }
        const response = await fetch(url + text); 
}

async function getAttractions(){

    let url = "https://api.foursquare.com/v2/venues/explore?client_id=FXTNTHIH1BQTKGZUKJ0UU0OGN2O3XBP5TBSLSPRA1RRHPDX3&client_secret=XKW2GPRCYGAMSTT24W15BWCGK01LVG23JAYG33BRFNMYNSFM&v=20210207&limit=10&near=";
    let text = getSearchText();
    const response = await fetch(url + text);
    if (response.ok) { 
        const jsonResponse = await response.json();
        console.log(jsonResponse);
            let attractions = jsonResponse.response.groups[0].items; 
          return attractions;
    }
    else {
        alert("Something went wrong"); 
        }
}

function getSearchText(){
    if(searchText.value.includes("&")){
        let text = searchText.value.replace("&","");
        searchText.value = text;
        return text;
    }
    else{
        return searchText.value;
    }
}