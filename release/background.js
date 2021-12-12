(function () {
	'use strict';

	chrome.action.onClicked.addListener(e=>{e.id&&chrome.tabs.sendMessage(e.id,{action:"activate"});});

})();
