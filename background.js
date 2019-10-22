
chrome.browserAction.onClicked.addListener(function (tab) {	
		/* when button is clicked, the reader.html file will open and display the simplified page*/
				
		chrome.windows.create({
		   url: chrome.runtime.getURL("reader.html"),
		   state: "fullscreen"
		});

	
});

function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}
