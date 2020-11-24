
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = () => {}
xhttp.open('GET', 'https://akademija.teltonika.lt/api3/countries');
xhttp.send();

xhttp.onreadystatechange = function (){
    if (this.readyState == 4 && this.status == 200)
    {
        let countries = getCountries(this);
        
        countries.forEach(country => {
            appendCountry(country);
        });
    }
};

getCountries = (response) => JSON.parse(response.responseText).countires;

appendCountry = (country) => {
    let table = document.getElementsByTagName("table")[0];
    let newRow = document.createElement("tr");

    newRow.appendChild(getTableData(country.name));
    newRow.appendChild(getTableData(country.area));
    newRow.appendChild(getTableData(country.population));
    newRow.appendChild(getTableData(country.calling_code));
    
    table.appendChild(newRow);
}

getTableData = (data) =>{
    let tableData = document.createElement("td");
    let textNode = document.createTextNode(data);
    tableData.appendChild(textNode);

    return tableData;
} 
