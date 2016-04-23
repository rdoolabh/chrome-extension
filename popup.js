
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
            document.getElementById('main_title').innerHTML = title;
        });
	});
}


//javascript that interacts with the popup
//document.getElementById('button1').addEventListener('click', hello);

window.addEventListener("load", setContentObjectName);