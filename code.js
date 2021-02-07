const button = document.getElementById("btn");
let searchText = document.getElementById("search-text");
let Attractions = false;
let Weather = false;
let Alphabetically = false;
const urlToFetch = "https://api.foursquare.com/v2/venues/explore?client_id=FXTNTHIH1BQTKGZUKJ0UU0OGN2O3XBP5TBSLSPRA1RRHPDX3&client_secret=XKW2GPRCYGAMSTT24W15BWCGK01LVG23JAYG33BRFNMYNSFM&v=20210207&limit=10";

document.getElementById("fAttrac").onclick = function(){
    Attractions = Switch(Attractions);
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
        if(!searchText.value.includes("&"))
        {
        const response = await fetch(urlToFetch + "&near=" + searchText.value); 
        if (response.ok) { 
          const jsonResponse = await response.json();
          const attractions = jsonResponse.response.groups[0].items;
          renderResult(attractions); 
          console.log(attractions[0].venue.location.address);
        } else {
          alert(); 
        } 
      }
        }
        catch(error) { 
            // Visa felmeddelande för användare 
          }  
}

function renderResult(list){
    let attractionHtml = "";
    for(let i = 0; i < list.length; i++){
        attractionHtml += 
        `
        <article class="t-center">
            <p>`+list[i].venue.name+`</p>
            <i class="material-icons">free_breakfast</i>
            <p>Address: `+list[i].venue.location.address+`</p>
        </article>
        `
    }
    document.getElementById("city").innerText = searchText.value;
    document.getElementById("attractionsResponse").innerText = "";
    document.getElementById("attractionsResponse").innerHTML = attractionHtml;
    document.getElementById("response").style.visibility = "visible";
            /*<article class="t-center">
                <p>Bhoga</p>
                <i class="material-icons">free_breakfast</i>
                <p>Address: Norra Hamngatan 10, Göteborg</p>
            </article>
            <article class="t-center">
                <p>The Barn</p>
                <i class="material-icons">free_breakfast</i>
                <p>Address: Kyrkogatan 10, Göteborg</p>
            </article>
        </div>
    </section>*/
}