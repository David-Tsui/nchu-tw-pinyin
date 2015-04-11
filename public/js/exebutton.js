window.onload = function () {
	var buttons = document.getElementById('testForm').getElementsByTagName('input');
	for (var i=0;i<buttons.length;i++) {
		if (buttons[i].type != 'button') continue;
		buttons[i].onclick = command;
	}
	wr = document.getElementById('writeroot');
	iframe = document.getElementById('test');
}

var testEl;

function command() {
	if (!testEl) {
		var oDoc = iframe.contentWindow || oIframe.contentDocument;
		if (oDoc.document) {
			oDoc = oDoc.document;
		}
		testEl = oDoc.getElementById('testElement');
	}
	var cmd = this.id;
	var bool = false;
	var value = this.getAttribute('cmdValue') || null;
	if (value == 'promptUser')
		value = prompt(this.getAttribute('promptText'));
	var returnValue = iframe.contentWindow.inBetween(cmd,bool,value);
	var writestring = '';
	if (returnValue) writestring += 'Return value: ' + returnValue + '\n\n';
	writestring += testEl.innerHTML;
	wr.value = writestring;
	
	

//	iframe.contentDocument.execCommand(cmd,bool,value);
}