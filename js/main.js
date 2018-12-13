/* Create dataset cards */
var renderDataset = function(datasetList, searchString="") {
    // Parent div to hold all the dataset cards
    var mainDiv = document.getElementsByClassName("all-dataset")[0]

    // Refer this for DOM manipulation with JS https://stackoverflow.com/questions/14094697/how-to-create-new-div-dynamically-change-it-move-it-modify-it-in-every-way-po
    if (datasetList.length > 0) {
        for (var dataset of datasetList) {
            // Div for each dataset
            var datasetDiv = document.createElement('div')
            datasetDiv.className = "dataset-item"

            // Row Name
            var rowDiv = document.createElement('div')
            rowDiv.className = "row"
            var colLeftDiv = document.createElement('div')
            colLeftDiv.className = "row-left"
            var colRightDiv = document.createElement('div')
            colRightDiv.className = "row-right"
            
            // Dataset Name
            var labelDiv = document.createElement('label')
            labelDiv.className = "title"
            labelDiv.innerHTML = "Name"
            var nameDiv = document.createElement('a')
            nameDiv.className = "page-link"
            nameDiv.innerHTML = dataset.datasetName
            nameDiv.href = dataset.dataset_path
            nameDiv.target = "_self"
            colLeftDiv.appendChild(labelDiv)
            colRightDiv.appendChild(nameDiv)
            rowDiv.appendChild(colLeftDiv)
            rowDiv.appendChild(colRightDiv)
            datasetDiv.appendChild(rowDiv)

            // Row Description
            var rowDiv = document.createElement('div')
            rowDiv.className = "row"
            var colLeftDiv = document.createElement('div')
            colLeftDiv.className = "row-left"
            var colRightDiv = document.createElement('div')
            colRightDiv.className = "row-right"
            
            // Dataset Description (HTML version)
            var labelDiv = document.createElement('label')
            labelDiv.className = "title"
            labelDiv.innerHTML = "Description"
            var descriptionDiv = document.createElement('p')
            descriptionDiv.className = "content-area"
            descriptionDiv.innerHTML = dataset.description
            //colLeftDiv.appendChild(labelDiv)
            //colRightDiv.appendChild(descriptionDiv)
            //rowDiv.appendChild(colLeftDiv)
            //rowDiv.appendChild(colRightDiv)
            //datasetDiv.appendChild(rowDiv)

            // Row Source URI
            var rowDiv = document.createElement('div')
            rowDiv.className = "row"
            var colLeftDiv = document.createElement('div')
            colLeftDiv.className = "row-left"
            var colRightDiv = document.createElement('div')
            colRightDiv.className = "row-right"
            
            // Source URI
            var labelDiv = document.createElement('label')
            labelDiv.className = "title"
            labelDiv.innerHTML = "SourceURI"
            var sourceDiv = document.createElement('a')
            sourceDiv.className = "sourceuri-link"
            sourceDiv.innerHTML = dataset.sourceURI
            sourceDiv.href = dataset.sourceURI
            sourceDiv.target = "_blank"
            colLeftDiv.appendChild(labelDiv)
            colRightDiv.appendChild(sourceDiv)
            rowDiv.appendChild(colLeftDiv)
            rowDiv.appendChild(colRightDiv)
            datasetDiv.appendChild(rowDiv)
            
            // Row View Detail
            var rowDiv = document.createElement('div')
            rowDiv.className = "row"
            var rowDetailDiv = document.createElement('div')
            rowDetailDiv.className = "row-detail"

            // Source URI
            var actionDiv = document.createElement('a')
            actionDiv.className = "btn-view-detail"
            actionDiv.innerHTML = "View Details"
            actionDiv.href = dataset.dataset_path
            actionDiv.target = "_self"
            rowDetailDiv.appendChild(actionDiv)
            rowDiv.appendChild(rowDetailDiv)
            datasetDiv.appendChild(rowDiv)
            
            /* Finally Add the dataset card to the page */
            mainDiv.appendChild(datasetDiv)
        }
    } else {
        var noResultDiv = document.createElement('div')
        noResultDiv.className = 'no-results'

        var noResultPara = document.createElement('p')
        noResultPara.innerHTML = "No results found"
        noResultDiv.appendChild(noResultPara)

        var noResultContainer = document.getElementsByClassName("no-results-container")[0]
        noResultContainer.appendChild(noResultDiv)
    }
}

