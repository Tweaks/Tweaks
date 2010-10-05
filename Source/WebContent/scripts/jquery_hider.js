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

   hider (0.7) is script that can be added to a content item in blackboard. author Tim Plaisted
   it looks to see that content not in edit mode, then hides any rows with items with class: hidemyrow
*/
var rowIdentifier = "hidemyrow";	// change for default identifier for rows
var iconIdentifier = "hidemyicon";	// change for default identifier for icons

jQuery(function($){
	if(location.href.indexOf("Content.")>0) {
		$("#pageList ."+rowIdentifier).parents("li").hide();
		$("#pageList ."+iconIdentifier).parents("li").each(function(){$(this).find(".item_icon").hide();});
	} 
});