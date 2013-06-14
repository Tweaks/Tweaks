/** 
 * jquery_replaceIcons (0.7) is script that can be added to a content item in blackboard
 * it runs on page load to see if any images have been added with id's replacement[CONTENTTYPE]Icon for all 
 * icons of a content type or class="replacemyicon" for row specific items
 * if either of these images are found, it identifies the target icon cells and replaces the old icon
 */

// findReplacementIcon looks for id's specified and calls replace functions
function findReplacementIcons() {
	var replacementIconLabels =  jQuery("#pageList span.label:contains('Replacement Icon')").addClass("replacementicon");
	jQuery("#pageList span.replacementicon:contains('Everything Replacement') ~ span").find("img:first").attr("id", "replacementIcon");

	var replaceAllIconsImg = jQuery("#replacementIcon");
	if (replaceAllIconsImg.length > 0) {
		jQuery("#pageList > tbody > tr").each(function(){ jQuery(this).find("img:first").attr("src", replaceAllIconsImg.attr("src")).addClass("replaced") });
		jQuery("h1.pageTitle img").attr("src", replaceAllIconsImg.attr("src")).addClass("replaced");
	}
	else
	{
		//jQuery("#titleicon, #pageList div.item_icon img").attr("src", replaceAllIconsImg.attr("src")).addClass("replaced");
	
		// content type replace: would be good to make this generic using regex
		// look for Item replacement
		replaceContentTypeIcon("document_on","Item","replacementDocumentIcon");
		// look for folder_on.gif
		replaceContentTypeIcon("folder_on","Folder","replacementFolderIcon");
		// look for course_link_on.gif
		replaceContentTypeIcon("course_link_on","Link","replacementCourseLinkIcon");
		// specific tool: wiki and blog don't allow for image upload directly
		// look for journalIcon_50x50.gif
		replaceContentTypeIcon("journalIcon_50x50","Blog", "replacementBlogIcon");
		// look for teamsIcon_50x50.gif
		replaceContentTypeIcon("teamsIcon_50x50","Wiki", "replacementWikiIcon");
		// title
		replaceTitleIcon("Title","replacementTitleIcon");
		// row specific icons
		replaceRowSpecificIcons();
	}
}
// content type replace call
function replaceContentTypeIcon(contentIconSrc, textID, replacementIconID) {
	jQuery("#pageList span.replacementicon:contains('"+textID+" Replacement') ~ span").find("img:first").attr("id", replacementIconID);
	if (jQuery("#"+replacementIconID).length)
		jQuery("#pageList img[src*='"+contentIconSrc+"']").attr("src", jQuery("#"+replacementIconID).addClass("replacementicon").attr("src")).addClass("replaced");
}
function replaceTitleIcon(textID, replacementIconID) {
	jQuery("#pageList span.replacementicon:contains('"+textID+" Replacement') ~ span").find("img:first").attr("id", replacementIconID);
	if (jQuery("#"+replacementIconID).length)
		jQuery("h1.pageTitle img").attr("src", jQuery("#"+replacementIconID).addClass("replacementicon").attr("src")).addClass("replaced");
}

// scan rows for row specific icons
function replaceRowSpecificIcons() {
	jQuery("#pageList span.replacementicon:contains(':')").each(function(){
		var replacementImage = jQuery(this).siblings("span").find("img:first");
		var rowName = jQuery.trim(jQuery(this).text().replace("Replacement Icon:", ""));
		jQuery("#pageList span.label:contains('"+rowName+"')").each(function(){
			jQuery(this).parents("tr").find("img:first").attr("src", replacementImage.attr("src")).addClass("replaced");
		});
	});
}

function hideIcons() {
	jQuery("#pageList span.label:contains('Hide Icon:')").addClass("hideicon").each(function(){
		//var 
		rowName = jQuery.trim(jQuery(this).text().replace("Hide Icon:", ""));
		jQuery("#pageList span.label:contains('"+rowName+"')").each(function(){
			jQuery(this).parents("tr").find("img:first").hide();
		});
	});
}

// trigger function on page load
jQuery(function() {

	// new 8
	var editMode = jQuery("#endActionBar").length > 0; 
	var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
	page.attr("id", "pageList");
	
	findReplacementIcons();
	hideIcons();
	// clean up
	if (!editMode)
	{
		page.find("span.replacementicon, span.hideicon").parents("tr").hide();	
		page.find("img.replacementicon").hide();
	}	
});