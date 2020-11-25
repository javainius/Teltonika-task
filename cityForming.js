openCityForm = () =>{
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("cityAddingBox")[0].style.display = "block";
}

addNewCity = () => {
    let city = getFormedCity();
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', `https://akademija.teltonika.lt/api3/cities/`);
    
    sendCity(xhttp, city);
}

sendCity = (xhttp, city) => {
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(city));
    
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            showMessage(this);
            refreshTable();
            changeButtonToCreate();
        }
    };
}

showMessage = (response) => {
    document.getElementsByClassName("cityAddingBox")[0].style.display = "none";

    let messageBox = document.getElementsByClassName("messageBox")[0]
    messageBox.innerHTML = "";

    messageBox.style.display = "block";
    let messageText = document.createTextNode(getMessage(response));
    let message = document.createElement("p");
    message.appendChild(messageText);
    messageBox.appendChild(message);
}

getMessage = (response) => JSON.parse(response.responseText).message;

getFormedCity = () => {
    let city = {};
    city.name = document.getElementById("name").value;
    city.area = document.getElementById("area").value;
    city.population = document.getElementById("population").value;
    city.postcode = document.getElementById("postcode").value;
    city.country_id = currentCountryId;

    return city;
}

exitForm = () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementsByClassName("cityAddingBox")[0].style.display = "none";
    document.getElementsByClassName("messageBox")[0].style.display = "none" 
}

fillCityForm = (city) => {
    document.getElementById("name").value = city.name;
    document.getElementById("area").value = city.area;
    document.getElementById("population").value = city.population;
    document.getElementById("postcode").value = city.postcode;
}

changeButtonToUpdate = (id) => {
    document.getElementById("sendingTrigger").onclick = () => sendUpdatedCityItem(id);
}

changeButtonToCreate = () => {
    document.getElementById("sendingTrigger").onclick = () => addNewCity();
}

