let svr_id = document.getElementById("blsid").value;

console.log("from plugin", svr_id);
if (svr_id !== undefined || svr_id !== "") {
	browser.runtime.sendMessage('bls-available');
}

