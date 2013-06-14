/*	Dynamically link image map using blackboard links
	Version: 1.4
	Author: Tim Plaisted 2010
	Usage: 1. Add image map to image, and use ALT tags to enter short description of links, href can be left at "#".
	       2. Add Blackboard folders, items with files, site or external links with title as full description (including short description text exactly e.g. unit code).
	*/
jQuery(function($){
  // new 8
  var editMode = jQuery("#endActionBar").length > 0; 
  var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
  page.attr("id", "pageList");

  // todo: test multiple image maps
  $("#pageList map").children().each(function() {
	var altText = $.trim($(this).attr("alt"));
	if (altText.length) {

		// find alt text in page headers
		// 9: var matchingHeader = $("#pageList h3.item:contains('"+altText+"')");
		var matchingHeader =  $("#pageList span.label:contains('"+altText+"')");

		// check header for a link
		// 9: var link = $(matchingHeader).find("a:first:contains('"+altText+"')");
		var link = matchingHeader.parents("a:contains('"+altText+"')");
		
		// if no link found in header, look for item's file attachment
		if (link.length == 0) {
			// 9: link = $(matchingHeader).next("div.details").find("ul.attachments a:first");
			link = matchingHeader.nextAll("a:first");
		}
		if (link.length) {
			$(this).attr("href", link.attr("href"));
			// 9: if (window.tweak_bb_display_view || tweak_bb.display_view)
			// 9: 	$(matchingHeader).parents("li").hide();
			if (!editMode)
				matchingHeader.parents("tr").hide();
			// 8: MSIE hack: can't predict script order execution, so hiding from sub menu tweak
			$("#intmenu").find("a:contains('"+altText+"')").hide();
		}
	}
  });
});