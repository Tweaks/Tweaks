/** 
 * findAppendIcons (0.5) is script that can be added to a content item in blackboard
 * it runs on page load to see if any images have been added with trigger id's appendDocumentIcon or appendFolderIcon
 * if either of these images are found, it calls appendIcon to identify icon cells, expand them and append the new icon
 */

// width variables
var bbIconWidth =  30;	// change if your default icon width is different
var tablePadding = 17;	// change to increase table padding
var defaultAppendIconWidth = 30;	// change to set different default width

// findAppendIcon looks for id's specified and calls append functions
function findAppendIcons() {
	// look for document_on.gif append
	var documentImgSrc = "document_on.gif";
	var appendDocumentIconImg = document.getElementById("appendDocumentIcon");
	if (appendDocumentIconImg)
		appendIcon(documentImgSrc, appendDocumentIconImg); 
	// look for folder_on.gif
	var folderImgSrc = "folder_on.gif";
	var appendFolderIconImg = document.getElementById("appendFolderIcon");
	if (appendFolderIconImg)
		appendIcon(folderImgSrc, appendFolderIconImg); 
	// (extension) write in functions to handle link and anything
}

// appendIcon finds image icons and appends their src from a source image
function appendIcon(targetImgSrc, appendIconImg)
{
	// set offset cell spacing
	if (appendIconImg.width)
		defaultAppendIconWidth = appendIconImg.width;
	var newTDWidth = bbIconWidth + tablePadding + defaultAppendIconWidth;
	// get all table cells
	var tds = document.getElementsByTagName("td");
	// loop through tds looking for (image src) and append with icon
	for(i = 0; i < tds.length; i++)
	{
		if(tds[i].innerHTML.indexOf(targetImgSrc) > -1)
		{
			tds[i].width = newTDWidth;
			tds[i].valign = "top";
			tds[i].innerHTML = tds[i].innerHTML + " <img src="+appendIconImg.src+" align=\"top\" vspace=3>";
		}
	}
}

// creative commons cross browser helper from Christian Heilmann to append function to onload
addEvent(window, 'load', findAppendIcons);
function addEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}