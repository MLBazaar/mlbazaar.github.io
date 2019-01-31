/* Create dataset cards */
var renderDataset = function(datasetList, searchString = '') {
  // Parent div to hold all the dataset cards
  var mainDiv = document.getElementsByClassName('all-dataset')[0];

  if (datasetList.length > 0) {
    for (var dataset of datasetList) {
      // Div for each dataset
      var datasetDiv = document.createElement('div');
      datasetDiv.className = 'col-12 col-sm-4 col-md-4 more-box';

      var cardContent = document.createElement('a');
      cardContent.className = 'card-content';
      cardContent.href = dataset.dataset_path;
      cardContent.target = '_self';

      var nameH3 = document.createElement('h3');
      nameH3.innerHTML = dataset.datasetName;
      cardContent.appendChild(nameH3);

      var typesDiv = document.createElement('div');
      typesDiv.className = 'types';
      var p1 = document.createElement('p');
      var data_type = dataset.data_type;
      p1.innerHTML = data_type.replace('_', ' ');
      var p2 = document.createElement('p');
      var task_type = dataset.task_type;
      p2.innerHTML = task_type.replace('_', ' ');
      typesDiv.appendChild(p1);
      typesDiv.appendChild(p2);
      cardContent.appendChild(typesDiv);

      datasetDiv.appendChild(cardContent);

      /* Finally Add the dataset card to the page */
      mainDiv.appendChild(datasetDiv);
    }
  } else {
    var noResultDiv = document.createElement('div');
    noResultDiv.className = 'no-results';

    var noResultPara = document.createElement('p');
    noResultPara.innerHTML = 'No results found';
    noResultDiv.appendChild(noResultPara);

    var noResultContainer = document.getElementsByClassName(
      'no-results-container'
    )[0];
    noResultContainer.appendChild(noResultDiv);
  }
};

// Sort the dataset
var sortFunction = function(a, b) {
  // Sort by Name
  var textA = a.datasetName.toUpperCase();
  var textB = b.datasetName.toUpperCase();
  // Sort by recently pushedAt
  var deltaA = new Date() - Date.parse(a.time);
  var deltaB = new Date() - Date.parse(b.time);
  return textA < textB ? -1 : textA > textB ? 1 : deltaA >= deltaB ? 1 : -1;
};

// Sort and Render
allDataset.sort(sortFunction);
renderDataset(allDataset);

/* Search implementation starts */
var searchResult = allDataset; // Search Result initialization

function findMatches(query, repos, keys = ['datasetName']) {
  if (query === '') {
    return repos;
  } else {
    var options = {
      findAllMatches: true,
      threshold: 0.2,
      location: 0,
      distance: 200,
      maxPatternLength: 100,
      minMatchCharLength: 1,
      keys: keys
    };
    var fuse = new Fuse(repos, options);
    var result = fuse.search(query);

    // Sort
    result.sort(sortFunction);

    return result;
  }
}
function resetSearch() {
  //reset input
  var searchBox = document.getElementsByClassName('search-box')[0];
  searchBox.value = '';

  filterSubmit();
}
function resetFilter() {
  //reset input
  var searchName = document.getElementsByClassName('search-name')[0];
  searchName.value = '';
  var searchDomain = document.getElementsByClassName('search-domain')[0];
  searchDomain.value = '';
  var searchDataType = document.getElementsByClassName('search-datatype')[0];
  searchDataType.value = '';
  var searchTaskType = document.getElementsByClassName('search-tasktype')[0];
  searchTaskType.value = '';

  searchSubmit();
}

function searchSubmit() {
  var searchBox = document.getElementsByClassName('search-box')[0];
  /* Update the list of results with the search results */
  var newDatasetList = [];
  var searchString = searchBox.value.trim();
  var keys = ['datasetName'];
  searchResult = findMatches(searchString, allDataset, keys);

  // Remove all the dataset
  var mainDiv = document.getElementsByClassName('all-dataset')[0];
  while (mainDiv.firstChild) {
    mainDiv.removeChild(mainDiv.firstChild);
  }

  var noResultContainer = document.getElementsByClassName(
    'no-results-container'
  )[0];
  while (noResultContainer.firstChild) {
    noResultContainer.removeChild(noResultContainer.firstChild);
  }

  for (var item of searchResult) {
    newDatasetList.push(item);
  }
  renderDataset(newDatasetList, (searchString = searchBox.value));

  $('.more-box').hide();
  $('.more-box').slice(0, 12).show();
  // if ($('.more-box:hidden').length != 0) {
	 //  $('#load-more').show();
  // } else {
	 //  $('#load-more').hide();
  // }
}

