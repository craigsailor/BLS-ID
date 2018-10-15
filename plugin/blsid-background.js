/*
This file runs in the background of the plugin
*/

var pubkey;

//connect to native app
var port = browser.runtime.connectNative("blsid");

//** connect to popup script **
var portFromPUS;

function connected(p) {
	portFromPUS = p;
	portFromPUS.onMessage.addListener(function(m) {
		if (m.command == "init") {
			port.postMessage('{"command": "init"}');
		} else if (m.command == "getID") {
			port.postMessage('{"command": "getID"}');
		} else if (m.command == "connect") {
			connect_to_server();
		} else {
			console.log("soemthing's wrong");
		}
	});
}


browser.runtime.onConnect.addListener(connected);

//** messages from blsid-plugin.js **
browser.runtime.onMessage.addListener(notify);
function notify(message) {
	if (message !== '') {
		console.log(message);
		var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
		gettingActiveTab.then((tabs) => {
			browser.pageAction.show(tabs[0].id);
		});
	}

	var gettingCurrent = browser.tabs.getCurrent();
	gettingCurrent.then(onGot, onError);
}

function onGot(tabInfo) {
	//is this function needed?
}

function onError(error) {
	console.log(`Error: ${error}`);
}

//** messages from native app listener **
port.onMessage.addListener((response) => {
	responseJSON = JSON.parse(response);
	
	if (responseJSON.type == "id") {
		pubkey = responseJSON.val;      
		portFromPUS.postMessage(JSON.parse(response));
	} else if (responseJSON.type == "signature") {
		console.log("none");
		//send signed random number to server
	}
	
	//browser.browserAction.setIcon({path: "icons/blsid-icon-green.svg"});
	//if (response != "") {
	//	browser.pageAction.setIcon({path: "icons/blsid-icon-green.svg"});
	//}
})

function connect_to_server() {
  // send pubkey to server
  // get back random number from server
  randstr = Math.random(); 
  port.postMessage('{"command": "sign", "message": ' + randstr + '"}');
}