// Sort the dataset
var sortFunction = function(a, b) {
    // Sort by Name
    var textA = a.datasetName.toUpperCase();
    var textB = b.datasetName.toUpperCase();
    // Sort by recently pushedAt
    var deltaA = (new Date) - Date.parse(a.time)
    var deltaB = (new Date) - Date.parse(b.time)
    return (textA < textB) ? -1 : (textA > textB) ? 1 : (deltaA>=deltaB?1:-1)
}

// Sort and Render
allDataset.sort(sortFunction)
renderDataset(allDataset)


/* Search implementation starts */
var searchResult = allDataset  // Search Result initialization

function findMatches(query, repos, keys = ["datasetName"]) {
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
        keys: keys
      }
      var fuse = new Fuse(repos, options)
      var result = fuse.search(query)

      // Sort
      result.sort(sortFunction)

      return result
  }
}
function resetSearch(){
    //reset input
    var searchBox = document.getElementsByClassName('search-box')[0]
    searchBox.value = '';
    
    filterSubmit();
}
function resetFilter(){
    //reset input
    var searchName = document.getElementsByClassName('search-name')[0]
    searchName.value = '';
    var searchDomain = document.getElementsByClassName('search-domain')[0]
    searchDomain.value = '';
    var searchDataType = document.getElementsByClassName('search-datatype')[0]
    searchDataType.value = '';
    var searchTaskType = document.getElementsByClassName('search-tasktype')[0]
    searchTaskType.value = '';
    
    searchSubmit()
}

function searchSubmit(){
    var searchBox = document.getElementsByClassName('search-box')[0]
    /* Update the list of results with the search results */
    var newDatasetList = []
    var searchString = searchBox.value.trim()
    var keys = ["datasetName"]
    searchResult = findMatches(searchString, allDataset, keys)

    // Remove all the dataset
    var mainDiv = document.getElementsByClassName("all-dataset")[0]
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild)
    }

    var noResultContainer = document.getElementsByClassName("no-results-container")[0]
    while (noResultContainer.firstChild) {
        noResultContainer.removeChild(noResultContainer.firstChild)
    }

    for (var item of searchResult) {
        newDatasetList.push(item)
    }
    renderDataset(newDatasetList, searchString=searchBox.value)
}

function filterSubmit(){
    var searchName = document.getElementsByClassName('search-name')[0]
    var searchDomain = document.getElementsByClassName('search-domain')[0]
    var searchDataType = document.getElementsByClassName('search-datatype')[0]
    var searchTaskType = document.getElementsByClassName('search-tasktype')[0]
    /* Update the list of results with the search results */
    var newDatasetList = []
    //Search Name
    var searchString = searchName.value.trim()
    var keys = ["datasetName"]
    searchResult = findMatches(searchString, allDataset, keys)
    //Search Domain
    var searchString = searchDomain.value.trim()
    var keys = ["sourceURI"]
    searchResult = findMatches(searchString, searchResult, keys)
    //Search DataType
    var searchString = searchDataType.value.trim()
    var keys = ["data_type"]
    searchResult = findMatches(searchString, searchResult, keys)
    //Search TaskType
    var searchString = searchTaskType.value.trim()
    var keys = ["task_type"]
    searchResult = findMatches(searchString, searchResult, keys)
    
    // Remove all the dataset
    var mainDiv = document.getElementsByClassName("all-dataset")[0]
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild)
    }

    var noResultContainer = document.getElementsByClassName("no-results-container")[0]
    while (noResultContainer.firstChild) {
        noResultContainer.removeChild(noResultContainer.firstChild)
    }

    for (var item of searchResult) {
        newDatasetList.push(item)
    }
    renderDataset(newDatasetList, searchString=searchString)
}

// Set current year for copyright
var currentYear = (new Date()).getFullYear();
document.getElementById('copyright-year').innerHTML = currentYear;

/* Search implementation ends */

$(document).ready(function(){
	
    $('.tabs .tab-link').click(function(){
        var tab_id = $(this).attr('data-tab');

        $('.tabs .tab-link').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#"+tab_id).addClass('current');
    });
    
    $('select').change(function(){
       if($(this).val()){
           $(this).css("opacity", "1");
       }else{
           $(this).css("opacity", "0.5");
       }
    });
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