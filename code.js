const button = document.getElementById("btn");
let Attractions = document.getElementById("attractions");
let Weather = document.getElementById("weather");
let searchText = document.getElementById("search-text");
let attractions = false;
let weather = false;
let alphabetically = false;
let PrevSearch = "";
let failed = false;
let weatherRespone = false;
let attractionResponse = false;


document.getElementById("fAttrac").onclick = function(){
    attractions = Switch(attractions);
}

document.getElementById("fWeather").onclick = function(){
    weather = Switch(weather);
}

document.getElementById("fAlpha").onclick = function(){
    alphabetically = Switch(alphabetically);
}

function Switch(value){
    return value ? false : true;
}

function prevSearch(){
    if(PrevSearch == ""){
        PrevSearch = searchText.value;
        return true;
    }
    else if(PrevSearch != searchText.value){
        PrevSearch = searchText.value;
        return true;
    }
    else{
        return false;
    }
}

button.onclick = async function(){
    try {
        let attractions;
        let weather;
        if(prevSearch()){
            attractions = await getAttractions();
            weather = await getWeather();
            renderAttractions(attractions);
            renderWeather(weather);
        }
        if(attractionResponse && weatherRespone){
            viewResult();
        }
        }
        catch(error) {
            document.getElementById("failed").style.display = "block";
          }  
}

function viewResult(){
    if(weather == true && attractions == false){
        Weather.style.display = "block";
        Attractions.style.display = "none";
    }
    else if(attractions == true && weather == false){
        Attractions.style.display = "block";
        Weather.style.display = "none";
    }
    else{
        Attractions.style.display = "block";
        Weather.style.display = "block";
    }

}

function renderAttractions(attractions){
    let attractionHtml = "";
    for(let i = 0; i < attractions.length; i++){
        attractionHtml += 
        `
        <article class="t-center">
            <p>`+attractions[i].venue.name+`</p>
            <i class="material-icons">free_breakfast</i>
            <a ` + addressSrc(attractions[i].venue.location.address, attractions[i].venue.location.city) + `>Address: `+address(attractions[i].venue.location.address)+`</a>
        </article>
        `;
    }
    let city = searchText.value[0].toUpperCase() + searchText.value.slice(1).toLowerCase();
    document.getElementById("city").innerText = city;
    document.getElementById("attractionsResponse").innerHTML = attractionHtml;
}

function addressSrc(address, city){
    if (address == undefined){
        return "";
    }
    else{
        return 'href="http://www.google.com/maps/place/' + address + "," + city + "\"";
    }
}
function address (address){
    if(address == undefined){
        return "unknown";
    }
    else{
        return address;
    }
}

function renderWeather(weather){
    let weatherHtml =
    ` 
    <article class="t-center">
        <p>` + "söndag" + `</p>
        <p>Temperature: ` + Math.round(weather.main.temp) + `&deg;C</p>
        <p>Conditions: ` + weather.weather[0].main + `</p>
        <i class="material-icons">` + getIcon(weather.weather[0].main) + `</i>
    </article>
    `;
    document.getElementById("weatherResponse").innerHTML = weatherHtml;
}

//wb_sunny
function getIcon(icon){
    switch(icon){
        case "Clear":
            return "wb_sunny";
        case "Clouds": 
            return "clouds";
        case "Snow":
            return "ac_unit";
        case "Rain":
            return "grain";
    }
}


async function getWeather(){
    let url = "https://api.openweathermap.org/data/2.5/weather?&appid=9a3257c2a89bd42ca6b24b5df46f8def&units=metric&q=";
    let text = getSearchText();
        const response = await fetch(url + text);
        if(response.ok){
            const jsonResponse = await response.json();
            weatherRespone = true;
            return jsonResponse;
        }
        else{
            weatherRespone = false;
        }
}

async function getAttractions(){

    let url = "https://api.foursquare.com/v2/venues/explore?client_id=FXTNTHIH1BQTKGZUKJ0UU0OGN2O3XBP5TBSLSPRA1RRHPDX3&client_secret=XKW2GPRCYGAMSTT24W15BWCGK01LVG23JAYG33BRFNMYNSFM&v=20210207&limit=10&near=";
    let text = getSearchText();
    const response = await fetch(url + text);
    if (response.ok) { 
        const jsonResponse = await response.json();
        attractionResponse = true;
            return jsonResponse.response.groups[0].items; 
    }
    else {
        attractionResponse = false;
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