formCountry = () =>{
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("countryAddingBox")[0].style.display = "block";
}

addCountry = () => {
    let country = getFormedCountry();
    let xhttp = new XMLHttpRequest();

    xhttp.open('POST', 'https://akademija.teltonika.lt/api3/countries');
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(country));
    
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            document.getElementsByClassName("countryAddingBox")[0].style.display = "none";

            showMessage(this);

            refreshTable();
        }
    };
}

showMessage = (response) => {
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