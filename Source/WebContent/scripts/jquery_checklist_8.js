// check list. author Tim Plaisted 2009
function callCheckList() {;
	jQuery(function($){
	 // new 8
	 var editMode = jQuery("#endActionBar").length > 0; 
	 var page = editMode ?  jQuery("#endActionBar ~ table:eq(0)") : jQuery("h1.pageTitle").next("table");
	 page.attr("id", "pageList");
	 
		// look for Mark Reviewed items
		// 9: var markReviewedItems = jQuery("#pageList li a[href*=\"eviewed\"]");
		var markReviewedItems = jQuery("#pageList tr a[href*=\"eviewed\"]");
		if (markReviewedItems.length) {
			markReviewedItems.hide();
			// generate checklist (not enough for array js optim)
			var checkListCode = "<div class=\"checklist\"><h4>Tasks</h4>";
			markReviewedItems.each(function(i){
				// 9: var itemChecked = jQuery(this).text().indexOf("Mark Review")<0;
				var itemChecked = jQuery(this).text().indexOf("Mark As Reviewed")<0;
				// 9: var itemRef = jQuery(this).parents("li").find("h3.item");
				var itemRef = jQuery(this).parents("tr").find("span.label");
				var itemRefID = jQuery(this).parents("tr").find("td:first");
				// 9: var itemID = "ch"+itemRef.attr("id"); // add checklist ID prefix
				var itemID = "ch"+itemRefID.attr("id"); // add checklist ID prefix
				itemRef.prepend("<a name=\"hash_"+itemID+"\" id=\"hash_"+itemID+"\"></a>");
				checkListCode += "<div><input type=\"checkbox\" name=\"checklist\" id=\""+itemID+"\"" +
								(itemChecked?" checked=\"checked\"":"") + "/>" +
								"<label for=\""+itemID+"\">" + itemRef.text() + "</label> <a href=\"#hash_" + itemID+"\">View&nbsp;&gt;</a></div>";			
			});
			checkListCode += "</div>";
			// output
			// 9: jQuery("#pageList h3.item:contains(\"Checklist\")").parents("li").find("div.details span").append(checkListCode);
			jQuery("#pageList span.label:contains(\"Checklist\") ~ span:eq(0)").append(checkListCode);
			// attach functionality
			jQuery("#pageList .checklist input:checkbox").live("click", function() {
				var thisID = jQuery(this).attr("id").substr(2);
				if(jQuery(this).is(':checked'))
					markReviewed(thisID);
				else
					markUnreviewed(thisID);
			});
		}
	});
}
setTimeout('callCheckList()', 120);