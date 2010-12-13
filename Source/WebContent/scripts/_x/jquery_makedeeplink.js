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
*/   
var getCourseID = function(url) { return url.replace(/Course%26id/, "course_id").replace(/\%3D/g, "=").replace(/.*course_id=([^&%]+).*/, "$1"); }; //.replace(/.*course_id=([^&]+).*/, "$1"); };
var getContentID = function(url) { return url.replace(/Content%26id/, "content_id").replace(/\%3D/g, "=").replace(/.*content_id=([^&%]+).*/, "$1"); }; //.replace(/.*content_id=([^&]+).*/, "$1"); };
var deepLink = function (url) { return "/webapps/portal/frameset.jsp?tab_tab_group_id=_2_1&url=%2fwebapps%2fblackboard%2fcontent%2flistContent.jsp%3fcourse_id%3d"+ getCourseID(url) +"%26content_id%3d" + getContentID(url) + "%26mode%3dreset"; };
jQuery(function($){
	if (window.tweak_bb == null || window.tweak_bb.page_id == null)
		window.tweak_bb = { page_id: "#pageList", row_element: "li" };
	jQuery(".makeDeepLink").each(function() {
		var targetLink = jQuery(this).parents(tweak_bb.row_element).find("a:first");
		targetLink.attr("href", deepLink(targetLink.attr("href"))).attr("target", "_blank").unbind("click");
	})
});