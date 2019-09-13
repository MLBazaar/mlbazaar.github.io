/* Create dataResource cards */
var renderDataResource = function(dataResourceList, searchString="") {
    // Parent div to hold all the dataResource cards
    var mainDiv = document.getElementsByClassName("all-dataResource")[0]

    if (dataResourceList.length > 0) {
        for (var dataResource of dataResourceList) {
            // Div for each dataResource
            var dataResourceDiv = document.createElement('tr')
            
            // DataResource ColIndex
            var colIndex = document.createElement('td')
            colIndex.innerHTML = dataResource.colIndex
            dataResourceDiv.appendChild(colIndex)

            // DataResource colName
            var colName = document.createElement('td')
            colName.innerHTML = dataResource.colName
            dataResourceDiv.appendChild(colName)
            
            // DataResource ColIndex
            var colType = document.createElement('td')
            colType.innerHTML = dataResource.colType
            dataResourceDiv.appendChild(colType)
            
            // DataResource role
            var role = document.createElement('td')
            role.innerHTML = dataResource.role
            dataResourceDiv.appendChild(role)
            
            /* Finally Add the dataResource card to the page */
            mainDiv.appendChild(dataResourceDiv)
        }
    } else {
        var noResultDiv = document.createElement('tr')
        noResultDiv.className = 'no-results'
        
        noResultDiv.innerHTML = '<td colspan="4">No results found</td>'

        var noResultContainer = document.getElementsByClassName("all-dataResource")[0]
        noResultContainer.appendChild(noResultDiv)
    }
}

// Sort the dataResource
var sortFunction = function(a, b) {
    // Sort by colIndex
    var valueA = parseInt(a.colIndex);
    var valueB = parseInt(b.colIndex);
    return (valueA < valueB) ? -1 : 1;
}

// Sort and Render
allDataResource.sort(sortFunction)
renderDataResource(allDataResource)


/* Search implementation starts */
var searchResult = allDataResource  // Search Result initialization

function findMatches(query, repos) {
  if (query === '') {
      return repos
  } else {
      var options = {
        findAllMatches: true,
        threshold: 0.2,
        location: 0,
        distance: 200,
        maxPatternLength: 100,
        minMatchCharLength: 1,
        keys: [
            "colName",
            "colType",
            "role"
        ]
      }
      var fuse = new Fuse(repos, options)
      var result = fuse.search(query)

      // Sort
      result.sort(sortFunction)

      return result
  }
}

var searchBox = document.getElementsByClassName('search-box')[0]

document.addEventListener('keyup', function(event) {
    var searchBox = document.getElementsByClassName('search-box')[0]
    /* Update the list of results with the search results */
    var newDataResourceList = []
    var searchString = searchBox.value.trim()
    searchResult = findMatches(searchString, allDataResource)

    // Remove all the dataResource
    var mainDiv = document.getElementsByClassName("all-dataResource")[0]
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild)
    }

    var noResultContainer = document.getElementsByClassName("all-dataResource")[0]
    while (noResultContainer.firstChild) {
        noResultContainer.removeChild(noResultContainer.firstChild)
    }

    for (var item of searchResult) {
        newDataResourceList.push(item)
    }
    renderDataResource(newDataResourceList, searchString=searchBox.value)
});

$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

var clipboard = new ClipboardJS('.copyToClipboard');

clipboard.on('success', function(e) {
    e.clearSelection();

    $(".copyToClipboard .tooltiptext").css({opacity: 1});
    $("#downloadCode").css({background: "blue", display: "inline"});
    setTimeout(function(){
        $("#downloadCode").css({background: "", display: ""});
        $(".copyToClipboard .tooltiptext").css({opacity: 0});
    }, 1000);
});
$(".content-codes pre").click(function(){
    $("#downloadCode").css({background: "", display: ""});
});