// Blackboard course notepad functionality in content
// Usage:
//
// Blackboard edit friendly, degradable: copy <span class="openNotepad">Notepad in Community Tools</span> to text item.
// The Text will be replaced with link to Notepad.
// OR call function direct by using: <a href="#" onclick="openNotepad();">Notepad</a>
//
// Version: 1.4
// Author: Tim Plaisted

// embed behaviour in text
jQuery(document).ready(function($){
	if (location.href.indexOf("listContent") > -1)
	{
		$("<a href='#' class='openNotepad'>Notepad</a>").replaceAll("SPAN.openNotepad");
		$("A.openNotepad").each(function() { $(this).click(function(e) { openNotepad(); e.preventDefault(); }); });
	}
});
// openNotepad extracts course code from URL using getQueryVariable and openWin to popup notepad
function openNotepad() {
	var courseID = getQueryVariable('course_id');
	openWin("/bin/common/notepad.pl?course_id="+courseID);
}
// helper functions
function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if (pair[0] == variable) {
           return pair[1];
       }
   }
}
function openWin(ppage) {
	var winXPos  = 420;
	var winYPos  = 500;
	var winXSize = 520;
	var winYSize = 510;

	// only set new values if 4.0 browser
	if (parseInt(navigator.appVersion) >= 4) {
		winXPos = (screen.availWidth - (80 + winXSize));
		winYPos = (screen.availHeight - (100 + winYSize));
	}

	strFeatures = 'minimize=0,maximize=0,resizable=0,dependent,scrollbars,'
		+ 'left='   + winXPos   + ','
		+ 'top='    + winYPos   + ','
		+ 'height=' + winYSize  + ','
		+ 'width='  + winXSize;

	if ((!window.newwin) || (window.newwin.closed)) {
		newwin = window.open(ppage,'notepad',strFeatures);
	} else {
		window.newwin.focus();
	}
}