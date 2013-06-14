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
   limitations under the License. */
jQuery(function($) {
	if (window.tweak_bb == null || window.tweak_bb.page_id == null)
		window.tweak_bb = { page_id: "#pageList", row_element: "li" };

	// utility extension: case insensitive contains
	jQuery.expr[':'].cicontains = function(a,i,m){
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};		
	if (tweak_bb.display_view) {
		if($("iframe").length) // look for iframe
			$("#content").replaceWith($("iframe:eq(0)").get());
		else
		{ // look for item called site link
			var siteLink = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:cicontains(\"Site Link\")").parents(tweak_bb.row_element).find("a:first");
			if (siteLink.length)
			{
				unWrapLink(siteLink);
				$("#content").children().remove();
				$("#content").html("<iframe id=\"subsitetweak\"src=\""+siteLink.attr("href")+"\" width=\"100%\" height=\"100%\"frameBorder=\"0\"></iframe>");
				$("#content iframe").load(restyleFrame).ready(restyleFrame);
			}
		}
		$("#contentPanel div.topRound").hide();
	}
});

function restyleFrame() {
	var frame = jQuery("#content iframe").contents();
	window.scrollTo(window.scrollX,0); // trial scroll
	
	// if it's a blackboard-y frame
	if (frame.find("#navigationPane, #breadcrumbs").length) {
		
		// re-style parent content item
		jQuery("#content").css({
			"height": frame.find(".locationPane").height() + 10,
			"border": "none","-moz-border-radius": "none",
			"-webkit-border-radius": "none",
			"border-radius": "none",
			"-moz-box-shadow": "none",
			"-webkit-box-shadow": "none",
			"box-shadow": "none"
		});
		
		// restyle frame elements
		frame.find("body").css("padding","0");
		frame.find("#navigationPane, #breadcrumbs").hide();
		frame.find("div.locationPane").css("margin-top", "0");
		frame.find("#contentPane, div.contentPane").css("margin","0px");
		frame.find("script.tweak_script").parents(tweak_bb.row_element).hide();
		
		// hyperlink click events
		frame.find("a").click(function(){
		
			// check for javascript link, targetted link, hideshow, submenu
			if (jQuery(this).attr("href") == "#" ||
				jQuery(this).filter("[target]").length > 0 ||
				jQuery(this).hasClass("hideShowLink") ||
				jQuery(this).parent("#intmenu").length > 0) {
					// don't get in the way
					return true;
			}
		});
		
		// reveal
		jQuery("#content").show()
	}
}

function unWrapLink(link) { 
	var this_href=jQuery(link).attr("href"); 
	if (this_href && this_href.indexOf("contentWrapper") > 0)
		jQuery(link).attr("href", unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", "")); 
}