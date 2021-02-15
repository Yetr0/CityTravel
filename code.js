const button = document.getElementById("btn");
let Attractions = document.getElementById("attractions");
let Weather = document.getElementById("weather");
let weatherRespone = document.getElementById("weatherResponse");
let attractionsResponse = document.getElementById("attractionsResponse");
let searchText = document.getElementById("search-text");
let attractions = false;
let weather = false;
let alphabetically = false;
let PrevSearch = "";
let unsortedAttractions;
let sortedAttractions;
let failed = false;

//byter mellan true och false.
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

//ser ifall användaren söker på samma stad igen och kan skippa att skicka en request till apierna igen.
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
            //Här kommuncierar jag me två olika servrar för att få sevärdheter och väder för den plats som angetts.
            attractions = await getAttractions();
            weather = await getWeather();
            if(attractions != null && weather != null){
                document.getElementById("city").innerText = searchText.value[0].toUpperCase() + searchText.value.slice(1).toLowerCase();
                document.getElementById("failed").style.display = "none";
                renderWeather(weather);
            }
            else{
                document.getElementById("attractionsResponse").innerHTML = "";
                document.getElementById("weatherResponse").innerHTML = "";
                document.getElementById("failed").style.display = "none";
                document.getElementById("city").innerText = `${searchText.value[0].toUpperCase() + searchText.value.slice(1).toLowerCase()} doesn't exist`;
            }
            unsortedAttractions = attractions;
            try{
                sortedAttractions = Array.from(attractions);
                sort(sortedAttractions);
            }
            catch{
                sortedAttractions = null;
                unsortedAttractions = null;
            }
        }
        //filtrerar sevärdheter.
        if(alphabetically && sortedAttractions != null && weatherRespone.innerText != ""){
            renderAttractions(sortedAttractions);
        }
        else if(!alphabetically && unsortedAttractions != null && weatherRespone.innerText != ""){
            renderAttractions(unsortedAttractions);
        }
            viewResult();
        }
        catch(error) {
            //ifall någon av apierna är nere så är servicen nere.
            document.getElementById("failed").style.display = "block";
            document.getElementById("city").innerText = "";
            Weather.style.display = "none";
            Attractions.style.display = "none";
            sortedAttractions = null;
            unsortedAttractions = null;
            document.getElementById("attractionsResponse").innerHTML = "";
                document.getElementById("weatherResponse").innerHTML = "";
          }  
}

function viewResult(){
    if(weather == true && attractions == false && weatherRespone.innerHTML != ""){
        Weather.style.display = "block";
        Attractions.style.display = "none";
    }
    else if(attractions == true && weather == false && attractionsResponse.innerHTML != ""){
        Attractions.style.display = "block";
        Weather.style.display = "none";
    }
    else if(attractionsResponse.innerHTML != "" && weatherRespone.innerHTML != ""){
        Attractions.style.display = "block";
        Weather.style.display = "block";
    }
    else{
        Attractions.style.display = "none";
        Weather.style.display = "none";
    }

}

function sort(array){
    try{
        array.sort(function(a, b){
            if(a.venue.name[0].toUpperCase() < b.venue.name[0].toUpperCase()) { return -1; }
            if(a.venue.name[0].toUpperCase() > b.venue.name[0].toUpperCase()) { return 1; }
            return 0;
        })
    }
    catch{

    }
}

function renderAttractions(attractions){
    //genererar html för de olika sevärdheterna.
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
    attractionsResponse.innerHTML = attractionHtml;
}

function addressSrc(address, city){
    //om inte adressen finns så returneras ingen länk.
    if (address == undefined){
        return "";
    }
    //finns det en adress så returneras en länk till google maps.
    else{
        return 'href="http://www.google.com/maps/place/' + address + "," + city + "\"";
    }
}


function address (address){
    //om inte addressen finns så returneras unknown.
    if(address == undefined){
        return "unknown";
    }
    //finns den så returneras den.
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
    weatherRespone.innerHTML = weatherHtml;
}

//returnerar en ikon för vädret.
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
    //Här kommunicerar jag med väder api:n genom fetch. Jag lägger till staden som användaren söker efter till url:en, sen skickar jag en get request.
        const response = await fetch(url + text);
        //om statusen för svaret är 200 så returnerar den svaret. 
        if(response.ok){
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        //är inte statusen för svaret 200 och svaret inte innehåller någon kropp så returneras null.
        else if(!response.bodyUsed){
            return null;
        }
}

async function getAttractions(){

    let url = "https://api.foursquare.com/v2/venues/explore?client_id=FXTNTHIH1BQTKGZUKJ0UU0OGN2O3XBP5TBSLSPRA1RRHPDX3&client_secret=XKW2GPRCYGAMSTT24W15BWCGK01LVG23JAYG33BRFNMYNSFM&v=20210207&limit=10&near=";
    let text = getSearchText();
    //Här kommunicerar jag med sevärdhets api:n genom fetch. Jag lägger till staden som användaren söker efter till url:en, sen skickar jag en get request.
    const response = await fetch(url + text);
     //om statusen för svaret är 200 så returnerar den en lista av alla sevärdheter.
    if (response.ok) { 
        const jsonResponse = await response.json();
            return jsonResponse.response.groups[0].items; 
    }
    //är inte statusen för svaret 200 och svaret inte innehåller någon kropp så returneras null.
    else if(!response.bodyUsed) {
        return null
        }
}
//tar texten i sökfältet 
function getSearchText(){
    //tar bort "&" ifall det finns så att inte användaren kan använda andra parametrar.
    if(searchText.value.includes("&")){
        let text = searchText.value.replace("&","");
        searchText.value = text;
        return text;
    }
    else{
        return searchText.value;
    }
}