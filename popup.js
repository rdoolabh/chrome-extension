
// function setContentObjectName() {
//   // chrome.tabs.executeScript({
//   //   file: 'alert.js'
//   // }); 

// 	chrome.tabs.executeScript({file: "alert.js"}, function (test){
//             var title = test;
//             document.getElementById('main_title').innerHTML = title;
//         });
// }

var hashtable;

var sectionPathArr;
var contentId;

var cms;

var brandTable = {};
brandTable['ABC'] = "001";
brandTable['ABCFamily'] = "002";
brandTable['ABCNews'] = "003"
brandTable['DisneyChannel'] = "004";
brandTable['DisneyJunior'] = "008";
brandTable['DisneyXD'] = "009";
brandTable['EverGreen'] = "999";

var presentationContent = {"Tile": true, "Slide": true, "Blog": true, "Episode": true, "Person": true, "Collection": true};


function setContentObjectName() {
	chrome.tabs.executeScript(null, { file: "jquery-1.12.2.js" }, function() {
    	chrome.tabs.executeScript(null, { file: "pageInteraction.js" }, function (result){

    		hashtable = result[0];
    		$('#main_title').html(hashtable.title);

    		sectionPathArr = hashtable.sectionPath.split("/");

    		contentId = getContentId(hashtable.contentIdAndDraft);

    		cms = getCMS();

        });
	});
}

