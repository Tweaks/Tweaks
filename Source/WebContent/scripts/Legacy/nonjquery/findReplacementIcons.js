/** 
 * findReplacementIcons (0.6) is script that can be added to a content item in blackboard
 * it runs on page load to see if any images have been added with id's replacement[CONTENTTYPE]Icon for all 
 * icons of a content type or class="replacemyicon" for row specific items
 * if either of these images are found, it identifies the target icon cells and replaces the old icon
 */
// findReplacementIcon looks for id's specified and calls replace functions
function findReplacementIcons() {
	
	// content type replace: would be good to make this generic using regex
	// look for document_on.gif replacement
	replaceContentTypeIcon("document_on.gif","replacementDocumentIcon");
	// look for folder_on.gif
	replaceContentTypeIcon("folder_on.gif","replacementFolderIcon");
	// look for course_link_on.gif
	replaceContentTypeIcon("course_link_on.gif","replacementCourseLinkIcon");

    // row specific icons
	replaceRowSpecificIcons();
}
// content type replace call
function replaceContentTypeIcon(contentIconSrc, replacementIconID) {
	var replacementIconImg = document.getElementById(replacementIconID);
	if (replacementIconImg)
		replaceIconSrc(contentIconSrc, replacementIconImg); 
}
// scan rows for row specific icons
function replaceRowSpecificIcons() {
	var trs = document.getElementsByTagName("tr");
	for (var i = 0; i < trs.length; i++) {
		if (trs[i].innerHTML.indexOf("replacemyicon") > 0) {
			replaceIconInRow(trs[i]);
		}
	}
}
// row specific call
function replaceIconInRow(tableRow) {
	// get imgs
	var imgs = tableRow.getElementsByTagName("img");
	// find new icon
	var replacementIconIndex = 0;
	for (var k = 0; k < imgs.length; k++) {
		if (imgs[k].className == "replacemyicon") {
			replacementIconIndex = k;
			break;
		}
	}
	// replace first image with icon
	if (imgs[0] && imgs[replacementIconIndex]) {
		imgs[0].src = imgs[replacementIconIndex].src;
		imgs[replacementIconIndex].style.display = "none";
	}
}
// replaceIcon finds image icons and replaces their src from a source image
function replaceIconSrc(targetImgSrc, replacementIconImg)
{
	// get all images
	var imgs = document.getElementsByTagName("img");
	// get id image
	// loop through images looking for (image src) and replace with src
	for(var i = 0; i < imgs.length; i++)
	{
		if(imgs[i].src.indexOf(targetImgSrc) > -1)
		{
			if (imgs[i].src)
				imgs[i].src = replacementIconImg.src;
		}
	}
}
// creative commons cross browser helper from Christian Heilmann to append function to onload
addEvent(window, 'load', findReplacementIcons);
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