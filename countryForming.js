formCountry = () =>{
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("countryAddingBox")[0].style.display = "block";
}

addCountry = () => {
    let country = getFormedCountry();
    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', 'https://akademija.teltonika.lt/api3/countries', true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(country));
    
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            console.log(this.responseText);
        }
    };
}

getFormedCountry = () => {
    let country = {};
    country.name = document.getElementById("name").value;
    country.area = document.getElementById("area").value;
    country.population = document.getElementById("population").value;
    country.calling_code = document.getElementById("calling_code").value;

    return country;
}

// getFormedCountry = () => {
//     let country = new FormData();

//     country.append('name', document.getElementById("name").value);
//     country.append('area', document.getElementById("area").value);
//     country.append('population', document.getElementById("population").value);
//     country.append('calling_code', document.getElementById("calling_code").value);

//     return country;
// }



// getTime = () => {
//     let h = today.getHours();
//     let min = today.getMinutes(); 
//     let sec = today.getSeconds(); 
//     let dd = String(today.getDate()).padStart(2, '0');
//     let mm = String(today.getMonth() + 1).padStart(2, '0');
//     let yyyy = today.getFullYear();

//     return yyyy + "-" + mm + "-" + dd + " " + h + ":"+ min + ":"+ sec;
// }