function filterSubmit() {
  var searchName = document.getElementsByClassName('search-name')[0];
  var searchDomain = document.getElementsByClassName('search-domain')[0];
  var searchDataType = document.getElementsByClassName('datatype-ul')[0];
  searchDataType = searchDataType.getElementsByClassName('active')[0];console.log(searchDataType);
  if(searchDataType){
    searchDataType = searchDataType.getAttribute('data-value');
  }
  var searchTaskType = document.getElementsByClassName('tasktype-ul')[0];
  searchTaskType = searchTaskType.getElementsByClassName('active')[0];
  if(searchTaskType){
    searchTaskType = searchTaskType.getAttribute('data-value');
  }
  /* Update the list of results with the search results */
  var newDatasetList = [];
  //Search Name
  var searchString = searchName.value.trim();
  var keys = ['datasetName'];
  searchResult = findMatches(searchString, allDataset, keys);
  //Search Domain
  if(searchDomain){
    var searchString = searchDomain.value.trim();
    var keys = ['sourceURI'];
    searchResult = findMatches(searchString, searchResult, keys);
  }
  //Search DataType
  if(searchDataType){
    var searchString = searchDataType.trim();
    var keys = ['data_type'];
    searchResult = findMatches(searchString, searchResult, keys);
  }
  //Search TaskType
  if(searchTaskType){
    var searchString = searchTaskType.trim();
    var keys = ['task_type'];
    searchResult = findMatches(searchString, searchResult, keys);
  }

  // Remove all the dataset
  var mainDiv = document.getElementsByClassName('all-dataset')[0];
  while (mainDiv.firstChild) {
    mainDiv.removeChild(mainDiv.firstChild);
  }

  var noResultContainer = document.getElementsByClassName(
    'no-results-container'
  )[0];
  while (noResultContainer.firstChild) {
    noResultContainer.removeChild(noResultContainer.firstChild);
  }

  for (var item of searchResult) {
    newDatasetList.push(item);
  }
  renderDataset(newDatasetList, (searchString = searchString));

  $('.more-box').hide();
  $('.more-box').slice(0, 12).show();
  // if ($('.more-box:hidden').length != 0) {
	 //  $('#load-more').show();
  // } else {
	 //  $('#load-more').hide();
  // }
}

document.addEventListener('keyup', function(event) {
    filterSubmit();
});

// Set current year for copyright
var currentYear = new Date().getFullYear();
document.getElementById('copyright-year').innerHTML = currentYear;

/* Search implementation ends */

$(document).ready(function() {
  $('.tabs .tab-link').click(function() {
    var tab_id = $(this).attr('data-tab');

    $('.tabs .tab-link').removeClass('current');
    $('.tab-content').removeClass('current');

    $(this).addClass('current');
    $('#' + tab_id).addClass('current');
  });

  $('select').change(function() {
    if ($(this).val()) {
      $(this).css('opacity', '1');
    } else {
      $(this).css('opacity', '0.5');
    }
  });

  $('.more-box').hide();
  $('.more-box').slice(0, 12).show();
  // if ($('.more-box:hidden').length != 0) {
  //   $('#load-more').show();
  // }
  // $('#load-more-button').on('click', function(e) {
  //   e.preventDefault();
  //   $('.more-box:hidden').slice(0, 12).slideDown();
  //   if ($('.more-box:hidden').length == 0) {
  //     $('#load-more').fadeOut('slow');
  //   }
  // });

  $('.datatype-group').on('click', 'li', function() {
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      filterSubmit();
      return false;    
    }
    $('.datatype-group li.active').removeClass('active');
    $(this).addClass('active');

    filterSubmit();
  });
  $('.tasktype-group').on('click', 'li', function() {
    if($(this).hasClass('active')){
      $(this).removeClass('active');
      filterSubmit();
      return false;    
    }
    $('.tasktype-group li.active').removeClass('active');
    $(this).addClass('active');

    filterSubmit();
  });
});

$(window).scroll(function() {
  if ($(this).scrollTop() >= 50) {
    // If page is scrolled more than 50px
    $('#return-to-top').fadeIn(200); // Fade in the arrow
  } else {
    $('#return-to-top').fadeOut(200); // Else fade out the arrow
  }

  //Scroll To Loadmore
  var scrollHeight = $(this).scrollTop();
  var currentHeight = $(document).height() - $(this).height() - 100;
  if(scrollHeight > currentHeight) {console.log("scroll")
    $('.more-box:hidden').slice(0, 12).slideDown();
    // if ($('.more-box:hidden').length == 0) {
    //   $('#load-more').fadeOut('slow');
    // }
  }
});
$('#return-to-top').click(function() {
  // When arrow is clicked
  $('body,html').animate({
      scrollTop: 0 // Scroll to top of body
    }, 500);
});
