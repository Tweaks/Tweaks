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
   
looks for "Banner" item or image with id="banner" and inserts it above the page title
experimental - looks for "Site Banner" to make a banner that sticks across pages
*/
function setupSiteBanner($){
	// setup if site banner not already set up
	if (top.window.sitebanner == null) { 
		var sb = top.window.sitebanner = { 
			// util functions
			getCourseID: function(url) { return url.replace(/Course%26id/, "course_id").replace(/\%3D/g, "=").replace(/.*course_id=([^&%]+).*/, "$1"); },
			getContentFrame: function() { return top.frames.length ? top.frames["content"].window : window; },
			isCurrentSite: function() { return (this.siteid == this.getCourseID(this.getContentFrame().location.href)); },
			addSiteBanner: function() {
				var sb = top.window.sitebanner;
				var cf = sb.getContentFrame();
				var cfd = cf.document;
				if (window.jQuery == null)
					jQuery = top.window.jQuery;
				// if there is no banner on page and this is not an edit page (TBD test this more.. there will be other odd pages)
				if (cfd && jQuery("#pageTitleDiv > #banner, #step1, #helpTextToggleImg", cfd).length == 0) {
					// if still on current site -> add banner to page
					if(sb.isCurrentSite()) {
						jQuery("#pageTitleDiv", cfd).prepend(sb.bannerHTML); /* prefer to copy object.. but needs more testing */ //sb.banner.prependTo("#pageTitleDiv", cfd);
						jQuery("#titleicon", cfd).hide();
						jQuery("#pageTitleDiv h1", cfd).css("padding-top", "8px");
					} else {
						// remove function from events queue
						top.window.jQuery("#content").unbind(".sitebanner");
						// destroy banner data
						top.window.sitebanner = null;
					}
				}
			},
			siteid: "",
			bannerHTML: ""
		};
		// set siteid and banner
		sb.siteid = sb.getCourseID(top.window.location.href);
		sb.bannerHTML = jQuery("<div>").append(jQuery("#banner").clone()).remove().html();
		// append insert Banner functionality to frame style events
		//top.window.jQuery("#content").load(top.window.sitebanner.addSiteBanner).ready(top.window.sitebanner.addSiteBanner); 
		top.window.jQuery("#content").bind("load.sitebanner ready.sitebanner", top.window.sitebanner.addSiteBanner); 
	}
}

// normal page banner
jQuery(function($){
	// find banner and append
	if ($("#banner").length == 0)
		$("#pageList h3.item:contains(\"Banner\"):eq(0)").next("div.details").find("img:first").attr("id","banner");
	$("#banner").css("display", "block").parents("li").addClass("banner").hide().end().prependTo("#pageTitleDiv");
	// style
	$("#titleicon").hide();
	$("#pageTitleDiv h1").css("padding-top", "8px");
	// edit mode
	if (location.href.indexOf("listContentEditable.jsp")>0)
		$("#pageList li.banner").show();

	// experimental check if Banner is Site Banner
	if ($("#pageList li.banner h3.item:contains(\"Site Banner\")").length)
		setupSiteBanner($);
});