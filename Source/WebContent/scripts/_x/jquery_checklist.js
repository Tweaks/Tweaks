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
*/
function callCheckList() {;
	jQuery(function($){
		if (window.tweak_bb == null || window.tweak_bb.page_id == null)
			window.tweak_bb = { page_id: "#pageList", row_element: "li" };

		// look for Mark Reviewed items
		var markReviewedItems = jQuery(tweak_bb.page_id +" "+tweak_bb.row_element+" a[href*=\"eviewed\"]");
		if (markReviewedItems.length) {
			markReviewedItems.hide();
			// generate checklist (not enough for array js optim)
			var checkListCode = "<div class=\"checklist\"><h4>Tasks</h4>";
			markReviewedItems.each(function(i){
				var itemChecked = jQuery(this).text().indexOf("Mark Review")<0;
				var itemRef = jQuery(this).parents(tweak_bb.row_element).find("h3:first");
				var itemID = "ch"+((itemRef.filter("[id]").length) ? itemRef.attr("id") : itemRef.parent().attr("id")); // add checklist ID prefix
				itemRef.prepend("<a name=\"hash_"+itemID+"\" id=\"hash_"+itemID+"\"></a>");
				checkListCode += "<div><input type=\"checkbox\" name=\"checklist\" id=\""+itemID+"\"" +
								(itemChecked?" checked=\"checked\"":"") + "/>" +
								"<label for=\""+itemID+"\">" + itemRef.text() + "</label> <a href=\"#hash_" + itemID+"\">View&nbsp;&gt;</a></div>";			
			});
			checkListCode += "</div>";
			// output
			var target = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:contains(\"Checklist\")").parents(tweak_bb.row_element).find("div.details").css("overflow", "visible");
			if (target.find("span").length)
				target = target.find("span:first");
			target.append(checkListCode);
			
			// attach functionality
			jQuery(tweak_bb.page_id +" .checklist input:checkbox").live("click", function() {
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