function populateImageTypes() {

	$("#loading").show();	

	//var apiUrlWithPlaceholders = 'http://staging.api.n7.contentadmin.abc.go.com/api/ws/contentsadmin/v2/images/imagetypes?brand={brandId}&type={contentType}';
	var apiUrlWithPlaceholders = 'http://localhost:8080/contentsadmin/v2/images/imagetypes?brand={brandId}&type={contentType}';


	//TODO get brand id and make a call for alias
	var apiUrlWithBrand = apiUrlWithPlaceholders.replace("{brandId}", getBrandCode());

	var imageTypesApi = apiUrlWithBrand.replace("{contentType}", hashtable.contentTypeName);

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

function uploadImage() {
	$("#loading").show();	

	//var apiUrlWithPlaceholders = 'http://staging.api.n7.contentadmin.abc.go.com/api/ws/contentsadmin/v2/images?brand-name={brandName}&image-name={imageName}&file-extension={fileExtension}&show-name={showName}';

	var apiUrlWithPlaceholders = 'http://localhost:8080/contentsadmin/v2/images?brand-name={brandName}&image-name={imageName}&file-extension={fileExtension}&show-name={showName}';

	var apiUrlWithBrand = apiUrlWithPlaceholders.replace("{brandName}", getBrandName());

	var apiUrlWithImageName = apiUrlWithBrand.replace("{imageName}", $("#image_name").val());

	var apiUrlWithFileExtension = apiUrlWithImageName.replace("{fileExtension}", getFileExtension());

	//TODO get showname from the page
	var imageUploadApi = apiUrlWithFileExtension.replace("&show-name={showName}", "");

	var x = new XMLHttpRequest();
  	x.open('POST', imageUploadApi);

  	x.setRequestHeader("Content-type", "application/octet-stream");

  	x.setRequestHeader("Authorization", "EIA_TEST_TOKEN");

  	x.responseType = 'json';
  	x.onload = function() {
    	// Parse and process the response from contentsadmin
    	var response = x.response;

    	$("#imagesource_id").html(response.damImageContentId);

    	$("#image_upload_success").fadeIn("slow");

    	previewImage(response.thumbnailUrl);
	  	
	  	$("#loading").hide();
  };
  x.onerror = function() {
    alert("ERROR");
  };
  x.send(getFile());
}

function associateImage() {
	$("#loading").show();	

	//var apiUrlWithPlaceholders = 'http://staging.api.n7.contentadmin.abc.go.com/api/ws/contentsadmin/v2/images/associateimage?imageid={imageId}&imagetype={imageTypePath}'

	var apiUrlWithPlaceholders = 'http://localhost:8080/contentsadmin/v2/images/associateimage?imageid={imageId}&imagetype={imageTypePath}';

	var apiWithImageId = apiUrlWithPlaceholders.replace("{imageId}", getImageId());

	//TODO call assosiate api in parallel
	var paths = getTypePaths();

	var associateimageApi = apiWithImageId.replace("{imageTypePath}", paths[0]);

	var x = new XMLHttpRequest();
  	x.open('POST', associateimageApi);

  	x.setRequestHeader("Authorization", "EIA_TEST_TOKEN");

  	x.responseType = 'json';
  	x.onload = function() {
    	// Parse and process the response from contentsadmin
    	var response = x.response;
	  	
    	$("#imageassociation_dam_id").html(response.commonProperties.ID);

    	$("#imageassociation_pres_id").html(response.customProperties.PresentationReferenceID);

    	$("#image_associate_success").fadeIn("slow");

	  	$("#loading").hide();

	  	addImageToContent(response.customProperties.PresentationReferenceID);
  };
  x.onerror = function() {
    alert("ERROR");
  };
  x.send();
}


function getBrandCode() {
	var brandName = getBrandName();
	return brandTable[sectionPathArr[1]];
}

function getBrandName() {
	return sectionPathArr[1];
}

function createOptionForImageType(userImageTypeName, treePath) {
	$('#image_types_container').append('<input type="checkbox" class="image_type_checkboxes" value='+ treePath +'/>'+ userImageTypeName +'<br>');
}

function getFileExtension() {
	var file = getFile();

	var fileName = file.name;

	var fileNameArr = fileName.split(".");

	return fileNameArr[fileNameArr.length -1];
}

//TODO support multiple files instead of just one
function getFile() {
	var x = document.getElementById("file_uploader");

	return x.files[0];
}

function previewImage(imageurl) {
    var img = $('<img />', {src : imageurl, style : "height:100px;"});
    img.appendTo('#preview');
}

function getImageId() {
	return $("#imagesource_id").text();
}

function getTypePaths() {

	var listOfSourcePaths = new Array();

	$(".image_type_checkboxes").each(function(){
    	if ($(this).prop('checked')==true){ 
        	
    		var pathString = $(this).val();

        	if (pathString.charAt(pathString.length -1) == '/') {
        		listOfSourcePaths.push(pathString.slice(0, -1));
        	}
        	else {
        		listOfSourcePaths.push(pathString);
        	}
    	}
	});

	return listOfSourcePaths;
}

function getContentId(contentIdAndDraft) {
	var contentArr = contentIdAndDraft.split(",");

	return contentArr[0].substring(4, contentArr[0].length)

}

function addImageToContent(imagePresId) {

	var apiUrlWithPlaceholders = 'http://localhost:8080/contentsadmin/v2/content-objects?id={id}&cms={cms}';

	//TODO get brand id and make a call for alias
	var apiUrlWithId = apiUrlWithPlaceholders.replace("{id}", contentId);

	var contentObjectApi = apiUrlWithId.replace("{cms}", cms);

	var x = new XMLHttpRequest();
  	x.open('GET', contentObjectApi);

  	x.responseType = 'json';
  	x.onload = function() {
    	// Parse and process the response from contentsadmin
    	var response = x.response;

    	//TODO move this cadd back in the addImageToContent() func
		var payloadWithImages = addImages(response, imagePresId);
		makePutRequest(payloadWithImages);

	  	return response;

  };
  x.onerror = function() {
    alert("ERROR");
  };
  x.send();

}

function addImages(payload, imagePresId) {

	var jsonArr = '[{"commonProperties": {"ID": ' + imagePresId + '}}]';

	var obj = JSON.parse(jsonArr);

	payload.collectionProperties.ImageAssociations = obj;

	return payload;
}

function makePutRequest(payloadWithImages) {	

	var apiUrlWithPlaceholders = 'http://localhost:8080/contentsadmin/v2/content-objects?id={id}&cms={cms}';

	var apiWithContentId = apiUrlWithPlaceholders.replace("{id}", contentId);

	var putApi = apiWithContentId.replace("{cms}", cms);

	var x = new XMLHttpRequest();
  	x.open('PUT', putApi);

  	x.setRequestHeader("Authorization", "EIA_TEST_TOKEN");

  	x.responseType = 'json';
  	x.onload = function() {
    	// Parse and process the response from contentsadmin
    	var response = x.response;

    	$("#images_added_success").fadeIn("slow");

  };
  x.onerror = function() {
    alert("ERROR");
  };
  x.send(JSON.stringify(payloadWithImages));
}

function getCMS() {

	var contentType = hashtable.contentTypeName;

	if (contentType in presentationContent) {
		return "presentation";
	}
	else {
		return "dam";
	}
}

//javascript that interacts with the popup
document.getElementById('image_types_butt').addEventListener('click', populateImageTypes);

document.getElementById('upload_butt').addEventListener('click', uploadImage);

document.getElementById('associate_image_butt').addEventListener('click', associateImage);


window.addEventListener("load", setContentObjectName);










