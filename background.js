
chrome.browserAction.onClicked.addListener(function (tab) {	//if shortcut Alt+R is pressed, open the reader for this page
		/*
		chrome.tabs.sendMessage(tab.id, {action: "SendIt"}, function(response) {});  

		var request = makeHttpObject();
		request.open("GET", tab.url, true);
		request.send(null);
		request.onreadystatechange = function() {
		  if (request.readyState == 4){
		    alert(request.responseText);
			console.log(request.responseText);
		  }
		};*/
				
		chrome.windows.create({
		   url: chrome.runtime.getURL("reader.html"),
		   state: "fullscreen"
		});

	
});

function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}
function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

