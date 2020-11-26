var currentPage = 1;
var order = null;
var dateOfCreation = new URLSearchParams(window.location.search).get("date");
var searchText = new URLSearchParams(window.location.search).get("text");


getFormedURL = (isParamsNeeded) => {
    let url = new URL("https://akademija.teltonika.lt/api3/countries");

    if(!isParamsNeeded){
        return url;
    }
    
    url.searchParams.append("page", currentPage);

    if(order != null){
        url.searchParams.append("order", order);
    }

    if(dateOfCreation != null){
        url.searchParams.append("date", dateOfCreation);
    }

    if(searchText != null){
        url.searchParams.append("text", searchText);
    }

    return url;
}

fillCountryTable = () => {
    let xhttp = new XMLHttpRequest();
    
    xhttp.open('GET', getFormedURL(true));
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            let countries = getCountries(this);
            let dates = [];

            countries.forEach(country => {
                appendCountry(country);
                dates.push(country.created_at.split(" ")[0]);
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

cleanAllCountries = () => {
    let table = document.getElementsByTagName("table")[0];

    while (table.childNodes.length > 2) {
        table.removeChild(table.lastChild);
    }
}

refreshTable = () => { 
    cleanAllCountries();
    fillCountryTable();
    cleanDates();
}

cleanDates = () => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    filterContent.innerHTML = "";
}

getCountries = (response) => JSON.parse(response.responseText).countires;

appendCountry = (country) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getAnchorsToCities(country));
    newRow.appendChild(getTableData(country.area));
    newRow.appendChild(getTableData(country.population));
    newRow.appendChild(getTableData(country.calling_code));
    newRow.appendChild(getTableActions(country));

    table.appendChild(newRow);
}

appendDate = (date) => {
    let filterContent = document.getElementsByClassName("dropdown-content")[0];
    let dateAnchor = document.createElement("a");
    let textNode = document.createTextNode(date);
    dateAnchor.appendChild(textNode);

    if(searchText){
        dateAnchor.href = `?text=${searchText}&date=${date}` 
    }
    else{
        dateAnchor.href = `?date=${date}`
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
    updateAction.onclick = () => setCountryForm(item);

    return updateAction;
}

getAnchorsToCities = (country) => {
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(country.name);
    let anchorToCities = document.createElement("a");
    anchorToCities.appendChild(textNode);
    anchorToCities.href = `cityTable.html?countryId=${country.id}&countryName=${country.name}`

    tableData.appendChild(anchorToCities);

    return tableData;
}

getTableData = (data) => {
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(data);
    tableData.appendChild(textNode);

    return tableData;
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

sendUpdatedCountryItem = (id) => {
    let country = getFormedCountry();
    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', `${getFormedURL(false)}/${id}`);
    
    sendCountry(xhttp, country);
}

setCountryForm = (country) => {
    openCountryForm();
    fillCountryForm(country);
    changeButtonToUpdate(country.id);
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
