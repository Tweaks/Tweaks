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
   version 2. author Tim Plaisted 2010
*/
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
			var webPackageLink = $(tweak_bb.page_id +" > "+tweak_bb.row_element).children(".item:cicontains(\"Web Package\")").parents(tweak_bb.row_element).find("a:first");
			if(webPackageLink.length)
				$("#content").html("<iframe src=\""+webPackageLink.attr("href")+"\" width=\"100%\" height=\"950\" frameBorder=\"0\"></iframe>");
		} 
	}
});