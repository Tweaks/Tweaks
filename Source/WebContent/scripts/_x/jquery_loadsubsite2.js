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
	if ($("body.ineditmode").length == 0) {
		if($("iframe").length) // look for iframe
			$("#content").replaceWith($("iframe:eq(0)").get());
		else
		{ // look for item called site link
			var siteLink = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:cicontains(\"Site Link\")").parents(tweak_bb.row_element).find("a:first");
			// decide on target: if it contains Resource, target this item's content as target, otherwise target whole page
			var target = (siteLink.text().indexOf("Resource")>-1) ? siteLink.parents(tweak_bb.row_element).find("div.details").attr("id", "subsiteTarget") : $("#content");
			if (siteLink.length && target.length)
			{
				unWrapLink(siteLink);
				// check if local url or subdomain url
				var url = siteLink.attr("href");
				var sameDomain = (url.indexOf("/")==0 || url.indexOf(location.protocol+"//"+location.host)==0);
				if (!sameDomain) {
					// pull in if different subdomain within same main domain via parseLocalFile
					var tweak_fileprocessing_path = ((window.tweak_path == null) ? "/webapps/qut-tweakbb-bb_bb60/" : tweak_path) + "files/parseLocalFiles.jsp";
					url = tweak_fileprocessing_path+"?url="+escape(url);
				}
				target.hide();
				target.html("<iframe src=\""+url+"\" width=\"100%\" height=\"2950\" frameBorder=\"0\"></iframe>");
				target.find("iframe").load(restyleFrame).ready(restyleFrame);
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
	} else {
		// todo: test if issue with loading in all browsers
		// logic to process non Blackboard pages
	}
	jQuery("#content, #subsiteTarget").show();
	jQuery("#content iframe").height(frame.find("body").height()+55).css("margin-left", "auto");
	if (window.prepareImportedContent != null) { window.prepareImportedContent(); }
}

function unWrapLink(link) { 
	var this_href=jQuery(link).attr("href"); 
	if (this_href && this_href.indexOf("contentWrapper") > 0)
		jQuery(link).attr("href", unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", "")); 
}