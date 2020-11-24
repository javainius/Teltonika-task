openCountryForm = () =>{
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("countryAddingBox")[0].style.display = "block";
}

addNewCountry = () => {
    let country = getFormedCountry();
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://akademija.teltonika.lt/api3/countries');
    
    sendCountry(xhttp, country);
}

sendCountry = (xhttp, country) => {
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(country));
    
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
    document.getElementsByClassName("countryAddingBox")[0].style.display = "none";

    let messageBox = document.getElementsByClassName("messageBox")[0]
    messageBox.innerHTML = "";

    messageBox.style.display = "block";
    let messageText = document.createTextNode(getMessage(response));
    let message = document.createElement("p");
    message.appendChild(messageText);
    messageBox.appendChild(message);
}

getMessage = (response) => JSON.parse(response.responseText).message;

getFormedCountry = () => {
    let country = {};
    country.name = document.getElementById("name").value;
    country.area = document.getElementById("area").value;
    country.population = document.getElementById("population").value;
    country.calling_code = document.getElementById("calling_code").value;

    return country;
}

exitForm = () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementsByClassName("countryAddingBox")[0].style.display = "none";
    document.getElementsByClassName("messageBox")[0].style.display = "none" 
}

fillCountryForm = (country) => {
    document.getElementById("name").value = country.name;
    document.getElementById("area").value = country.area;
    document.getElementById("population").value = country.population;
    document.getElementById("calling_code").value = country.calling_code;
}

changeButtonToUpdate = (id) => {
    document.getElementById("sendingTrigger").onclick = () => sendUpdatedCountryItem(id);
}

changeButtonToCreate = () => {
    document.getElementById("sendingTrigger").onclick = () => addNewCountry();
}