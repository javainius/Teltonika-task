var currentPage = 1;
const baseURL = "https://akademija.teltonika.lt/api3/";

changeTitle = (title) => {
    let text = document.getElementById("title").innerText;
    document.getElementById("title").innerText = title;
}

fillCitiesTable = (id) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', `https://akademija.teltonika.lt/api3/cities/${id}`);
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            let cities = getCities(this);

            cities.forEach(city => {
                appendCity(city);
            });
        }
    };
}

fillCountryTable = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', `https://akademija.teltonika.lt/api3/countries?page=${currentPage}`);
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            let countries = getCountries(this);

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

    newRow.appendChild(getAnchorsToCities(country));
    newRow.appendChild(getTableData(country.area));
    newRow.appendChild(getTableData(country.population));
    newRow.appendChild(getTableData(country.calling_code));
    newRow.appendChild(getTableActions("countries", country));

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

getCities = (response) => JSON.parse(response.responseText);

appendCity = (city) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getTableData(city.name));
    newRow.appendChild(getTableData(city.area));
    newRow.appendChild(getTableData(city.population));
    newRow.appendChild(getTableData(city.postcode));
    newRow.appendChild(getTableActions("cities", city));

    table.appendChild(newRow);
}

fillThePage = () => {
    if(window.location.search.length > 0){
        let params = new URLSearchParams(window.location.search);
        let id = params.get('countryId');
        let countryName = params.get('countryName');
    
        fillCitiesTable(id);
        changeTitle(countryName);
    }
}
