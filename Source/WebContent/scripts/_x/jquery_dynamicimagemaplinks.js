/* 
   Copyright 2011 Tim Plaisted, Queensland University of Technology

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   
	Dynamically link image map using blackboard links
	Version: 1.6
	Author: Tim Plaisted 2011
	Usage: 1. Add image map to image, and use ALT tags to enter short description of links, href can be left at "#".
	       2. Add Blackboard folders, items with files, site or external links with title as full description (including short description text exactly e.g. unit code).
	       3. Optionally include detailed description in details field -- and add a HTML item with id="description" to have mouseover text
*/
jQuery(function($){
  if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };
	
  // preload headers and description parsing outside of loops
  var headers = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item");
  var descItem = $("#description, .description");

  // 9.x utility functions to preload images
  var buildPreload = function(src, index) {
	return (jQuery.browser.mozilla) ?
		"<iframe src=\""+src+"\" name=\""+index+"\" width=\"55\" height=\"55\"></iframe>" :
		"<img src=\""+src+"\" id=\""+index+"\" width=\"55\" height=\"55\">";
  };
  var getPreloadURL = function(url, framename) {
	return (jQuery.browser.mozilla) ? 
		frames[framename].window.location.href :
		url;
  };

  // check if rollover images set up required (
  var hasRollovers = false, rolloverItems, preloadrolloverHTML = "";
  var rolloverRow = headers.filter(":contains('Rollover Images'):first").parents(tweak_bb.row_element);
  if (rolloverRow) {
  	rolloverItems = rolloverRow.find("ul.attachments a");
  	hasRollovers = (rolloverItems.length > 0);
  }
  
  $(tweak_bb.page_id+" map").each(function() {
	// parse each map
    var thisMapName = $(this).attr("name");
    var thisMapImage = $("img[usemap*=\""+thisMapName+"\"]");
    var thisMapImageSrc = $(thisMapImage).attr("src");
    
    // parse each maps area tags
	$(this).children().each(function(index, areaItem) {
		var altText = $.trim($(areaItem).attr("alt"));
		if (altText.length) {
			// find alt text in page headers
			var matchingHeader = headers.filter(":contains('"+altText+"'):first");
			if (matchingHeader.length) {
				// check header for a link
				var link = $(matchingHeader).find("a:first:contains('"+altText+"')");
				var details = $(matchingHeader).parents(tweak_bb.row_element).children("div.details");
				
				// if no link found in header, look for item's file attachment
				if (link.length == 0)
					link = details.find("ul.attachments a:first");
				
				// look for description: store html or text with map item
				if (descItem.length) {
					var desc = (descItem.hasClass("html")) ? details.clone().html() : $.trim(details.clone().remove("a").text());
					if (desc) { $(areaItem).data("desc", desc); }
				}
				
				// if link found
				if (link.length) {
					$(areaItem).attr("href", link.attr("href"));
					if (tweak_bb.display_view)
						$(matchingHeader).parents(tweak_bb.row_element).hide();
				}
			}
			
			// rollover images: find and attach rollover functionality
			if (hasRollovers) {
				var matchingRolloverItem = rolloverItems.filter(":contains('"+altText+"'):first");
				if (matchingRolloverItem.length) {
					var this_href= matchingRolloverItem.attr("href");
					if (this_href.search("href=") > -1)
						this_href = unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", ""); 
					var this_rolloverid = thisMapName+"_"+index;
					preloadrolloverHTML += buildPreload(this_href, this_rolloverid);
					$(this).mouseover(function(){
						thisMapImage.attr("src", getPreloadURL(this_href, this_rolloverid));
					});
				}
			}
		}
	});
	
	// add preload images and attach mouseout event
	if (hasRollovers) {
		var this_rolloverid = thisMapName+"_"+0;
		preloadrolloverHTML += buildPreload(thisMapImageSrc, this_rolloverid);
	  	rolloverRow.find("div.details").append(preloadrolloverHTML);
		$(this).children().mouseout(function(){ 
			thisMapImage.attr("src", getPreloadURL(thisMapImageSrc, this_rolloverid));
		});
	}
  });
    
  // attach description event
  if (descItem.length) {
	$("area").mouseover(function(){
		var desc = jQuery(this).data("desc");
		if (desc != null) { 
			if (descItem.hasClass("html"))
				descItem.html(desc+" ");
			else
				descItem.text(desc+" ");
		}
	});
  }
  
  // finish tidy up after preload images added
  if (hasRollovers)
	rolloverRow.toggle(tweak_bb.display_view == false);
});