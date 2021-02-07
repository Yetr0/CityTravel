const button = document.getElementById("btn");
let Attractions = false;
let Weather = false;
let Alphabetically = false;

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

button.onclick = function(){
}