var currentPage = 1;
var order = null;
var filterText = null;
var dateOfCreation = new URLSearchParams(window.location.search).get("date");
var searchText = new URLSearchParams(window.location.search).get("text");
var countryId = new URLSearchParams(window.location.search).get("countryId");
var countryName = new URLSearchParams(window.location.search).get("countryName");

changeDependentElements = (title) => {
    if(title) {
        document.getElementById("title").innerHTML = title;

        let changeableElements = document.getElementsByClassName("changeable");
        changeableElements[0].innerHTML = "Pašto kodas"
        changeableElements[1].innerHTML = "Pašto kodas"
        changeableElements[2].id = "postcode"
    }      
}

getFormedURL = (isParamsNeeded) => {
    let url = new URL("https://akademija.teltonika.lt/api3/");

    if(countryName){
        url.href += "cities"
    }
    else{
        url.href += "countries"
    }

    if(!isParamsNeeded){
        return url;
    }

    if(countryName){
        url.href += `/${countryId}`;  
    }
    
    url.searchParams.append("page", currentPage);

    if(order){
        url.searchParams.append("order", order);
    }

    if(dateOfCreation){
        url.searchParams.append("date", dateOfCreation);
    }

    if(searchText){
        url.searchParams.append("text", searchText);
    }

    return url;
}

openAddingForm = () =>{
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("addingForm")[0].style.display = "block";
}

cleanTable = () => {
    let table = document.getElementsByTagName("table")[0];

    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild);
    }
}

cleanDates = () => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    filterContent.innerHTML = "";
}

getTableActions = (item) =>{
    let tableData = document.createElement("td");

    tableData.appendChild(getDeleteAction(item));
    tableData.appendChild(getUpdateAction(item));

    return tableData;
}

getUpdateAction = (item) => {
    let textNode = document.createTextNode("UPDATE");
    let updateAction = document.createElement("div");
    updateAction.appendChild(textNode);
    updateAction.onclick = () => setForm(item);

    return updateAction;
}

getTableData = (data) => {
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(data);
    tableData.appendChild(textNode);

    return tableData;
} 

prevPage = () => {
    if(currentPage > 1){
        currentPage--;
        refreshTable();
    }
}

nextPage = () => {
    if(currentPage < 5){
        currentPage++;
        refreshTable();
    }
}

changePage = (pageNumber) => {
    if(currentPage != pageNumber){
        currentPage = pageNumber;
        refreshTable();
    }
}

sortAsc = () => {
    if(order == null || order == "desc")
        order = "asc";
    else
        order = null;

    refreshTable();
} 

sortDesc = () => {
    if(order == null || order == "asc")
        order = "desc";
    else
        order = null;

    refreshTable();
}

disableDateFilter = () => {
    if (dateOfCreation){
        dropBtn = document.getElementsByClassName("dropbtn")[0];
        dropBtn.innerHTML = dateOfCreation;
    }
}

sendItem = (xhttp, item) => {
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(item));
    
    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            showMessage(this);
            refreshTable();
            changeButtonToCreate();
        }
    };
}

getMessage = (response) => JSON.parse(response.responseText).message;


function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

refreshTable = () => { 
    cleanTable();
    fillTable();
    cleanDates();
}

getItems = (response) => countryName ? JSON.parse(response) : JSON.parse(response).countires;

fillTable = () => {
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', getFormedURL(true));
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            let items = getItems(this.responseText);
            let dates = [];

            items.forEach(item => {
                appendItem(item);
                dates.push(item.created_at.split(" ")[0]);
            });

            if(!dateOfCreation){
                dates = [...new Set(dates)];

                dates.forEach( date => {
                    appendDate(date);
                })
            }
        }
    };
}


appendItem = (item) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    if(countryName) newRow.appendChild(getTableData(item.name));
    else newRow.appendChild(getAnchorsToCities(item));

    newRow.appendChild(getTableData(item.area));
    newRow.appendChild(getTableData(item.population));
    newRow.appendChild(getTableData(countryName ? item.postcode : item.calling_code));
    newRow.appendChild(getTableActions(item));

    table.appendChild(newRow);
}

getDeleteAction = (item) => {
    let textNode = document.createTextNode("DELETE");
    let deleteAction = document.createElement("div");
    deleteAction.appendChild(textNode);
    deleteAction.onclick = () => deleteItem(item.id);

    return deleteAction;
}

deleteItem = (id) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `${getFormedURL(false)}/${id}`);
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            refreshTable();
        }
    }
}

addNewItem = () => {
    let item = getFormedItem();
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', getFormedURL(false));
    
    sendItem(xhttp, item);
}

getFormedItem = () => {
    let item = {};
    item.name = document.getElementById("name").value;
    item.area = document.getElementById("area").value;
    item.population = document.getElementById("population").value;

    if(countryName){
        item.postcode = document.getElementById("postcode").value;
        item.country_id = countryId;
    }
    else{
        item.calling_code = document.getElementById("calling_code").value;
    }

    return item;
}

changeButtonToCreate = () => {
    document.getElementById("sendingTrigger").onclick = () => addNewItem();
}

changeButtonToUpdate = (id) => {
    document.getElementById("sendingTrigger").onclick = () => sendUpdatedItem(id);
}

setForm = (city) => {
    openAddingForm();
    fillForm(city);
    changeButtonToUpdate(city.id);
}

fillForm = (country) => {
    document.getElementById("name").value = country.name;
    document.getElementById("area").value = country.area;
    document.getElementById("population").value = country.population;

    if(countryName) document.getElementById("postcode").value = country.postcode;
    else document.getElementById("calling_code").value = country.calling_code;
}

exitForm = () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementsByClassName("addingForm")[0].style.display = "none";
    document.getElementsByClassName("messageBox")[0].style.display = "none" 
}

sendUpdatedItem = (id) => {
    let item = getFormedItem();
    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', getFormedURL(false) + `/${id}`);
    
    sendItem(xhttp, item);
}

showMessage = (response) => {
    document.getElementsByClassName("addingForm")[0].style.display = "none";
    let messageBox = document.getElementsByClassName("messageBox")[0]
    messageBox.innerHTML = "";

    messageBox.style.display = "block";
    let messageText = document.createTextNode(getMessage(response));
    let message = document.createElement("p");
    message.appendChild(messageText);
    messageBox.appendChild(message);
}

appendDate = (date) => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    let dateAnchor = document.createElement("a");
    let textNode = document.createTextNode(date);
    dateAnchor.appendChild(textNode);

    if(countryName){
        dateAnchor.href = `?date=${date}&countryId=${countryId}&countryName=${countryName}`
        
        if(searchText){
            dateAnchor.href += `&text=${searchText}` 
        }
    }
    else{
        if(searchText){
            dateAnchor.href = `?text=${searchText}&date=${date}` 
        }
        else{
            dateAnchor.href = `?date=${date}`
        }
    }



    filterContent.appendChild(dateAnchor);
}

getAnchorsToCities = (country) => {
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(country.name);
    let anchorToCities = document.createElement("a");
    anchorToCities.appendChild(textNode);
    anchorToCities.href = `view.html?countryId=${country.id}&countryName=${country.name}`

    tableData.appendChild(anchorToCities);

    return tableData;
}