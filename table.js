fillCountryTable = () => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', 'https://akademija.teltonika.lt/api3/countries?page=1');
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
    deleteAction = getTableData("DELETE")
    deleteAction.id = country.id;

    deleteAction.onclick = () => deleteItem("countries", country.id);
    newRow.appendChild(deleteAction);
    
    newRow.id = country.id;
    table.appendChild(newRow);
}

getTableActions = (itemType, country) =>{
    let tableData = document.createElement("td");

    let textNode = document.createTextNode("DELETE");
    let deleteAction = document.createElement("div");
    deleteAction.appendChild(textNode);
    deleteAction.onclick = () => deleteItem(itemType, country.id);

    textNode = document.createTextNode("UPDATE");
    let updateAction = document.createElement("div");
    updateAction.appendChild(textNode);
    updateAction.onclick = () => updateCountryItem(country);

    tableData.appendChild(textNode);
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

updateCountryItem = (country) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open('PUT', `https://akademija.teltonika.lt/api3/countries/${country.id}`);
    xhttp.send();

    xhttp.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200)
        {
            refreshTable();
        }
    }
}

