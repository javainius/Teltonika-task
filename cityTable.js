var currentPage = 1;
var order = null;
var filterText = null;
var dateOfCreation = new URLSearchParams(window.location.search).get("date");
var searchText = new URLSearchParams(window.location.search).get("text");
var countryId = new URLSearchParams(window.location.search).get("countryId");
var countryName = new URLSearchParams(window.location.search).get("countryName");

getFormedURL = (isParamsNeeded, isCountryIdNeeded) => {
    let url = new URL("https://akademija.teltonika.lt/api3/cities");

    if(isCountryIdNeeded ){
        url.href += `/${countryId}`;
    }

    if(!isParamsNeeded ){
        return url;
    }
    
    url.searchParams.append("page", currentPage);

    if(order != null){
        url.searchParams.append("order", order);
    }

    if(searchText != null){
        url.searchParams.append("text", searchText);
    }

    if(dateOfCreation != null){
        url.searchParams.append("date", dateOfCreation);
    }

    return url;
}

changeTitle = (title) => document.getElementById("title").innerHTML = title;

fillCityTable = () => {
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', getFormedURL(true, true));
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            let cities = getCities(this);
            let dates = [];

            cities.forEach(city => {
                appendCity(city);
                dates.push(city.created_at.split(" ")[0]);
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

cleanAllCities = () => {
    let table = document.getElementsByTagName("table")[0];

    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild);
    }
}

refreshTable = () => { 
    cleanAllCities();
    fillCityTable();
    cleanDates();
}

cleanDates = () => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    filterContent.innerHTML = "";
}

getCities = (response) => JSON.parse(response.responseText);

appendCity = (city) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getTableData(city.name));
    newRow.appendChild(getTableData(city.area));
    newRow.appendChild(getTableData(city.population));
    newRow.appendChild(getTableData(city.calling_code));
    newRow.appendChild(getTableActions(city));

    table.appendChild(newRow);
}

appendDate = (date) => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    let dateAnchor = document.createElement("a");
    let textNode = document.createTextNode(date);
    dateAnchor.appendChild(textNode);

    dateAnchor.href = `?date=${date}&countryId=${countryId}&countryName=${countryName}`

    if(searchText){
        dateAnchor.href += `&text=${searchText}` 
    }

    filterContent.appendChild(dateAnchor);
}

getTableActions = (item) =>{
    let tableData = document.createElement("td");

    tableData.appendChild(getDeleteAction(item));
    tableData.appendChild(getUpdateAction(item));

    return tableData;
}

getDeleteAction = (item) => {
    let textNode = document.createTextNode("DELETE");
    let deleteAction = document.createElement("div");
    deleteAction.appendChild(textNode);
    deleteAction.onclick = () => deleteItem(item.id);

    return deleteAction;
}

getUpdateAction = (item) => {
    let textNode = document.createTextNode("UPDATE");
    let updateAction = document.createElement("div");
    updateAction.appendChild(textNode);
    updateAction.onclick = () => setCityForm(item);

    return updateAction;
}

getTableData = (data) => {
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(data);
    tableData.appendChild(textNode);

    return tableData;
} 

deleteItem = (id) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `${getFormedURL(false, false)}/${id}`);
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            refreshTable();
        }
    }
}

sendUpdatedCityItem = (id) => {
    let city = getFormedCity();
    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', getFormedURL(false, false) + `/${id}`);
    
    sendCity(xhttp, city);
}

setCityForm = (city) => {
    openCityForm();
    fillCityForm(city);
    changeButtonToUpdate(city.id);
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

appendCity = (city) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getTableData(city.name));
    newRow.appendChild(getTableData(city.area));
    newRow.appendChild(getTableData(city.population));
    newRow.appendChild(getTableData(city.postcode));
    newRow.appendChild(getTableActions(city));

    table.appendChild(newRow);
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