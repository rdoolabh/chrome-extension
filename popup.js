
// function setContentObjectName() {
//   // chrome.tabs.executeScript({
//   //   file: 'alert.js'
//   // }); 

// 	chrome.tabs.executeScript({file: "alert.js"}, function (test){
//             var title = test;
//             document.getElementById('main_title').innerHTML = title;
//         });
// }


function setContentObjectName() {
	chrome.tabs.executeScript(null, { file: "jquery-1.12.2.js" }, function() {
    	chrome.tabs.executeScript(null, { file: "alert.js" }, function (test){
            var title = test;
            $('#main_title').html(title);
        });
	});
}

function populateImageTypes() {

	$("#loading").show();	

	var apiUrlWithPlaceholders = 'http://api.n7.contentadmin.abc.go.com/api/ws/contentsadmin/v2/images/imagetypes?brand={brandId}&type={contentType}';

	//TODO get brand id and make a call for alias
	var apiUrlWithBrand = apiUrlWithPlaceholders.replace("{brandId}", "001");

	//TODO get contentType from page
	var imageTypesApi = apiUrlWithBrand.replace("{contentType}", "show");

	var x = new XMLHttpRequest();
  	x.open('GET', imageTypesApi);

  	x.responseType = 'json';
  	x.onload = function() {
    	// Parse and process the response from contentsadmin
    	var response = x.response;

	  	response.typecropObjects.forEach(function(entry) {
	  		createOptionForImageType(entry.userImageTypeName, entry.imageTypeName);
  		});

		$("#image_types_empty_message").hide();
	  	$("#loading").hide();
  };
  x.onerror = function() {
    alert("ERROR");
  };
  x.send();
}


function createOptionForImageType(userImageTypeName, treePath) {
	$('#image_types_container').append('<input type="checkbox" value='+ treePath +'/>'+ userImageTypeName +'<br>');
}

//javascript that interacts with the popup
document.getElementById('image_types_butt').addEventListener('click', populateImageTypes);


window.addEventListener("load", setContentObjectName);










