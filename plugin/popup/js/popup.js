//-- connect to background script --
var myPort = browser.runtime.connect({name:"port-from-cs"});
myPort.postMessage({command: "getID", ID: "0"});

myPort.onMessage.addListener(function(m) {
  console.log("In content script, received message from background script: ");
  console.log(m);
  handle_nativeapp_reponse(m);
});

document.getElementById("BtnConnect").addEventListener("click", function(){
  myPort.postMessage({command: "connect", ID: "0" });
});

document.getElementById("BtnCreate").addEventListener("click", function(){
  myPort.postMessage({command: "init", ID: "0" });
});

function handle_nativeapp_reponse(m) {
  if (m.type == "id") {
    document.getElementById("currentID").innerHTML = m.val.substring(4,30);
  }
}
