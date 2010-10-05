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
jQuery(function($) {
	if ($("#topTarget").length == 0) {
		$("#content").before("<a name=\"top\" id=\"topTarget\"></a>");		
		$linkRows = $("#pageList script.tweak_script").parents("li").filter(":contains(\"Back to Top\")");
				   //("#pageList li:contains(\"Back to Top\") script.tweak_script").parents("li"); // Note: not working in IE
		$linkRows.find("div.details").append("<a href=\"#top\">Back to top</a>");
		if ($("body.ineditmode").length == 0) {
			$linkRows.find("img:eq(0), h3, div.details span").hide().end().find("script").removeClass("tweak_script").parents("li").show();
			$("#pageList script.tweak_script").parents("li").hide(); // IE
		}
	}
});