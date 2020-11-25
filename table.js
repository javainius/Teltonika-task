var currentCountryPage = 1;

fillCountryTable = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', `https://akademija.teltonika.lt/api3/countries?page=${currentCountryPage}`);
    xhttp.send();
    let areCountriesAdded = false;

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200 && !areCountriesAdded){
            let countries = getCountries(this);
            areCountriesAdded = true;

            countries.forEach(country => {
                appendCountry(country);
            });
        }
    };
}

cleanAllCountries = () => {
    let table = document.getElementsByTagName("table")[0];

    table.innerHTML = "<tr>" + 
                        "<th>pavadinimas</th>" +
                        "<th>užimamas plotas</th>" +
                        "<th>gyventojų skaičius</th>" +
                        "<th>šalies tel. kodas</th>" + 
                        "<th>veiksmai</th>" +
                      "</tr>";
}

refreshTable = () => { 
    cleanAllCountries();
    fillCountryTable();
}

getCountries = (response) => JSON.parse(response.responseText).countires;

appendCountry = (country) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getTableData(country.name));
    newRow.appendChild(getTableData(country.area));
    newRow.appendChild(getTableData(country.population));
    newRow.appendChild(getTableData(country.calling_code));
    newRow.appendChild(getTableActions("countries", country));
    
    newRow.id = country.id;
    table.appendChild(newRow);
}

getTableActions = (itemType, item) =>{
    let tableData = document.createElement("td");

    tableData.appendChild(getDeleteAction(itemType, item));
    tableData.appendChild(getUpdateAction(itemType, item));

    return tableData;
}

getDeleteAction = (itemType, item) => {
    let textNode = document.createTextNode("DELETE");
    let deleteAction = document.createElement("div");
    deleteAction.appendChild(textNode);
    deleteAction.onclick = () => deleteItem(itemType, item.id);

    return deleteAction;
}

getUpdateAction = (itemType, item) => {
    let textNode = document.createTextNode("UPDATE");
    let updateAction = document.createElement("div");
    updateAction.appendChild(textNode);
    updateAction.onclick = () => setCountryForm(item);

    return updateAction;
}

getTableData = (data) =>{
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(data);
    tableData.appendChild(textNode);

    return tableData;
} 

deleteItem = (itemType, id) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `https://akademija.teltonika.lt/api3/${itemType}/${id}`);
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
    xhttp.open('PUT', `https://akademija.teltonika.lt/api3/countries/${id}`);
    
    sendCountry(xhttp, country);
}

setCountryForm = (country) => {
    openCountryForm();
    fillCountryForm(country);
    changeButtonToUpdate(country.id);
}

prevPage = () => {
    if(currentCountryPage > 1){
        currentCountryPage--;
        refreshTable();
    }
}

nextPage = () => {
    if(currentCountryPage < 5){
        currentCountryPage++;
        refreshTable();
    }
}

changePage = (pageNumber) => {
    if(currentCountryPage != pageNumber){
        currentCountryPage = pageNumber;
        refreshTable();
    }
}