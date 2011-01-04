/* 
   Copyright 2010 Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 * jquery_replaceIcons (0.8) is script that can be added to a content item in blackboard
 * it runs on page load to see if any images have been added with title Replacement Icon or 
 * id's replacement[CONTENTTYPE]Icon for all icons of a content type or class="replacemyicon" for row specific items
 * if either of these images are found, it identifies the target icon cells and replaces the old icon
 * author Tim Plaisted 2010
 */
// tweak default variables
if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };
var replacementIconHeaders; // store global to save lookups

// findReplacementIcon looks for id's specified and calls replace functions
function findReplacementIcons() {
	// set up ids from item text titles: todo just use cached list instead of lookup
	replacementIconHeaders = jQuery(tweak_bb.page_id +" > "+tweak_bb.row_element).children("h3.item, div.item").filter(":contains('Replacement Icon')").addClass("replacementicon");
	replacementIconHeaders.filter(":contains('Everything Replacement')").parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id", "replacementIcon");
	
	var replaceAllIconsImg = jQuery("#replacementIcon");
	if (replaceAllIconsImg.length > 0)
		jQuery("#titleicon, "+tweak_bb.page_id +" div.item_icon img, "+tweak_bb.page_id +" img.item_icon").attr("src", replaceAllIconsImg.attr("src")).addClass("replaced");
	else
	{
		// look for Item replacement
		replaceContentTypeIcon("document_on","Item","replacementDocumentIcon");
		// look for folder_on.gif
		replaceContentTypeIcon("folder_on","Folder","replacementFolderIcon");
		// look for course_link_on.gif
		replaceContentTypeIcon("course_link_on","Link","replacementCourseLinkIcon");
		// look for title
		replaceTitleIcon("Title","replacementTitleIcon");
		// specific tool: wiki and blog don't allow for image upload directly
		// look for journalIcon_50x50.gif
		replaceContentTypeIcon("journal","Blog","replacementBlogIcon");
		// look for teamsIcon_50x50.gif
		replaceContentTypeIcon("teams","Wiki","replacementWikiIcon");
		// row specific icons
		replaceRowSpecificIcons();
	}
	jQuery(tweak_bb.page_id +" div.item_icon img, "+tweak_bb.page_id +" img.item_icon, #titleicon").filter(".replaced").css("max-width", "64px");
}
// content type replace call
function replaceContentTypeIcon(contentIconSrc, textID, replacementIconID) {
	replacementIconHeaders.filter(":contains('"+textID+" Replacement')").parents(tweak_bb.row_element).find("div.details").find("img:first").attr("id", replacementIconID);
	if (jQuery("#"+replacementIconID).length) {
		jQuery(tweak_bb.page_id +" div.item_icon img[src*='"+contentIconSrc+"'], "+
			   tweak_bb.page_id +" img.item_icon[src*='"+contentIconSrc+"']").attr("src", jQuery("#"+replacementIconID).addClass("replacementicon").attr("src")).addClass("replaced");
	}
}
// title type replace call
function replaceTitleIcon(textID, replacementIconID) {
	replacementIconHeaders.filter(":contains('"+textID+" Replacement')").siblings("div.details").find("img:first").attr("id", replacementIconID);
	if (jQuery("#"+replacementIconID).length)
		jQuery("#titleicon").attr("src", jQuery("#"+replacementIconID).addClass("replacementicon").attr("src")).addClass("replaced");
}
function getRowName(itemTitle, key) {
	//!check return jQuery.trim(jQuery(itemTitle).clone().find("div, span").remove().end().text().replace(key, ""));
	return jQuery.trim(jQuery(itemTitle).clone().find("div").remove().end().text().replace(key, ""));
}
// scan rows for row specific icons
function replaceRowSpecificIcons() {
	// title version
	replacementIconHeaders.filter(":contains(':')").each(function(){
		var replacementImage = jQuery(this).parents(tweak_bb.row_element).children("div.details").find("img:first");
		jQuery(tweak_bb.page_id +" h3:contains('"+getRowName(this, "Replacement Icon:")+"'):not('.replacementicon')").each(function(){
			jQuery(this).parents(tweak_bb.row_element).find("img").eq(0).attr("src", replacementImage.attr("src")).addClass("replaced");
		});
	});
	// class version
	jQuery("img.replacemyicon").addClass("replacementicon").each(function() {
		jQuery(this).parents(tweak_bb.row_element).find("img").eq(0).attr("src", jQuery(this).attr("src")).addClass("replaced");
	});
}
function hideIcons() {
	// title version
	jQuery(tweak_bb.page_id +" h3:contains('Hide Icon:')").addClass("hideicon").each(function(){
		jQuery(tweak_bb.page_id +" h3:contains('"+getRowName(this, "Hide Icon:")+"')").each(function(){
			jQuery(this).parents(tweak_bb.row_element).find("div.item_icon img, img.item_icon").hide();
		});
	});
	// class version
	jQuery(tweak_bb.page_id +" .hidemyicon").parents(tweak_bb.row_element).find("div.item_icon img, img.item_icon").hide();
}
// trigger function on page load
jQuery(function() {
	// replace and hide
	findReplacementIcons();
	hideIcons();
	// clean up
	if (jQuery("body.ineditmode").length == 0)
	{
		replacementIconHeaders.parents(tweak_bb.row_element).hide();
		jQuery(tweak_bb.page_id +" h3.hideicon").parents(tweak_bb.row_element).hide();	
		jQuery(tweak_bb.page_id +" img.replacementicon").hide();
	}
});