fillCountryTable();

var searchInput = document.getElementById("searchBar");

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
        let locationUrl = "countryTable.html"

        if(params.length > 0){
            locationUrl = locationUrl + params;
        }
        else {
            locationUrl = locationUrl + "?";
        }
        
        window.location = locationUrl + "&text=" + search;
    }
        
  }
});