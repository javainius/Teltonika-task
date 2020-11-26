fillCityTable();

var searchInput = document.getElementById("searchBar");
searchInput.value = searchText;

// Execute a function when the user releases a key on the keyboard
searchInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    let search = searchInput.value;

    if(search.length > 0){
        let params = window.location.search
        let locationUrl = "cityTable.html"

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

disableDateFilter();
changeTitle(countryName);
