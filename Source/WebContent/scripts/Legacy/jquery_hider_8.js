/** 
 * hider (0.7) is script that can be added to a content item in blackboard. author Tim Plaisted
 * it looks to see that content not in edit mode, then hides any rows with items with class: hidemyrow
 */
var rowIdentifier = ".hidemyrow";	// change for default identifier for rows
var iconIdentifier = ".hidemyicon";	// change for default identifier for icons

// todo: optimise + test
jQuery(function($){
	if(location.href.indexOf("Content.")>0) {
		$(rowIdentifier).parents("tr").hide();
		$(iconIdentifier).parents("tr").each(function(){$(this).find("td:first img").hide();});
	} 
});