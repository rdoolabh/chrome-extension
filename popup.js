// var app = chrome.runtime.getBackgroundPage();

var title;

function hello() {
  // chrome.tabs.executeScript({
  //   file: 'alert.js'
  // }); 

	chrome.tabs.executeScript({file: "alert.js"}, function (test){
            title = test;
            document.getElementById('main_title').innerHTML = title;
        });
	


	//return title;
}


// function onLoadFunction() {
//   chrome.tabs.executeScript({
//     file: 'alert2.js'
//   }); 
//   //var objName = $('#commonPropname_formID1').text();
// }


//javascript that interacts with the popup
document.getElementById('button1').addEventListener('click', hello);

//window.addEventListener("load", onLoadFunction);