/** 
 * hider (0.5) is script that can be added to a content item in blackboard
 * it looks to see that content not in edit mode, then looping through the table rows, hides any with text: hidemyrow
 */
var rowIdentifier = "hidemyrow";	// change for default identifier for rows
var iconIdentifier = "hidemyicon";	// change for default identifier for icons

// helper: add hider functions in display mode
if (document.location.href.indexOf("listContentEditable") == -1)
	addEvent(window, "load", hider);

function hider()
{
	// get rows
	var trs = document.getElementsByTagName("tr");
	//loop through and find id above and hide
	for(i = 0; i < trs.length; i++)
	{
		if(trs[i].innerHTML.indexOf(rowIdentifier) > -1)
		{
			// hide located rows
			trs[i].style.display = "none";
		}
		else if(trs[i].innerHTML.indexOf(iconIdentifier) > -1)
		{
			// get images
			var imgs = trs[i].getElementsByTagName("img");
			if (imgs)
			{
				// hide first one (icon)
				imgs[0].style.display = "none";
			}
		}
	}
}
// creative commons cross browser helper from Christian Heilmann to append function to onload
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