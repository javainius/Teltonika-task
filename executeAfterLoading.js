fillTable();

var searchInput = document.getElementById("searchBar");
searchInput.value = searchText;


searchInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    let search = searchInput.value;

    if(search.length > 0){
        let params = window.location.search
        let locationUrl = "view.html"

        if(params.length > 0){
            locationUrl = locationUrl + removeParam("text" , params);
        }
        else {
            locationUrl = locationUrl + "?";
        }
        
        window.location = locationUrl + "&text=" + search;
    }
        
  }
});

disableDateFilter();
changeDependentElements(countryName);