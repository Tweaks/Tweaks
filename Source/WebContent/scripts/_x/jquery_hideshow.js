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

 * jquery_hideshow (1.0) is script that can be added to a content item in blackboard
 * it prepends show hide toggle link and functionality to div tags marked class="hidden"
 */

// Usage 1. wrap content in <div class="hidden">YOUR CONTENT</div>

// Optional add <span id="showHideInstruction">[Your own hide show instruction here]</span>
// Optional add '<div class="hidemyrow"></div>' somewhere to hide a row

var defaultInstruction = "Show/hide text";	// change this for default instructional text
var hideClass = "hidden";

jQuery(function($) {
 if (window.tweak_bb == null || window.tweak_bb.page_id == null)
	window.tweak_bb = { page_id: "#pageList", row_element: "li" };
	
 instText = ($("#showHideInstruction").length) ? $("#showHideInstruction").text() : defaultInstruction;
 $("<a href='#' class='hideShowLink'>"+instText+"</a>").insertBefore(tweak_bb.page_id+" div."+hideClass);
 $(tweak_bb.page_id+" a.hideShowLink").click(function(e){ $(this).next().toggleClass("hidden"); e.preventDefault();});
 if (tweak_bb.display_view) {
	 $(tweak_bb.page_id+" .hidemyrow").parents(tweak_bb.row_element).hide();
	 $("#showHideInstruction").hide();
 }
});