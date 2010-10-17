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
jQuery(function($){
	$("#pageList > li > h3:contains('Stylesheet')").parents("li").find("ul.attachments").addClass("hidemyrow").find("a").each(function() {
		var thisLink = $(this).attr("href");
		$(this).after("<div class=\"loadStyle\">"+ thisLink.substr(thisLink.search("/course"))+"</div>");
	});
	$("#pageList .hidemyrow").parents("li").hide();
	$("body.ineditmode #pageList .hidemyrow").parents("li").show();				
	$("#pageList .loadStyle").each(function(){
		var URLofCSS = $(this).hide().text();
		if (URLofCSS && URLofCSS.indexOf("/") == 0) {
			URLofCSS = URLofCSS.substr(1);
			$.xLazyLoader('loadRootPath', { css: URLofCSS});
		}
	});
	$("body.ineditmode #pageList .loadStyle").show();
});