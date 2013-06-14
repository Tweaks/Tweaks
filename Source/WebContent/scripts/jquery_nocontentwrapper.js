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

jQuery(function(){
	jQuery('.vtbegenerated script.tweak_script:contains("jquery_nocontentwrapper")').prevAll('.tweak_bb_blurb').replaceWith('<div class="tweak_bb_blurb warning fieldError" style="width: 500px;margin-top:20px;"><h2 style="margin: 12px 8px">This tweak is no longer supported.</h2><p style="margin: 12px 12px;">Please visit <a href="http://zombo.com">Upgrade Docs</a> for further information about the removal of this tweak.</p></div>');
});

/*
function unWrapLink(link) { 
	var this_href=jQuery(link).attr("href"); 
	if (this_href.search("href=") > -1)
		jQuery(link).attr("href", unescape(this_href.substr(this_href.search("href=")+5, this_href.length)).replace("amp;", "")); 
	else
		jQuery(link).unbind().removeAttr("onclick");		
}

jQuery(function() {
	if (window.tweak_bb == null || window.tweak_bb.page_id == null)
		window.tweak_bb = { page_id: "#pageList", row_element: "li" };

	jQuery(tweak_bb.page_id +" div.noContentWrapper a").each(function() { unWrapLink(this); });
});

*/