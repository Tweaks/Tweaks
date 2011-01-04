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
   limitations under the License. */
jQuery(function($) {
	if (window.tweak_bb == null || window.tweak_bb.page_id == null)
		window.tweak_bb = { page_id: "#pageList", row_element: "li" };

	// utility extension: case insensitive contains
	jQuery.expr[':'].cicontains = function(a,i,m){
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
	};		
	if ($("body.ineditmode").length == 0) {
		if($("iframe").length) // look for iframe
			$("#content").replaceWith($("iframe:eq(0)").get());
		else
		{ // look for item called web package
			var webPackageLink = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children("h3.item, div.item").filter(":cicontains(\"Site Link\")").parents(tweak_bb.row_element).find("a:first");
			if (webPackageLink.length)
			{
				unWrapLink(webPackageLink);
				$("#content").hide();
				$("#content").html("<iframe src=\""+webPackageLink.attr("href")+"\" width=\"100%\" height=\"2950\" frameBorder=\"0\"></iframe>");
				$("#content iframe").load(restyleFrame).ready(restyleFrame);
			}
		}
		$("#contentPanel div.topRound").hide();
	}
});

function restyleFrame() {
	var frame = jQuery("#content iframe").contents();
	window.scrollTo(window.scrollX,0); // trial scroll
	if (frame.find("#navigationPane, #breadcrumbs").length) {
		frame.find("#navigationPane, #breadcrumbs").hide();
		frame.find("body").css("padding","0");
		frame.find("div.locationPane").css("margin-top", "0");
		frame.find("#contentPane, div.contentPane").css("margin","0px 4px 0px 0px");
		frame.find("script.tweak_script").parents(tweak_bb.row_element).hide();
		frame.find("a").click(function(){
			// filtering better here as only occurs on click?
			if (jQuery(this).attr("href") == "#" ||
				jQuery(this).filter("[target]").length > 0 ||
				jQuery(this).hasClass("hideShowLink") ||
				jQuery(this).parent("#intmenu").length > 0) { 
				/* javascript link, targetted link, hideshow, submenu: do nothing */
				return true;
			} else
				jQuery("#content iframe").css("margin-left", "-2000px");
		});
		jQuery("#content").show();
		jQuery("#content iframe").height(frame.find("body").height()+55);
		jQuery("#content iframe").css("margin-left", "auto");
	}
}

function unWrapLink(link) { 
	var this_href=jQuery(link).attr("href"); 
	if (this_href && this_href.indexOf("contentWrapper") > 0)
		jQuery(link).attr("href", unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", "")); 
}