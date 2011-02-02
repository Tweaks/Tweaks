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
	Version: 1.5
	Author: Tim Plaisted 2010
	Usage: 1. Add image map to image, and use ALT tags to enter short description of links, href can be left at "#".
	       2. Add Blackboard folders, items with files, site or external links with title as full description (including short description text exactly e.g. unit code).
	       3. Optionally include detailed description in details field -- and add a HTML item with id="description" to have mouseover text
*/
jQuery(function($){
  if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };
	
  // load headers as parsed several times in script
  var headers = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item");

  $(tweak_bb.page_id+" map").children().each(function() {
	var altText = $.trim($(this).attr("alt"));
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
			
			// look for description
			var desc = details.clone().remove("a").text();
			if (desc) { $(this).data("desc", desc); }
				
			if (link.length) {
				$(this).attr("href", link.attr("href"));
				if ($("body.ineditmode").length == 0)
					$(matchingHeader).parents(tweak_bb.row_element).hide();
			}
		}
	}
  });
  
  // attach description event
  if ($("#description, .description").length) {
	$(tweak_bb.page_id+" map area").mouseover(function(){
		var desc = jQuery(this).data("desc");
		if (desc != null) { jQuery("#description, .description").text(desc)+" "; }
	});
  }
});